CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'admin',
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vouchers" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "code" TEXT,
  "description" TEXT,
  "terms" TEXT,
  "discount_type" TEXT,
  "discount_value" TEXT,
  "min_order_value" TEXT,
  "max_discount" TEXT,
  "start_date" TIMESTAMP(3),
  "end_date" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'active',
  "voucher_type" TEXT NOT NULL DEFAULT 'coupon',
  "platform" TEXT,
  "brand_id" TEXT,
  "brand_name" TEXT,
  "brand_logo" TEXT,
  "category_id" TEXT,
  "category_name" TEXT,
  "original_url" TEXT,
  "tracking_url" TEXT,
  "image" TEXT,
  "is_hot" BOOLEAN NOT NULL DEFAULT false,
  "is_verified" BOOLEAN NOT NULL DEFAULT false,
  "is_exclusive" BOOLEAN NOT NULL DEFAULT false,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "click_count" INTEGER NOT NULL DEFAULT 0,
  "copy_count" INTEGER NOT NULL DEFAULT 0,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "accesstrade_id" TEXT,
  "last_synced_at" TIMESTAMP(3),
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "brands" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logo" TEXT,
  "banner" TEXT,
  "platform" TEXT,
  "description" TEXT,
  "website_url" TEXT,
  "accesstrade_campaign_id" TEXT,
  "seo_title" TEXT,
  "seo_description" TEXT,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "voucher_count" INTEGER NOT NULL DEFAULT 0,
  "click_count" INTEGER NOT NULL DEFAULT 0,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "icon" TEXT,
  "description" TEXT,
  "seo_title" TEXT,
  "seo_description" TEXT,
  "banner" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "voucher_count" INTEGER NOT NULL DEFAULT 0,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "blog_posts" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT,
  "cover_image" TEXT,
  "category" TEXT,
  "seo_title" TEXT,
  "seo_description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMP(3),
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "click_events" (
  "id" TEXT NOT NULL,
  "voucher_id" TEXT NOT NULL,
  "brand_id" TEXT,
  "event_type" TEXT NOT NULL DEFAULT 'click',
  "source_page" TEXT,
  "voucher_title" TEXT,
  "brand_name" TEXT,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "copy_events" (
  "id" TEXT NOT NULL,
  "voucher_id" TEXT NOT NULL,
  "brand_id" TEXT,
  "source_page" TEXT,
  "voucher_title" TEXT,
  "brand_name" TEXT,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "copy_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sync_logs" (
  "id" TEXT NOT NULL,
  "sync_type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'running',
  "message" TEXT,
  "items_synced" INTEGER NOT NULL DEFAULT 0,
  "error_detail" TEXT,
  "started_at" TIMESTAMP(3),
  "finished_at" TIMESTAMP(3),
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "campaigns" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "platform" TEXT,
  "external_id" TEXT,
  "tracking_url" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "banners" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "image_url" TEXT,
  "target_url" TEXT,
  "placement" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "homepage_sections" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "title" TEXT,
  "config" JSONB,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "affiliate_transactions" (
  "id" TEXT NOT NULL,
  "external_id" TEXT,
  "order_code" TEXT,
  "campaign_id" TEXT,
  "amount" DECIMAL(12,2),
  "commission" DECIMAL(12,2),
  "status" TEXT,
  "occurred_at" TIMESTAMP(3),
  "raw_payload" JSONB,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "affiliate_transactions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "vouchers_slug_key" ON "vouchers"("slug");
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");
CREATE UNIQUE INDEX "homepage_sections_key_key" ON "homepage_sections"("key");
CREATE UNIQUE INDEX "affiliate_transactions_external_id_key" ON "affiliate_transactions"("external_id");
