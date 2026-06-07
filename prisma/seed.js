import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {
  blogPosts,
  brands,
  categories,
  staleSeedBlogPostIds,
  staleSeedCategoryIds,
  staleSeedVoucherIds,
  vouchers,
} from './seed-data.js';

const prisma = new PrismaClient();
const forceBaseline = process.env.SEED_FORCE_BASELINE === 'true';

async function seedWhenEmpty(modelName, rows) {
  const count = await prisma[modelName].count();
  if (count > 0 && !forceBaseline) return;

  if (forceBaseline) {
    for (const row of rows) {
      await prisma[modelName].upsert({
        where: { id: row.id },
        update: row,
        create: row,
      });
    }
    return;
  }

  await prisma[modelName].createMany({ data: rows, skipDuplicates: true });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: 'admin-local',
      email: adminEmail,
      name: 'Local Admin',
      role: 'admin',
    },
  });

  if (forceBaseline) {
    await prisma.voucher.updateMany({
      where: { id: { in: staleSeedVoucherIds } },
      data: { status: 'draft', is_hot: false },
    });
    await prisma.category.updateMany({
      where: { id: { in: staleSeedCategoryIds } },
      data: { is_active: false },
    });
    await prisma.blogPost.updateMany({
      where: { id: { in: staleSeedBlogPostIds } },
      data: { status: 'draft' },
    });
  }

  await seedWhenEmpty('brand', brands);
  await seedWhenEmpty('category', categories);
  await seedWhenEmpty('voucher', vouchers);
  await seedWhenEmpty('blogPost', blogPosts);

  const settingsCount = await prisma.siteSetting.count();
  if (settingsCount === 0) {
    await prisma.siteSetting.create({
      data: {
        key: 'site',
        value: {
          name: 'Mã Giảm Giá Pro',
          description: 'Website tổng hợp voucher và deal hot chạy độc lập.',
        },
      },
    });
  }

  const sectionCount = await prisma.homepageSection.count();
  if (sectionCount === 0) {
    await prisma.homepageSection.createMany({
      data: [
        { key: 'hot_vouchers', title: 'Mã giảm giá hot hôm nay', sort_order: 1 },
        { key: 'categories', title: 'Danh mục phổ biến', sort_order: 2 },
        { key: 'new_vouchers', title: 'Mã mới nhất', sort_order: 3 },
        { key: 'featured_brands', title: 'Thương hiệu nổi bật', sort_order: 4 },
      ],
      skipDuplicates: true,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
