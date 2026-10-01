import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

/**
 * Dependency-light admin session handling.
 *
 * The session cookie is a base64url JSON payload `{ sub, role, exp }` plus an
 * HMAC-SHA256 signature computed with Web Crypto over the payload, using
 * SESSION_SECRET. No external auth library required.
 */

export const SESSION_COOKIE = "shery_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

function base64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Buffer.from(view).toString("base64url");
}

function base64urlDecode(input: string): Uint8Array {
  return new Uint8Array(Buffer.from(input, "base64url"));
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return base64urlEncode(sig);
}

export interface SessionPayload {
  sub: string;
  role: "ADMIN" | "CUSTOMER";
  exp: number; // epoch seconds
}

export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">
): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64urlEncode(new TextEncoder().encode(JSON.stringify(body)));
  const sig = await hmacSign(encoded, secret);
  return `${encoded}.${sig}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = await hmacSign(encoded, secret);
  // constant-time comparison
  const a = base64urlDecode(sig);
  const b = base64urlDecode(expected);
  if (a.length !== b.length) return null;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  if (diff !== 0) return null;
  try {
    const body = JSON.parse(
      new TextDecoder().decode(base64urlDecode(encoded))
    ) as SessionPayload;
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

/** Read the session from a NextRequest (middleware / route handlers). */
export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
