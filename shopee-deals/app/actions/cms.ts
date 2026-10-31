"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { getDatabase } from "@/lib/db";
import {
  cmsEntries,
  contentAuditLogs,
  mediaAssets,
  siteSettings,
} from "@/lib/db/schema";
import { assertAdminSession } from "@/lib/auth";
import { adminEmail } from "@/lib/session";
import { CMS_CACHE_TAG } from "@/lib/cms/data";
import { DEFAULT_PROMO_POPUP } from "@/lib/cms/promo-popup";
import { pageInputSchema, postInputSchema, promoPopupInputSchema } from "@/lib/cms/validation";

export type CmsActionState = { error?: string; ok?: string };

/**
 * CMS pages are prerendered with a static shell. `updateTag` expires the data
 * cache, but the full-route cache also needs an explicit path invalidation so
 * a publish is visible on the next request instead of after the cache window.
 */
function revalidatePublicContent(paths: string[] = []) {
  updateTag(CMS_CACHE_TAG);
  for (const path of new Set(["/", "/blog", "/sitemap", "/sitemap.xml", ...paths])) {
    revalidatePath(path);
  }
  // Dynamic blog routes need the route pattern + type to invalidate every
  // cached slug (including a 404 cached before the post was published).
  if (paths.some((path) => path.startsWith("/blog/"))) {
    revalidatePath("/blog/[slug]", "page");
  }
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string): string | undefined {
  const value = text(formData, key);
  return value || undefined;
}

function json<T>(formData: FormData, key: string, fallback: T): T {
  const raw = text(formData, key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Trường ${key} không phải JSON hợp lệ`);
  }
}

async function audit(input: {
  action: string;
  entity: string;
  entityId?: string;
  summary: string;
  before?: unknown;
  after?: unknown;
}) {
  const db = await getDatabase();
  await db.insert(contentAuditLogs).values({
    actor: adminEmail(),
    action: input.action,
    entity: input.entity,
    entityId: input.entityId ?? null,
    summary: input.summary,
    before: input.before ?? null,
    after: input.after ?? null,
  });
}

export async function savePostAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await assertAdminSession();
  try {
    const input = postInputSchema.parse({
      slug: text(formData, "slug"),
      path: text(formData, "path"),
      title: text(formData, "title"),
      excerpt: text(formData, "excerpt"),
      status: text(formData, "status") || "draft",
      seoTitle: optionalText(formData, "seoTitle"),
      seoDescription: optionalText(formData, "seoDescription"),
      isFeatured: formData.get("isFeatured") === "on",
      body: json(formData, "body", []),
      meta: {
        tagLabel: text(formData, "tagLabel"),
        tagHref: text(formData, "tagHref"),
        minutes: text(formData, "minutes"),
        gradient: text(formData, "gradient"),
        icon: text(formData, "icon"),
        cover: {
          src: text(formData, "coverSrc"),
          alt: text(formData, "coverAlt"),
          width: text(formData, "coverWidth"),
          height: text(formData, "coverHeight"),
          caption: text(formData, "coverCaption"),
        },
        author: {
          name: text(formData, "authorName"),
          title: text(formData, "authorTitle"),
          href: text(formData, "authorHref"),
        },
        hintedCtas: json(formData, "hintedCtas", []),
        faqs: json(formData, "faqs", []),
      },
    });

    const db = await getDatabase();
    const id = optionalText(formData, "id");
    const existing = id
      ? (
          await db
            .select()
            .from(cmsEntries)
            .where(eq(cmsEntries.id, id))
            .limit(1)
        )[0]
      : undefined;

    const publishedAt =
      input.status === "published"
        ? (existing?.publishedAt ?? new Date())
        : existing?.publishedAt ?? null;

    const values = {
      kind: "post" as const,
      slug: input.slug,
      path: input.path,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      meta: input.meta,
      status: input.status,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      coverImage: input.meta.cover.src,
      coverAlt: input.meta.cover.alt,
      isFeatured: input.isFeatured,
      publishedAt,
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(cmsEntries).set(values).where(eq(cmsEntries.id, id));
    } else {
      await db.insert(cmsEntries).values(values);
    }

    await audit({
      action: id ? "update" : "create",
      entity: "post",
      entityId: id,
      summary: `${id ? "Cập nhật" : "Tạo"} bài “${input.title}” (${input.status})`,
      before: existing,
      after: values,
    });
    revalidatePublicContent([input.path]);
    return { ok: id ? "Đã cập nhật bài viết." : "Đã tạo bài viết." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Không lưu được bài viết.",
    };
  }
}

export async function savePageAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await assertAdminSession();
  try {
    const input = pageInputSchema.parse({
      slug: text(formData, "slug"),
      path: text(formData, "path"),
      title: text(formData, "title"),
      excerpt: optionalText(formData, "excerpt"),
      status: text(formData, "status") || "draft",
      seoTitle: optionalText(formData, "seoTitle"),
      seoDescription: optionalText(formData, "seoDescription"),
      body: json(formData, "body", []),
      meta: {
        pageType: text(formData, "pageType"),
        badge: optionalText(formData, "badge"),
        updated: optionalText(formData, "updated"),
        intro: json(formData, "intro", []),
        highlights: json(formData, "highlights", []),
        faqs: json(formData, "faqs", []),
        startISO: optionalText(formData, "startISO"),
        endISO: optionalText(formData, "endISO"),
        checklist: json(formData, "checklist", undefined),
        guide: json(formData, "guide", undefined),
      },
    });

    const db = await getDatabase();
    const id = optionalText(formData, "id");
    const existing = id
      ? (
          await db
            .select()
            .from(cmsEntries)
            .where(eq(cmsEntries.id, id))
            .limit(1)
        )[0]
      : undefined;

    const values = {
      kind: "page" as const,
      slug: input.slug,
      path: input.path,
      title: input.title,
      excerpt: input.excerpt ?? "",
      body: input.body,
      meta: input.meta,
      status: input.status,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      coverImage: null,
      coverAlt: null,
      isFeatured: false,
      publishedAt: input.status === "published" ? (existing?.publishedAt ?? new Date()) : null,
      updatedAt: new Date(),
    };

    if (id) {
      await db.update(cmsEntries).set(values).where(eq(cmsEntries.id, id));
    } else {
      await db.insert(cmsEntries).values(values);
    }

    await audit({
      action: id ? "update" : "create",
      entity: "page",
      entityId: id,
      summary: `${id ? "Cập nhật" : "Tạo"} trang “${input.title}” (${input.path})`,
      before: existing,
      after: values,
    });
    revalidatePublicContent([input.path]);
    return { ok: id ? "Đã cập nhật trang." : "Đã tạo bản ghi trang." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Không lưu được trang.",
    };
  }
}

export async function deleteCmsEntryAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = text(formData, "id");
  if (!id) return;
  const db = await getDatabase();
  const existing = (
    await db.select().from(cmsEntries).where(eq(cmsEntries.id, id)).limit(1)
  )[0];
  if (!existing) return;
  await db.delete(cmsEntries).where(eq(cmsEntries.id, id));
  await audit({
    action: "delete",
    entity: existing.kind,
    entityId: id,
    summary: `Xóa ${existing.kind === "post" ? "bài" : "trang"} “${existing.title}”`,
    before: existing,
  });
  revalidatePublicContent([existing.path]);
}

export async function resetStaticOverrideAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const path = text(formData, "path");
  if (!path) return;
  const db = await getDatabase();
  const existing = (
    await db
      .select()
      .from(cmsEntries)
      .where(and(eq(cmsEntries.path, path), eq(cmsEntries.kind, "page")))
      .limit(1)
  )[0];
  if (!existing) return;
  await db.delete(cmsEntries).where(eq(cmsEntries.id, existing.id));
  await audit({
    action: "reset",
    entity: "page",
    entityId: existing.id,
    summary: `Bỏ ghi đè CMS cho ${path}, quay về nội dung code`,
    before: existing,
  });
  revalidatePublicContent([path]);
}

export async function addMediaAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await assertAdminSession();
  try {
    const url = text(formData, "url");
    if (!url || !(url.startsWith("/") || /^https?:\/\//i.test(url))) {
      throw new Error("Cần URL http(s) hoặc đường dẫn nội bộ");
    }
    const db = await getDatabase();
    await db.insert(mediaAssets).values({
      url,
      alt: text(formData, "alt"),
      caption: optionalText(formData, "caption") ?? null,
      mime: optionalText(formData, "mime") ?? null,
      width: Number(text(formData, "width")) || null,
      height: Number(text(formData, "height")) || null,
    });
    await audit({ action: "create", entity: "media", summary: `Thêm media ${url}`, after: { url } });
    return { ok: "Đã thêm media." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không thêm được media." };
  }
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  await assertAdminSession();
  const id = text(formData, "id");
  if (!id) return;
  const db = await getDatabase();
  const existing = (
    await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  )[0];
  if (!existing) return;
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  await audit({
    action: "delete",
    entity: "media",
    entityId: id,
    summary: `Xóa media ${existing.url}`,
    before: existing,
  });
}

export async function saveSettingsAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  await assertAdminSession();
  try {
    const popupInput = promoPopupInputSchema.safeParse({
      enabled: formData.get("promoPopupEnabled") === "on",
      imageUrl: text(formData, "promoPopupImageUrl"),
      href: text(formData, "promoPopupHref"),
      alt: text(formData, "promoPopupAlt"),
      title: text(formData, "promoPopupTitle"),
    });
    if (!popupInput.success) {
      return {
        error:
          popupInput.error.issues[0]?.message ?? "Cài đặt popup không hợp lệ.",
      };
    }

    const db = await getDatabase();
    const keys = ["siteName", "siteDescription", "contactEmail", "affiliateNote"];
    for (const key of keys) {
      const value = text(formData, key);
      await db
        .insert(siteSettings)
        .values({ key, value: { text: value }, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: { text: value }, updatedAt: new Date() },
        });
    }

    const promoPopup = {
      ...popupInput.data,
      imageUrl: popupInput.data.imageUrl || DEFAULT_PROMO_POPUP.imageUrl,
      href: popupInput.data.href || DEFAULT_PROMO_POPUP.href,
      alt: popupInput.data.alt || DEFAULT_PROMO_POPUP.alt,
      title: popupInput.data.title || DEFAULT_PROMO_POPUP.title,
    };
    await db
      .insert(siteSettings)
      .values({ key: "promoPopup", value: promoPopup, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: promoPopup, updatedAt: new Date() },
      });

    await audit({ action: "update", entity: "settings", summary: "Cập nhật cài đặt website" });
    revalidatePublicContent();
    return { ok: "Đã lưu cài đặt." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Không lưu được cài đặt." };
  }
}
