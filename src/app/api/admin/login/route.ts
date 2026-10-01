import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSessionToken,
  sessionCookieHeader,
} from "@/lib/auth";

const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Admin sign-in: verifies credentials and sets a signed session cookie. */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = LoginInput.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const token = await createSessionToken({ sub: user.id, role: "ADMIN" });
    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", sessionCookieHeader(token));
    return res;
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
