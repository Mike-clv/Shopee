import { pgTable, text, timestamp, boolean, integer, bigint, real, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";

/**
 * Coupon/deal rows. `externalId` is the Accesstrade offer id for synced rows,
 * null for manually created ones. Uniqueness is per (source, externalId).
 */
export const couponDeals = pgTable(
  "coupon_deals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source", { enum: ["accesstrade", "tiktok", "manual"] })
      .notNull()
      .default("manual"),
    externalId: text("external_id"),
    merchant: text("merchant").notNull().default("shopee"),
    merchantName: text("merchant_name"),
    domain: text("domain"),

    // null code = deal without a promo code (pure discount/campaign link)
    code: text("code"),
    title: text("title").notNull(),
    content: text("content"),
    image: text("image"),

    // Product deals (datafeed/TikTok) carry sale price + discount rate.
    // price = current selling price (VND) when known, null for coupon offers.
    price: bigint("price", { mode: "number" }),
    discountRate: real("discount_rate"),

    affLink: text("aff_link").notNull(),
    link: text("link"),
    categories: text("categories").array(),

    startTime: timestamp("start_time", { mode: "date", withTimezone: true }),
    endTime: timestamp("end_time", { mode: "date", withTimezone: true }),

    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    clickCount: integer("click_count").notNull().default(0),

    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("coupon_deals_source_external_idx").on(t.source, t.externalId),
    index("coupon_deals_merchant_created_idx").on(t.merchant, t.createdAt),
    index("coupon_deals_active_idx").on(t.isActive),
    index("coupon_deals_end_time_idx").on(t.endTime),
  ],
);

export const BANNER_SOURCES = ["accesstrade", "manual"] as const;
export const BANNER_KINDS = ["banner", "logo"] as const;

/**
 * Campaign banner/poster assets (e.g. Shopee VN Smartlink campaign images from
 * Accesstrade pub2 attachments). Unique per (source, imageUrl) so re-syncing
 * the same asset upserts in place; manual banners let the admin add posters
 * that Accesstrade does not expose via API (Drive folders etc.).
 */
export const campaignBanners = pgTable(
  "campaign_banners",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source", { enum: BANNER_SOURCES })
      .notNull()
      .default("accesstrade"),
    merchant: text("merchant").notNull(),
    campaignId: text("campaign_id"),
    title: text("title"),
    imageUrl: text("image_url").notNull(),
    linkUrl: text("link_url"),
    kind: text("kind", { enum: BANNER_KINDS }).notNull().default("banner"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("campaign_banners_source_image_idx").on(t.source, t.imageUrl),
    index("campaign_banners_active_idx").on(t.isActive),
  ],
);

export const SYNC_TRIGGERS = ["cron", "manual"] as const;
export const SYNC_STATUSES = ["success", "error"] as const;

/**
 * Audit trail for every Accesstrade sync run. Powers the admin "Sync" panel
 * and lets cron failures be diagnosed without shell access.
 */
export const syncLogs = pgTable(
  "sync_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trigger: text("trigger", { enum: SYNC_TRIGGERS }).notNull(),
    status: text("status", { enum: SYNC_STATUSES }).notNull(),
    fetched: integer("fetched").notNull().default(0),
    created: integer("created").notNull().default(0),
    updated: integer("updated").notNull().default(0),
    disabled: integer("disabled").notNull().default(0),
    message: text("message"),
    startedAt: timestamp("started_at", {
      mode: "date",
      withTimezone: true,
    }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", {
      mode: "date",
      withTimezone: true,
    }),
  },
  (t) => [index("sync_logs_started_idx").on(t.startedAt)],
);

export type CouponDeal = typeof couponDeals.$inferSelect;
export type NewCouponDeal = typeof couponDeals.$inferInsert;
export type SyncLog = typeof syncLogs.$inferSelect;
export type CampaignBanner = typeof campaignBanners.$inferSelect;
export type NewCampaignBanner = typeof campaignBanners.$inferInsert;
