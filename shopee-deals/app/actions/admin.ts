"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { campaignBanners, couponDeals } from "@/lib/db/schema";
import { assertAdminSession } from "@/lib/auth";
import {
  clearLoginFailures,
  createSessionToken,
  loginThrottleStatus,
  passwordMatches,
  recordLoginFailure,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";
import { syncAll } from "@/lib/coupons/sync";
import { SITE } from "@/lib/site";

export type ActionState = { error?: string; ok?: string };

/** Rough caller identity for the login throttle (proxy-free local → "direct"). */
async function callerKey(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "direct";
}

/** Manual add/edit URLs must be http(s) — anything else never enters the DB. */
function safeHttpUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  return url.protocol === "http:" || url.protocol === "https:" ? url : null;
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");

  const key = await callerKey();
  const status = loginThrottleStatus(key);
  if (status.locked) {
    return {
      error: `Đã có quá nhiều lần thử sai. Vui lòng thử lại sau ${Math.ceil(
        status.retryAfterMs / 60_000,
      )} phút.`,
    };
  }

  if (!passwordMatches(password)) {
    recordLoginFailure(key);
    return { error: "Mật khẩu không đúng." };
  }
  clearLoginFailures(key);

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
  // http(s) only — mirrors the /go redirect guard so nothing odd (javascript:,
  // corrupt scheme, internal host) can ever reach the redirect layer.
  const linkUrl = safeHttpUrl(affLink);
  if (!linkUrl || !linkUrl.hostname) {
    return { error: "Link không hợp lệ (cần đầy đủ http:// hoặc https://…)." };
  }
  const imageRaw = String(formData.get("image") ?? "").trim();
  if (imageRaw) {
    const imageUrl = safeHttpUrl(imageRaw);
    if (!imageUrl) {
      return { error: "Ảnh không hợp lệ (cần http:// hoặc https://…)." };
    }
  }

  const values = {
    title,
    affLink: linkUrl.toString(),
    code,
    content: String(formData.get("content") ?? "").trim() || null,
    image: imageRaw || null,
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

/**
 * Manual banner add (admin). Image must be http(s); the link may be an
 * external aff URL or an internal path ("/tim-kiem?merchant=…").
 */
export async function addBannerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdminSession();

  const imageRaw = String(formData.get("imageUrl") ?? "").trim();
  const linkRaw = String(formData.get("linkUrl") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;

  const imageUrl = safeHttpUrl(imageRaw);
  if (!imageUrl) {
    return { error: "Ảnh banner không hợp lệ (cần http:// hoặc https://…)." };
  }

  // External http(s) link or an internal path starting with "/"; anything
  // else (javascript:, bare host, empty) is rejected.
  let linkUrl: string | null = null;
  if (linkRaw) {
    if (linkRaw.startsWith("/") && !linkRaw.startsWith("//")) {
      linkUrl = linkRaw;
    } else {
      const parsed = safeHttpUrl(linkRaw);
      if (!parsed) {
        return {
          error: "Link không hợp lệ (cần https://… hoặc đường dẫn nội bộ bắt đầu bằng /).",
        };
      }
      linkUrl = parsed.toString();
    }
  }

  const db = await getDatabase();
  await db.insert(campaignBanners).values({
    source: "manual" as const,
    merchant: String(formData.get("merchant") ?? "").trim() || "shopee",
    title,
    imageUrl: imageUrl.toString(),
    linkUrl,
    kind: "banner" as const,
    isActive: true,
    sortOrder: 0,
  });

  updateTag(SITE.couponsTag);
  return { ok: "Đã thêm banner." };
}

export async function toggleBannerAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const db = await getDatabase();
  await db
    .update(campaignBanners)
    .set({ isActive: sql`not ${campaignBanners.isActive}`, updatedAt: new Date() })
    .where(eq(campaignBanners.id, id));
  updateTag(SITE.couponsTag);
}

export async function deleteBannerAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return;
  const db = await getDatabase();
  await db.delete(campaignBanners).where(eq(campaignBanners.id, id));
  updateTag(SITE.couponsTag);
}

/** Manual "Sync ngay" — same pipelines as cron, trigger name differs. */
export async function syncNowAction(): Promise<void> {
  await assertAdminSession();
  // Each pipeline expires the coupons tag itself (expire: 0), so the admin
  // sees the fresh data on the next render — no extra invalidation needed.
  await syncAll("manual");
}
