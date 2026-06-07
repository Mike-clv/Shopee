CREATE TABLE IF NOT EXISTS "interest_posts" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT,
  "thumbnail_image" TEXT,
  "target_url" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "published_at" TIMESTAMP(3),
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_date" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "interest_posts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "interest_posts_slug_key" ON "interest_posts"("slug");
