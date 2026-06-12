-- CreateTable
CREATE TABLE "tracked_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "platform" TEXT,
    "product_url" TEXT NOT NULL,
    "price_selector" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "current_price" DECIMAL(14,2),
    "current_price_text" TEXT,
    "last_checked_at" TIMESTAMP(3),
    "last_error" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracked_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_histories" (
    "id" TEXT NOT NULL,
    "tracked_product_id" TEXT NOT NULL,
    "price" DECIMAL(14,2) NOT NULL,
    "price_text" TEXT,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'jsonld',
    "source_url" TEXT,

    CONSTRAINT "price_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracked_products_slug_key" ON "tracked_products"("slug");

-- CreateIndex
CREATE INDEX "price_histories_tracked_product_id_captured_at_idx" ON "price_histories"("tracked_product_id", "captured_at" DESC);

-- AddForeignKey
ALTER TABLE "price_histories" ADD CONSTRAINT "price_histories_tracked_product_id_fkey" FOREIGN KEY ("tracked_product_id") REFERENCES "tracked_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
