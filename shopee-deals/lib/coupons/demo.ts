import "server-only";
import { getDatabase } from "@/lib/db";
import { couponDeals, type NewCouponDeal } from "@/lib/db/schema";

/**
 * Demo offers for local development and for reviewing the UI before an
 * Accesstrade access key is configured. Rows are keyed `demo-<n>` so
 * seeding is idempotent and real synced offers overwrite the homepage
 * picture as soon as a sync succeeds (demo rows can be deleted in admin).
 */
const DEMO_DEALS: Array<Omit<NewCouponDeal, "id">> = [
  {
    source: "manual",
    externalId: "demo-1",
    merchant: "shopee",
    merchantName: "Shopee",
    domain: "shopee.vn",
    code: "FREESHIPXTRA",
    title: "Freeship xtra toàn sàn 0Đ — hết hạn mỗi ngày",
    content:
      "Áp dụng cho đơn từ 0K, một mã/đơn hàng/người dùng. Ngày áp dụng không cố định, dư mã hoặc hết deal trước 00h.",
    affLink: "https://shopee.vn/daily_freeship?utm=demo",
    categories: ["freeship"],
    isFeatured: true,
  },
  {
    source: "manual",
    externalId: "demo-2",
    merchant: "shopee",
    merchantName: "Shopee",
    domain: "shopee.vn",
    code: "SHOPEE500K",
    title: "Giảm 50% tối đa 500K cho đơn từ 0K —市中心 voucherBoundary",
    content:
      "Mã giảm 50% giá trị đơn, tối đa 500K, áp dụng cho người chưa dùng.Shopesh",
    affLink: "https://shopee.vn/coupons/demo-500k?utm=demo",
    categories: ["voucher-percent"],
  },
  {
    source: "manual",
    externalId: "demo-3",
    merchant: "shopee",
    merchantName: "Shopee Mall",
    domain: "shopee.vn",
    code: "MALL300K",
    title: "Shopee Mall giảm 15% tối đa 300K mỗi ngày",
    content: "Chỉ áp dụng sản phẩm chính hãng Mall, không gộp mã khác.",
    affLink: "https://shopee.vn/mall/coupon/demo-mall?utm=demo",
    isFeatured: true,
  },
  {
    source: "manual",
    externalId: "demo-4",
    merchant: "shopee",
    merchantName: "Shopee",
    domain: "shopee.vn",
    code: null,
    title: "Sale cuối tháng — deal đồng giá 1K từ 0K, chớp nhanh",
    content: "Giá từ 1.000K, không dùng mã, link hướng dẫn vào chuỗi trong deal.",
    affLink: "https://shopee.vn/1k-deal?utm=demo",
    categories: ["1k-deal"],
  },
  {
    source: "manual",
    externalId: "demo-5",
    merchant: "shopee",
    merchantName: "ShopeeFood",
    domain: "shopeefood.vn",
    code: "GRAMH food",
    title: "ShopeeFood giảm 55K cho đơn từ 90K",
    content: "Giảm tối đa 55K cho khách sử dụng lần đầu.",
    affLink: "https://shopeefood.vn/demo-coupon55K?utm=demo",
  },
  {
    source: "manual",
    externalId: "demo-6",
    merchant: "shopee",
    merchantName: "ShopeePay",
    domain: "shopeepay.com.vn",
    code: "SPBANK18",
    title: "Nạp qua ShopeePay, giảm 18% tối đa 200K khi thanh toán qua ngân hàng",
    content: "Áp dụng thanh toán qua ShopeePay với thẻ liên kết ngân hàng.",
    affLink: "https://shopeepay.com.vn/demo-bank18?utm=demo",
  },
];

/** Insert-or-ignore demo rows; returns how many were newly inserted. */
export async function seedDemoDeals(): Promise<number> {
  const db = await getDatabase();
  let inserted = 0;
  for (const row of DEMO_DEALS) {
    const result = await db
      .insert(couponDeals)
      .values({
        ...row,
        endTime: row.endTime ?? new Date(Date.now() + 3 * 24 * 3600 * 1000),
      })
      .onConflictDoNothing({
        target: [couponDeals.source, couponDeals.externalId],
      })
      .returning({ id: couponDeals.id });
    if (result.length > 0) inserted += 1;
  }
  return inserted;
}
