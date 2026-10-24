import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal single-admin HMAC-signed cookie session, following the
 * iron-session-style pattern recommended for Cache Components:
 * the cookie is checked per request, never cached on the server.
 */

export const SESSION_COOKIE = "sd_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

type SessionPayload = { exp: number };

function getSecret(): Buffer {
  const raw =
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "dev-only-insecure-secret"
      : undefined);
  if (!raw) {
    throw new Error(
      "AUTH_SECRET is required in production. Set it before requesting /admin.",
    );
  }
  return Buffer.from(raw, "utf8");
}

function sign(value: Buffer): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    } satisfies SessionPayload),
  );
  return `${payload.toString("base64url")}.${sign(payload)}`;
}

/**
 * Cryptographic + structural check only — deliberately does NOT read the
 * wall clock. Next.js intercepts `Date.now()` in app code during prerender
 * passes; expiry comparison is the caller's responsibility at request time.
 */
export type TokenCheck =
  | { status: "invalid" }
  | { status: "signed"; exp: number };

export function verifySessionToken(token: string | undefined): TokenCheck {
  if (token) {
    const [body, mac] = token.split(".");
    if (body && mac) {
      const expected = sign(Buffer.from(body, "base64url"));
      const a = Buffer.from(mac);
      const b = Buffer.from(expected);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        try {
          const payload = JSON.parse(
            Buffer.from(body, "base64url").toString("utf8"),
          ) as SessionPayload;
          if (typeof payload.exp === "number") {
            return { status: "signed", exp: payload.exp };
          }
        } catch {
          // fall through to invalid
        }
      }
    }
  }
  return { status: "invalid" };
}

/** Password comparison safe against timing attacks. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "admin";
}

/**
 * Used inside 'use cache: private' scopes only: returns the raw signed-token
 * verdict without any wall-clock access, keeping pragma scopes prerender-safe.
 */
export async function readSessionToken(): Promise<TokenCheck> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Full check for request-only contexts (server actions, route handlers). */
export async function hasValidSession(): Promise<boolean> {
  const check = await readSessionToken();
  return check.status === "signed" && check.exp > Date.now() / 1000;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function newSecretValue(): string {
  return randomBytes(12).toString("base64url");
}
