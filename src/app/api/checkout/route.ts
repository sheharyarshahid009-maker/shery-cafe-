import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { createPaymentIntent, isStripeConfigured } from "@/lib/stripe";

const CartItemInput = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.number().int().min(1).max(20),
  customizations: z
    .array(
      z.object({
        option: z.string(),
        choice: z.string(),
        priceDeltaCents: z.number().int(),
      })
    )
    .default([]),
});

const CheckoutInput = z.object({
  items: z.array(CartItemInput).min(1).max(50),
  type: z.enum(["DELIVERY", "PICKUP", "DINE_IN"]).default("DELIVERY"),
  paymentMethod: z
    .enum(["STRIPE", "JAZZCASH", "EASYPAISA", "COD", "PAY_AT_TABLE"])
    .default("COD"),
  promoCode: z.string().max(30).optional().or(z.literal("")),
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(7).max(20),
  address: z.string().max(300).optional().or(z.literal("")),
  tableNumber: z.string().max(10).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  ageVerified: z.boolean().default(false),
});

/**
 * Validate promo and compute discount in cents.
 */
async function applyPromo(
  code: string | undefined,
  subtotalCents: number
): Promise<{ discountCents: number; code: string | null }> {
  if (!code) return { discountCents: 0, code: null };
  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.active) throw new Error("Promo code is invalid or inactive");
  if (promo.expiresAt && promo.expiresAt < new Date())
    throw new Error("Promo code has expired");
  if (promo.minOrderCents && subtotalCents < promo.minOrderCents)
    throw new Error(
      `Promo requires a minimum order of Rs ${(promo.minOrderCents / 100).toFixed(0)}`
    );
  let discount = Math.floor((subtotalCents * promo.percentOff) / 100);
  if (promo.maxDiscountCents) discount = Math.min(discount, promo.maxDiscountCents);
  return { discountCents: discount, code: promo.code };
}

export async function POST(req: NextRequest) {
  try {
    const body = CheckoutInput.parse(await req.json());

    // Load items from DB so prices are authoritative (never trust client totals)
    const ids = body.items.map((i) => i.menuItemId);
    const dbItems = await prisma.menuItem.findMany({ where: { id: { in: ids } } });
    const byId = new Map(dbItems.map((i) => [i.id, i]));

    let subtotalCents = 0;
    const orderItems: {
      menuItemId: string;
      quantity: number;
      unitPriceCents: number;
      customizations: unknown;
    }[] = [];

    for (const line of body.items) {
      const db = byId.get(line.menuItemId);
      if (!db || !db.isAvailable)
        throw new Error("One of the items is no longer available");
      if (db.isAgeRestricted && !body.ageVerified)
        throw new Error("Age verification (18+) is required for sheesha items");
      const unit =
        db.priceCents +
        line.customizations.reduce((s, c) => s + c.priceDeltaCents, 0);
      subtotalCents += unit * line.quantity;
      orderItems.push({
        menuItemId: db.id,
        quantity: line.quantity,
        unitPriceCents: unit,
        customizations: line.customizations as never,
      });
    }

    const { discountCents, code } = await applyPromo(
      body.promoCode || undefined,
      subtotalCents
    );
    const totalCents = Math.max(0, subtotalCents - discountCents);

    const order = await prisma.order.create({
      data: {
        type: body.type as never,
        paymentMethod: body.paymentMethod as never,
        paymentStatus: "UNPAID",
        subtotalCents,
        discountCents,
        totalCents,
        promoCode: code,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        address: body.address || null,
        tableNumber: body.tableNumber || null,
        notes: body.notes || null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Payment handling
    let clientSecret: string | null = null;
    let paymentIntentId: string | null = null;
    let mockPayment = false;

    if (body.paymentMethod === "STRIPE") {
      const intent = await createPaymentIntent(totalCents, "pkr", {
        orderId: order.id,
      });
      clientSecret = intent.clientSecret;
      paymentIntentId = intent.paymentIntentId;
      mockPayment = intent.mock;
    } else if (body.paymentMethod === "JAZZCASH" || body.paymentMethod === "EASYPAISA") {
      // Manual/mobile-wallet flow: the customer is shown wallet instructions and
      // the order stays UNPAID until staff confirms. Mock reference for demo.
      paymentIntentId = `manual_${body.paymentMethod.toLowerCase()}_${order.id.slice(0, 8)}`;
      mockPayment = true;
    }
    // COD / PAY_AT_TABLE: nothing to do — paid on fulfilment.

    return NextResponse.json(
      {
        order,
        payment: {
          method: body.paymentMethod,
          clientSecret,
          paymentIntentId,
          mock: mockPayment,
          stripeConfigured: isStripeConfigured(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 400 }
    );
  }
}
