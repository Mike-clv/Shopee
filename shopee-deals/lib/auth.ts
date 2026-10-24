import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { adminEmail, readSessionToken } from "./session";

export type Admin = { email: string };

/**
 * Private-cached token read. Cryptographic check only — no wall-clock
 * access, so the body is safe inside prerender passes. Result stays
 * per-request (private cache), never on a shared server cache.
 */
export async function getAdminState(): Promise<
  { kind: "none" } | { kind: "signed"; exp: number }
> {
  "use cache: private";
  const check = await readSessionToken();
  return check.status === "signed" ? { kind: "signed", exp: check.exp } : { kind: "none" };
}

function classify(exp: number | null): boolean {
  return exp !== null && exp > Date.now() / 1000;
}

/**
 * Request-time admin read for UI. `connection()` forces request-time
 * semantics for the expiry comparison, which must happen outside the
 * private cache scope. Await inside a <Suspense> boundary.
 */
export async function getCurrentAdmin(): Promise<Admin | null> {
  await connection();
  const state = await getAdminState();
  if (!classify(state.kind === "signed" ? state.exp : null)) return null;
  return { email: adminEmail() };
}

/** Same as getCurrentAdmin but redirects when not signed in. */
export async function requireAdmin(): Promise<Admin> {
  await connection();
  const state = await getAdminState();
  if (!classify(state.kind === "signed" ? state.exp : null)) {
    redirect("/login");
  }
  return { email: adminEmail() };
}

/**
 * Guard shared by mutation server actions. Server actions always run in
 * request context, so the wall-clock comparison is safe here.
 */
export async function assertAdminSession(): Promise<void> {
  const { hasValidSession } = await import("./session");
  if (!(await hasValidSession())) {
    throw new Error("Unauthorized admin action");
  }
}
