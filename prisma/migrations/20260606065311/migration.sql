-- AlterTable
ALTER TABLE "affiliate_transactions" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "banners" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "blog_posts" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "homepage_sections" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "site_settings" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sync_logs" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vouchers" ALTER COLUMN "updated_date" DROP DEFAULT;
