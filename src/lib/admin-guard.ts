import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./auth";

/** Returns an error response when the caller is not an admin, else null. */
export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  const session = await getSession(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
