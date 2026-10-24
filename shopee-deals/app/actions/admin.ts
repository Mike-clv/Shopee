"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { couponDeals } from "@/lib/db/schema";
import { assertAdminSession } from "@/lib/auth";
import {
  createSessionToken,
  passwordMatches,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";
import { syncAccesstrade } from "@/lib/coupons/sync";
import { SITE } from "@/lib/site";

export type ActionState = { error?: string; ok?: string };

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");

  if (!passwordMatches(password)) {
    return { error: "Mật khẩu không đúng." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

function expireToIso(fd: FormData, key: string): Date | null {
  const raw = String(fd.get(key) ?? "").trim();
  if (!raw) return null;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? null : new Date(t);
}

/** Manual add/edit. `id` empty → insert; otherwise update by id. */
export async function upsertDealAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdminSession();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const affLink = String(formData.get("affLink") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;

  if (!title || !affLink) {
    return { error: "Cần tối thiểu: tiêu đề và link." };
  }
  let linkUrl: URL;
  try {
    linkUrl = new URL(affLink);
  } catch {
    return { error: "Link không hợp lệ (cần đầy đủ https://…)." };
  }

  const values = {
    title,
    affLink: linkUrl.toString(),
    code,
    content: String(formData.get("content") ?? "").trim() || null,
    image: String(formData.get("image") ?? "").trim() || null,
    merchant: String(formData.get("merchant") ?? "").trim() || "shopee",
    merchantName: String(formData.get("merchantName") ?? "").trim() || null,
    domain: linkUrl.hostname,
    endTime: expireToIso(formData, "endTime"),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    source: "manual" as const,
    updatedAt: new Date(),
  };

  const db = await getDatabase();
  if (id) {
    await db.update(couponDeals).set(values).where(eq(couponDeals.id, id));
  } else {
    await db.insert(couponDeals).values(values);
  }

  // Read-your-writes: admin sees their change immediately.
  updateTag(SITE.couponsTag);
  return { ok: id ? "Đã cập nhật mã." : "Đã thêm mã mới." };
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const db = await getDatabase();
  await db
    .update(couponDeals)
    .set({ isActive: sql`not ${couponDeals.isActive}`, updatedAt: new Date() })
    .where(eq(couponDeals.id, id));
  updateTag(SITE.couponsTag);
}

export async function toggleFeaturedAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const db = await getDatabase();
  await db
    .update(couponDeals)
    .set({
      isFeatured: sql`not ${couponDeals.isFeatured}`,
      updatedAt: new Date(),
    })
    .where(eq(couponDeals.id, id));
  updateTag(SITE.couponsTag);
}

export async function deleteDealAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const db = await getDatabase();
  await db.delete(couponDeals).where(eq(couponDeals.id, id));
  updateTag(SITE.couponsTag);
}

/** Manual "Sync ngay" — same pipeline as cron, trigger name differs. */
export async function syncNowAction(): Promise<void> {
  await assertAdminSession();
  // syncAccesstrade() expires the coupons tag itself (expire: 0), so the admin
  // sees the fresh data on the next render — no extra invalidation needed.
  await syncAccesstrade("manual");
}
