# Mã Giảm Giá Đa Sàn (Shopee / Tiki / TikTok Shop / Lazada)

Web tổng hợp mã giảm giá Shopee và deal sản phẩm Tiki, TikTok Shop, Lazada —
dữ liệu đồng bộ tự động từ nền tảng affiliate [Accesstrade](https://accesstrade.vn)
qua 3 pipeline:

| Pipeline | Nguồn dữ liệu | Sản phẩm |
|---|---|---|
| `shopee-offers` | `GET /v1/offers_informations` | Mã/voucher Shopee (có `code`) |
| `datafeeds` | `GET /v1/datafeeds?domain=lazada.vn\|tiki.vn` | Deal sản phẩm affiliate link có sẵn, giá + % giảm |
| `tiktok` | `GET /v2/tiktokshop_product_feeds` + `POST .../create_link` | Deal sản phẩm TikTok Shop, link aff tạo per row mới |

Mỗi pipeline ghi 1 dòng `sync_logs` (prefix trong message), chạy tuần tự trong
`/api/cron/sync` (30 phút/lần trên Vercel Cron) và nút **Sync ngay** ở `/admin`.

## Getting Started

```bash
pnpm install
pnpm dev
```

Local dùng PGlite tự chứa (`.db-pglite/`), tự migrate khi lần đầu request.
Prod: đặt `DATABASE_URL` (Neon/Vercel Postgres…), migrate tự chạy khi khởi động.

## Env (xem `.env.example`)

- `DATABASE_URL` — bỏ trống local cho PGlite.
- `ADMIN_PASSWORD`, `AUTH_SECRET` — đăng nhập `/admin`. Xoay `AUTH_SECRET`
  sẽ vô hiệu ngay các admin cookie đã phát hành (HMAC không còn khớp);
  `AUTH_SECRET` **bắt buộc** ở production.
- `ACCESSTRADE_ACCESS_KEY` — key publisher, [lấy tại đây](https://pub.accesstrade.vn/publisher_profile/personal_info).
- `ACCESSTRADE_DATAFEED_DOMAINS` — mặc định `lazada.vn,tiki.vn`.
- `ACCESSTRADE_DATAFEED_PAGES` — số trang mỗi domain (mặc định 2; 50 SP/trang).
- `ACCESSTRADE_TIKTOK_KEYWORDS` — từ khóa tìm TikTok Shop, mặc định `quần,áo,giày,mỹ phẩm`.
- `ACCESSTRADE_TIKTOK_LIMIT` — số SP mỗi keyword (mặc định 10).
- `CRON_SECRET` — bảo vệ `/api/cron/sync`. **Fail-closed ở production**:
  thiếu secret → endpoint trả 403. Đã set env thì Vercel Cron tự gửi
  `Authorization: Bearer <CRON_SECRET>`; local dev giữ mở không cần secret.

## Lưu ý vận hành

- **Tiki + Lazada**: chiến dịch `tikivn` / `lazada_kol` cần **đăng ký**
  trên dashboard Accesstrade trước, nếu không đơn không được tính hoa hồng
  (API trả datafeed vẫn hoạt động).
- **TikTok Shop**: mỗi hàng mới tốn 1 call `create_link` (~0.3–1s), lần sync
  đầu có thể tổng hợp 60–90s; các lần sau nhanh vì chỉ sync row mới. Với cron
  Hobby (giới hạn 60s) nên giảm `ACCESSTRADE_DATAFEED_PAGES=1` và/
  hoặc bớt keyword, hoặc chuyển cron sang chạy riêng ở máy khác.
- Sync chỉ chạy qua HTTP (cron/admin) — **không mở trực tiếp file DB local**.

## Deploy on Vercel

Từ repo push lên GitHub → import vào Vercel, set env ở mục trên (production),
`CRON_SECRET` bắt buộc khi bật `vercel.json` cron. Chi tiết từng bước xem
`HUONG-DAN-TERMIUS-OPENCODE.md` tại thư mục gốc repo.
