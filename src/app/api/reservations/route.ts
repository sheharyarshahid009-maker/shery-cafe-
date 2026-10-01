import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const ReservationInput = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(7).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  timeSlot: z.string().min(3).max(30),
  guests: z.number().int().min(1).max(30),
  areaType: z.enum(["TABLE", "PS5", "VR", "SNOOKER", "ARCADE"]).default("TABLE"),
  notes: z.string().max(500).optional().or(z.literal("")),
});

/** Public: create a reservation (instant on-screen confirmation). */
export async function POST(req: NextRequest) {
  try {
    const body = ReservationInput.parse(await req.json());
    const date = new Date(`${body.date}T00:00:00.000Z`);
    if (date < new Date(new Date().toISOString().slice(0, 10))) {
      return NextResponse.json(
        { error: "Reservation date must be today or later" },
        { status: 400 }
      );
    }
    const reservation = await prisma.reservation.create({
      data: {
        name: body.name,
        phone: body.phone,
        date,
        timeSlot: body.timeSlot,
        guests: body.guests,
        areaType: body.areaType,
        notes: body.notes || null,
      },
    });
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    return NextResponse.json({ error: "Failed to book" }, { status: 500 });
  }
}

/** Admin: list reservations, newest first, optional status filter. */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const reservations = await prisma.reservation.findMany({
    where: status ? { status: status as never } : {},
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: 200,
  });
  return NextResponse.json({ reservations });
}
