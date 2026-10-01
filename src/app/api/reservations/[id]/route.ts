import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const StatusPatch = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"]),
});

/** Admin: update a reservation's status (accept / reject / cancel). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { status } = StatusPatch.parse(await req.json());
    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status: status as never },
    });
    return NextResponse.json({ reservation });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
