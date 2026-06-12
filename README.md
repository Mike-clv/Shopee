# Ma Giam Gia Pro

Website tong hop ma giam gia, voucher, coupon va deal hot cho Shopee, Lazada, Tiki, TikTok Shop. Source nay da tach khoi runtime/SDK cua Base44 va chay doc lap bang Vite React, Express API, Prisma va PostgreSQL.

Tai lieu huong dan day du nam o:

```txt
docs/HUONG_DAN_SU_DUNG.md
```

## Cong nghe su dung

- Frontend: React 18, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/Radix UI
- Backend: Express API
- Database: PostgreSQL 16
- ORM: Prisma
- Upload anh production: Vercel Blob
- Auth admin: cookie session, tai khoan lay tu `.env`
- Theo doi gia: `puppeteer-core` + `@sparticuz/chromium` + Vercel Cron
- Bieu do gia: Recharts

## Chay local nhanh

```powershell
npm install
copy .env.example .env
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Website local:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

## Dang nhap admin

Mac dinh theo `.env`:

```txt
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
DATABASE_URL_UNPOOLED=postgresql://shopee:shopee@localhost:5432/shopee_magiamgia?schema=public
```

## Deploy

Du an da duoc chuan bi de deploy len Vercel qua GitHub repo:

```txt
https://github.com/Mike-clv/Shopee
```

Xem chi tiet trong:

```txt
docs/HUONG_DAN_SU_DUNG.md
```

Luu y khi deploy Neon/Vercel:

- `DATABASE_URL` dung cho runtime/pool.
- `DATABASE_URL_UNPOOLED` dung cho `prisma migrate deploy` de tranh loi khi migrate qua connection pool.
- Vercel Cron cho module theo doi gia dang chay theo UTC. Neu muon 02:00 gio Viet Nam/Asia-Bangkok thi `vercel.json` dang de `0 19 * * *`.

## Bien moi truong moi cho theo doi gia

```env
CRON_SECRET=...
PRICE_TRACKING_BATCH_SIZE=3
PRICE_TRACKING_CRON_ENABLED=false
PRICE_TRACKING_TIMEOUT_MS=45000
PUPPETEER_EXECUTABLE_PATH=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- Module theo doi gia se gui canh bao Telegram khi mot san pham loi scrape 3 lan lien tiep, sau do nhac lai o moc 6, 9...
- Cron `/api/cron/price-tracking` dong thoi tu dong xoa `PriceHistory` cu hon 90 ngay de giu nhe database.
- SEO public da duoc doi sang `react-helmet-async` qua component `Seo.jsx` va `HelmetProvider` o entrypoint.

## Route moi

- Public:
  - `/theo-doi-gia`
  - `/theo-doi-gia/:slug`
  - `/tinh-tra-gop`
- Admin:
  - `/admin/price-tracking`
  - `/admin/exit-intent-popup`
  - `/admin/global-coupons`

## Coupon chon loc bang SiteSetting

- Du lieu luu trong `SiteSetting` voi key `global_coupons`
- Admin quan ly tai `/admin/global-coupons`
- Trang chu se tu dong hien section coupon noi bat neu danh sach nay co du lieu hop le
- Moi coupon se duoc route qua link boc dang `/go/coupon-<id>` de redirect 302 sang deep link affiliate
