CREATE TABLE "campaign_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text DEFAULT 'accesstrade' NOT NULL,
	"merchant" text NOT NULL,
	"campaign_id" text,
	"title" text,
	"image_url" text NOT NULL,
	"link_url" text,
	"kind" text DEFAULT 'banner' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_banners_source_image_idx" ON "campaign_banners" USING btree ("source","image_url");--> statement-breakpoint
CREATE INDEX "campaign_banners_active_idx" ON "campaign_banners" USING btree ("is_active");