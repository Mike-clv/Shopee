# Migration: từ Base44 sang website độc lập

## A. Audit ban đầu

Project ban đầu là Vite/React, không phải Next.js. Source có các phần phụ thuộc Base44 sau:

- `vite.config.js` import plugin `@base44/vite-plugin`.
- `package.json` có `@base44/sdk` và `@base44/vite-plugin`.
- `src/api/base44Client.js` tạo SDK client.
- Nhiều page/component gọi trực tiếp `base44.entities.*`.
- `src/lib/AuthContext.jsx` dùng Base44 auth và app public settings.
- `src/lib/app-params.js` đọc các biến `VITE_BASE44_*`.
- `functions/syncAccessTrade.ts` và `functions/createTrackingLink.ts` dùng Base44 function runtime.
- `index.html` dùng favicon/title của Base44.
- README cũ là hướng dẫn Base44.

Các page/route chính:

- Public: `Home`, `VoucherList`, `VoucherDetail`, `BrandList`, `BrandDetail`, `CategoryList`, `CategoryDetail`, `SearchPage`, `PlatformPage`, `BlogList`, `BlogDetail`, `AboutPage`, `PolicyPage`.
- Auth: `Login`, `Register`, `ForgotPassword`, `ResetPassword`.
- Admin: `AdminDashboard`, `AdminVouchers`, `AdminBrands`, `AdminCategories`, `AdminBlog`, `AdminSync`, `AdminStats`.

Các entity ban đầu nằm trong thư mục `entities`: `Voucher`, `Brand`, `Category`, `BlogPost`, `ClickEvent`, `SyncLog`.

## B. Đã gỡ Base44 như thế nào

- Gỡ plugin Base44 khỏi Vite.
- Gỡ dependency `@base44/sdk` và `@base44/vite-plugin`.
- Xóa `src/api/base44Client.js`.
- Xóa `src/lib/app-params.js`.
- Xóa các function runtime cũ trong `functions`.
- Thay mọi import/call `base44` bằng `localClient` nội bộ.
- Tạo Express API local để frontend gọi qua `/api`.
- Tạo Prisma/PostgreSQL để thay data layer cũ.
- Tạo auth admin local bằng cookie session và `.env`.

## C. UI/giao diện

Layout, màu sắc, card voucher, header, footer, admin CMS và flow chính được giữ theo cấu trúc cũ. Các thay đổi UI chỉ gồm:

- Thêm `HeroSection.jsx` vì source import component này nhưng file không tồn tại.
- Sửa title/favicon HTML khỏi branding cũ.
- Sửa toaster mobile để không tạo scroll ngang.
- Khôi phục nội dung tiếng Việt cho FAQ/Policy.

## D. Data layer mới

Frontend dùng:

- `src/api/localClient.js`

Backend dùng:

- `server/index.js`
- `server/services/entity-service.js`
- `server/services/prisma.js`
- `server/services/mock-data.js`

`localClient.entities.*` giữ API gần giống source cũ để hạn chế chỉnh UI, nhưng toàn bộ request đi qua API nội bộ `/api/*`, không gọi Base44.

Khi database chưa chạy, API có fallback mock data cho GET public để giao diện không trắng. Khi PostgreSQL chạy và seed xong, API đọc dữ liệu từ Prisma.

## E. Docker/PostgreSQL

File mới:

- `docker-compose.yml`

Services:

- `postgres`: PostgreSQL 16, port `5432`.
- `pgadmin`: PgAdmin, port `5050`.

Tên container có tiền tố `shopee_` để tránh trùng container cũ trên máy:

- `shopee_magiamgia_postgres`
- `shopee_magiamgia_pgadmin`

## F. Prisma/schema/seed

File mới:

- `prisma/schema.prisma`
- `prisma/migrations/20260606000000_init/migration.sql`
- `prisma/migrations/20260606065311/migration.sql`
- `prisma/seed.js`

Models chính:

- `User`
- `Voucher`
- `Brand`
- `Category`
- `BlogPost`
- `ClickEvent`
- `CopyEvent`
- `SyncLog`
- `Campaign`
- `Banner`
- `SiteSetting`
- `HomepageSection`
- `AffiliateTransaction`

Seed tạo admin local và dữ liệu mẫu cho brand, category, voucher, blog khi bảng còn trống.

## G. Auth/admin

Auth admin local nằm ở:

- `server/services/auth-service.js`
- `src/lib/AuthContext.jsx`

Đăng nhập dùng:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

Route `/admin` vẫn được bảo vệ bằng `ProtectedRoute`. Đăng ký, Google login và reset password self-service hiện là placeholder local, có TODO production.

## H. AccessTrade

Service placeholder:

- `server/services/accesstrade/client.js`
- `server/services/accesstrade/sync.js`
- `server/services/accesstrade/deeplink.js`

Biến môi trường:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=
ACCESSTRADE_PUBLISHER_ID=
ACCESSTRADE_SYNC_ENABLED=false
```

Nếu chưa có API key, website vẫn chạy bằng database/seed/mock.

## I. File tạo mới

- `.env.example`
- `docker-compose.yml`
- `package-lock.json`
- `public/favicon.svg`
- `public/manifest.json`
- `public/uploads/.gitkeep`
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `prisma/seed.js`
- `server/index.js`
- `server/services/*`
- `src/api/localClient.js`
- `src/components/home/HeroSection.jsx`
- `docs/BASE44_TO_OWNERSHIP_MIGRATION.md`

## J. File đã chỉnh sửa

- `package.json`
- `vite.config.js`
- `jsconfig.json`
- `eslint.config.js`
- `.gitignore`
- `index.html`
- `README.md`
- `src/App.jsx`
- `src/lib/AuthContext.jsx`
- Các page/component từng gọi Base44 entities/auth.
- `src/components/ui/toast.jsx`
- `src/components/home/FAQSection.jsx`
- `src/page/PolicyPage.jsx`

## K. Dependency

Đã xóa:

- `@base44/sdk`
- `@base44/vite-plugin`

Đã thêm:

- `@prisma/client`
- `prisma`
- `express`
- `dotenv`
- `concurrently`
- `tsx`

## L. Env mới

`.env.example` gồm:

- `NEXT_PUBLIC_APP_URL`
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `STORAGE_PROVIDER`
- `UPLOAD_DIR`
- `ACCESSTRADE_API_BASE_URL`
- `ACCESSTRADE_API_KEY`
- `ACCESSTRADE_PUBLISHER_ID`
- `ACCESSTRADE_SYNC_ENABLED`

Không còn biến `VITE_BASE44_*`.

## M. Cách chạy local bằng PowerShell

```powershell
npm install
copy .env.example .env
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Mở:

```txt
http://localhost:5173
```

Admin:

```txt
http://localhost:5173/admin
```

## N. Test đã chạy

Đã chạy thành công:

- `npm install`
- `npx prisma validate`
- `npx prisma generate`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `docker compose up -d postgres pgadmin`
- `npx prisma migrate dev --skip-seed` với `CI=1` khi cần non-interactive
- `npx prisma migrate deploy`
- `npm run db:seed`
- API smoke test `/api/health`
- API smoke test `/api/vouchers?status=active&limit=3`
- Browser check trang chủ desktop
- Browser check mobile viewport, không còn horizontal overflow

Ghi chú: lần đầu chạy `npx prisma migrate dev` trong tool không tương tác bị treo do prompt/TTY; khi đặt `$env:CI='1'` hoặc khi migration đã khớp thì chạy sạch.

## O. Kết quả search Base44

Trước khi cập nhật tài liệu, keyword Base44 chỉ còn trong README cũ. Sau migration, runtime code không còn:

- `@base44`
- `base44Client`
- `VITE_BASE44`
- URL Base44
- Base44 auth/runtime/function SDK

Lệnh kiểm tra:

```powershell
rg -n "base44|Base44|BASE44|app\.base44\.com|VITE_BASE44|base44Client|@base44" -S -g '!node_modules' -g '!dist' .
```

Kết quả còn lại chỉ nên nằm trong README/tài liệu migration.

## P. TODO

- Thay `ADMIN_PASSWORD=change-me` bằng mật khẩu mạnh trước khi dùng thật.
- Bổ sung flow đổi mật khẩu/self-service nếu cần nhiều admin.
- Hoàn thiện mapping AccessTrade thật khi có API key.
- Bổ sung upload ảnh local hoặc Cloudinary/S3 nếu CMS cần upload banner/logo.
- Thêm kiểm thử tự động cho API CRUD/admin nếu project phát triển tiếp.

## Checklist độc lập

- [x] `npm run dev` chạy được.
- [x] Docker chỉ dùng cho database.
- [x] Website không cần editor/workspace/runtime Base44.
- [x] Không còn import Base44 SDK/client trong runtime code.
- [x] Không còn gọi URL Base44 trong runtime code.
- [x] Không còn env Base44 bắt buộc.
- [x] Database chạy độc lập bằng Docker PostgreSQL.
- [x] Có `.env.example` đầy đủ.
- [x] Có README hướng dẫn chạy local.
- [x] UI giữ nguyên cấu trúc chính và không redesign.
- [x] Build pass.
