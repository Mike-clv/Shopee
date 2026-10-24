CREATE TABLE "coupon_deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"external_id" text,
	"merchant" text DEFAULT 'shopee' NOT NULL,
	"merchant_name" text,
	"domain" text,
	"code" text,
	"title" text NOT NULL,
	"content" text,
	"image" text,
	"aff_link" text NOT NULL,
	"link" text,
	"categories" text[],
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger" text NOT NULL,
	"status" text NOT NULL,
	"fetched" integer DEFAULT 0 NOT NULL,
	"created" integer DEFAULT 0 NOT NULL,
	"updated" integer DEFAULT 0 NOT NULL,
	"disabled" integer DEFAULT 0 NOT NULL,
	"message" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_deals_source_external_idx" ON "coupon_deals" USING btree ("source","external_id");--> statement-breakpoint
CREATE INDEX "coupon_deals_merchant_created_idx" ON "coupon_deals" USING btree ("merchant","created_at");--> statement-breakpoint
CREATE INDEX "coupon_deals_active_idx" ON "coupon_deals" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "coupon_deals_end_time_idx" ON "coupon_deals" USING btree ("end_time");--> statement-breakpoint
CREATE INDEX "sync_logs_started_idx" ON "sync_logs" USING btree ("started_at");