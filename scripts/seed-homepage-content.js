import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const affiliateLink = 'https://go.isclix.com/deep_link/v6/6041223145843920598/4751584435713464237?utm_source=Google&utm_medium=Banner&utm_campaign=Ctrinh66&utm_content=Shopee66&sub4=oneatweb&url_enc=aHR0cHM6Ly9zaG9wZWUudm4vbS82LTY%3D';

const categories = [
  ['Thời Trang', 'thoi-trang', 'Shirt'],
  ['Mỹ Phẩm', 'my-pham', 'Sparkles'],
  ['Mẹ & Bé', 'me-va-be', 'Baby'],
  ['Điện Tử', 'dien-tu', 'Smartphone'],
  ['Nhà Cửa', 'nha-cua', 'Home'],
  ['Sức Khỏe', 'suc-khoe', 'Heart'],
  ['Du Lịch', 'du-lich', 'Plane'],
  ['Đồ Ăn', 'do-an', 'UtensilsCrossed'],
  ['Sách', 'sach', 'BookOpen'],
  ['Công Nghệ', 'cong-nghe', 'Wifi'],
  ['Bách Hóa', 'bach-hoa', 'ShoppingBag'],
  ['Siêu Thị', 'sieu-thi', 'Store'],
];

const brands = [
  ['Shopee', 'shopee', 'shopee', 'https://cdn.simpleicons.org/shopee/EE4D2D', 'https://shopee.vn'],
  ['Lazada', 'lazada', 'lazada', 'https://logo.clearbit.com/lazada.vn', 'https://www.lazada.vn'],
  ['Tiki', 'tiki', 'tiki', 'https://logo.clearbit.com/tiki.vn', 'https://tiki.vn'],
  ['TikTok Shop', 'tiktok-shop', 'tiktok_shop', 'https://cdn.simpleicons.org/tiktok/111111', 'https://shop.tiktok.com'],
  ['Samsung', 'samsung', 'other', 'https://cdn.simpleicons.org/samsung/1428A0', 'https://www.samsung.com/vn'],
  ['Nike', 'nike', 'other', 'https://cdn.simpleicons.org/nike/111111', 'https://www.nike.com/vn'],
  ['Unilever', 'unilever', 'other', 'https://cdn.simpleicons.org/unilever/1F36C7', 'https://www.unilever.com.vn'],
  ["L'Oréal", 'loreal', 'other', 'https://logo.clearbit.com/loreal.com', 'https://www.loreal.com'],
  ['Grab', 'grab', 'other', 'https://cdn.simpleicons.org/grab/00B14F', 'https://www.grab.com/vn'],
  ['The Coffee House', 'the-coffee-house', 'other', 'https://logo.clearbit.com/thecoffeehouse.com', 'https://thecoffeehouse.com'],
];

const banners = [
  ['banner_shopee_66', 'Shopee 6.6 - Siêu sale giữa năm', '/uploads/66.jpg', 'homepage_top', 1],
  ['banner_shopee_661', 'Shopee 6.6 - Deal làm đẹp', '/uploads/661.png', 'homepage_top', 2],
  ['banner_hot_shopee_66', 'Mã hot Shopee 6.6 - Siêu sale giữa năm', '/uploads/66.jpg', 'hot_empty', 1],
  ['banner_hot_shopee_661', 'Mã hot Shopee 6.6 - Deal làm đẹp', '/uploads/661.png', 'hot_empty', 2],
];

const interestPosts = [
  [
    'interest-shopee-66',
    'Săn deal Shopee 6.6 đang mở',
    'san-deal-shopee-66',
    'Tổng hợp chiến dịch Shopee 6.6 nổi bật, phù hợp để gắn link affiliate và cập nhật theo mùa sale.',
    '/uploads/66.jpg',
    1,
  ],
  [
    'interest-lam-dep-66',
    'Deal làm đẹp và voucher Shopee Mall',
    'deal-lam-dep-shopee-mall',
    'Gợi ý khu vực để anh đặt các sản phẩm Shopee Mall, mỹ phẩm, voucher ngành hàng và link chiến dịch AccessTrade.',
    '/uploads/661.png',
    2,
  ],
  [
    'interest-meo-mua-sam',
    'Checklist trước khi dùng mã giảm giá',
    'checklist-truoc-khi-dung-ma-giam-gia',
    'Một card mẫu cho các bài gợi ý mua sắm, sau này có thể đổi ảnh, nội dung và link sản phẩm trong admin.',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&h=506&fit=crop',
    3,
  ],
];

for (let index = 0; index < categories.length; index += 1) {
  const [name, slug, icon] = categories[index];
  await prisma.category.upsert({
    where: { slug },
    update: {
      name,
      icon,
      is_active: true,
      sort_order: index + 1,
      description: `Danh mục mua sắm ${name}.`,
    },
    create: {
      id: `cat_${slug}`,
      name,
      slug,
      icon,
      is_active: true,
      sort_order: index + 1,
      voucher_count: 0,
      description: `Danh mục mua sắm ${name}.`,
    },
  });
}

await prisma.category.updateMany({
  where: { slug: 'other' },
  data: { is_active: false, sort_order: 999 },
});

for (let index = 0; index < brands.length; index += 1) {
  const [name, slug, platform, logo, website_url] = brands[index];
  const voucherCount = slug === 'shopee'
    ? await prisma.voucher.count({ where: { status: 'active', platform: 'shopee' } })
    : 0;

  await prisma.brand.upsert({
    where: { slug },
    update: {
      name,
      platform,
      logo,
      website_url,
      is_featured: true,
      is_active: true,
      sort_order: index + 1,
      voucher_count: voucherCount,
    },
    create: {
      id: `brand_${slug}`,
      name,
      slug,
      platform,
      logo,
      website_url,
      is_featured: true,
      is_active: true,
      sort_order: index + 1,
      voucher_count: voucherCount,
    },
  });
}

await prisma.voucher.updateMany({
  where: { status: 'active', platform: 'shopee' },
  data: { brand_name: 'Shopee', brand_logo: 'https://cdn.simpleicons.org/shopee/EE4D2D' },
});

for (const [id, title, image_url, placement, sort_order] of banners) {
  await prisma.banner.upsert({
    where: { id },
    update: { title, image_url, target_url: affiliateLink, placement, is_active: true, sort_order },
    create: { id, title, image_url, target_url: affiliateLink, placement, is_active: true, sort_order },
  });
}

for (const [id, title, slug, excerpt, thumbnail_image, sort_order] of interestPosts) {
  await prisma.interestPost.upsert({
    where: { slug },
    update: {
      title,
      excerpt,
      content: `## ${title}\n\n${excerpt}`,
      thumbnail_image,
      target_url: affiliateLink,
      status: 'published',
      sort_order,
      published_at: new Date(),
    },
    create: {
      id,
      title,
      slug,
      excerpt,
      thumbnail_image,
      target_url: affiliateLink,
      status: 'published',
      sort_order,
      published_at: new Date(),
      content: `## ${title}\n\n${excerpt}`,
    },
  });
}

const summary = {
  categories: await prisma.category.count({ where: { is_active: true } }),
  brands: await prisma.brand.count({ where: { is_active: true, is_featured: true } }),
  banners: await prisma.banner.count({ where: { is_active: true } }),
  interestPosts: await prisma.interestPost.count({ where: { status: 'published' } }),
};

console.log(JSON.stringify(summary, null, 2));
await prisma.$disconnect();
