import "server-only";
import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
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

/**
 * Password comparison safe against timing attacks. Both sides are digested to
 * a fixed 32-byte block first so the compare never leaks the admin password's
 * length (a raw length-mismatch short-circuit would).
 */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const sha = (value: string) =>
    createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(sha(input), sha(expected));
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

/*
 * Login brute-force throttle (single trusted client is still worth slowing
 * down): per-key sliding window, N failures inside the window locks the key
 * out temporarily. State is per-runtime in-memory — imperfect for serverless
 * multi-instance but meaningful protection for this single-admin site, and
 * free (no external store dependency).
 */
const LOGIN_WINDOW_MS = 10 * 60_000;
const LOGIN_MAX_FAILURES = 5;
const LOGIN_LOCK_MS = 10 * 60_000;

type LoginAttempt = { failures: number; windowStart: number; lockedUntil: number };
const loginAttempts = new Map<string, LoginAttempt>();
let lastPruneMs = 0;

function pruneLoginAttempts(now: number): void {
  if (now - lastPruneMs < 60_000 && loginAttempts.size < 500) return;
  lastPruneMs = now;
  for (const [key, entry] of loginAttempts) {
    if (
      now - entry.windowStart > LOGIN_WINDOW_MS &&
      entry.lockedUntil <= now
    ) {
      loginAttempts.delete(key);
    }
  }
}

/** Is `key` currently allowed to attempt a login? */
export function loginThrottleStatus(key: string): {
  locked: boolean;
  retryAfterMs: number;
} {
  const now = Date.now();
  pruneLoginAttempts(now);
  const entry = loginAttempts.get(key);
  if (entry && entry.lockedUntil > now) {
    return { locked: true, retryAfterMs: entry.lockedUntil - now };
  }
  return { locked: false, retryAfterMs: 0 };
}

/** Record one failed attempt; may engage the lockout. Returns current status. */
export function recordLoginFailure(key: string): {
  locked: boolean;
  retryAfterMs: number;
} {
  const now = Date.now();
  pruneLoginAttempts(now);
  const entry = loginAttempts.get(key);
  if (!entry || now - entry.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { failures: 1, windowStart: now, lockedUntil: 0 });
    return { locked: false, retryAfterMs: 0 };
  }
  entry.failures += 1;
  if (entry.failures >= LOGIN_MAX_FAILURES) {
    entry.lockedUntil = now + LOGIN_LOCK_MS;
    entry.failures = 0;
    entry.windowStart = now;
    return { locked: true, retryAfterMs: LOGIN_LOCK_MS };
  }
  return { locked: false, retryAfterMs: 0 };
}

/** Reset the count after a successful login. */
export function clearLoginFailures(key: string): void {
  loginAttempts.delete(key);
}
