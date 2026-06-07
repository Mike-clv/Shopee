# Mã Giảm Giá Pro

Website tổng hợp mã giảm giá, voucher, coupon và deal hot cho Shopee, Lazada, Tiki, TikTok Shop. Source này đã được tách khỏi runtime/SDK của Base44 và chạy độc lập bằng Vite React, Express API, Prisma và PostgreSQL.

Hướng dẫn sử dụng đầy đủ nằm ở:

```txt
docs/HUONG_DAN_SU_DUNG.md
```

## Công nghệ sử dụng

- Frontend: React 18, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/Radix UI.
- Backend local: Express chạy ở `http://localhost:3001`.
- Database: PostgreSQL 16 chạy bằng Docker Compose.
- ORM: Prisma.
- Auth admin: cookie session local, tài khoản lấy từ `.env`.
- Đồng bộ affiliate: service placeholder AccessTrade, chỉ chạy khi cấu hình API key thật.

## Chuẩn bị

1. Cài Node.js LTS.
2. Cài Docker Desktop.
3. Cài ripgrep nếu muốn chạy lệnh kiểm tra nhanh bằng `rg`.

## Cấu hình môi trường

Trong PowerShell:

```powershell
npm install
copy .env.example .env
```

Mở `.env` và đổi các giá trị nhạy cảm trước khi dùng thật:

```env
AUTH_SECRET=change-me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

Không commit file `.env`.

## Chạy database bằng Docker

```powershell
npm run db:up
```

Lệnh này bật 2 service:

- PostgreSQL: `localhost:5432`
- PgAdmin: `http://localhost:5050`

Container trong project này dùng tên `shopee_magiamgia_postgres` và `shopee_magiamgia_pgadmin` để tránh trùng với container cũ trên máy.

## Migrate và seed database

```powershell
npm run db:migrate
npm run db:seed
```

Nếu chạy trong môi trường không tương tác và Prisma hỏi prompt, dùng:

```powershell
$env:CI='1'
npm run db:migrate
Remove-Item Env:\CI
```

Seed chỉ thêm dữ liệu mẫu khi bảng còn trống, không ghi đè dữ liệu admin đã có.

Khi cần refresh lại đúng bộ dữ liệu mẫu giống giao diện gốc trong lúc phát triển:

```powershell
$env:SEED_FORCE_BASELINE='true'
npm run db:seed
Remove-Item Env:\SEED_FORCE_BASELINE
```

Khi đã cấu hình API key AccessTrade thật, dùng dữ liệu thật thay cho dữ liệu mẫu:

```powershell
npm run sync:accesstrade
```

## Chạy website local

```powershell
npm run dev
```

Lệnh này chạy đồng thời:

- API server: `http://localhost:3001`
- Website Vite: `http://localhost:5173`

Docker chỉ dùng cho database, frontend không chạy trong Docker khi dev.

## Đăng nhập admin

Vào:

```txt
http://localhost:5173/login
```

Tài khoản lấy từ `.env`:

```txt
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

Sau khi đăng nhập, vào CMS:

```txt
http://localhost:5173/admin
```

## Build và start production local

```powershell
npm run build
npm run start
```

`npm run start` chạy Express server và phục vụ thư mục `dist` nếu đã build.

Khi deploy production:

```powershell
npm install
npx prisma migrate deploy
npm run build
npm run start
```

Cần cấu hình `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` và các biến AccessTrade nếu dùng affiliate thật.

## Kiểm tra không còn phụ thuộc Base44

```powershell
rg -n "base44|Base44|BASE44|app\.base44\.com|VITE_BASE44|base44Client|@base44" -S -g '!node_modules' -g '!dist' .
```

Kết quả kỳ vọng: chỉ còn nhắc tới Base44 trong tài liệu hướng dẫn/migration, không còn trong runtime code.

## Scripts chính

```txt
npm run dev          # Chạy API + Vite
npm run build        # Build frontend
npm run start        # Chạy API và phục vụ dist
npm run lint         # ESLint
npm run typecheck    # TypeScript check cho cấu hình JS
npm run db:up        # Bật PostgreSQL + PgAdmin
npm run db:down      # Tắt Docker Compose
npm run db:migrate   # Prisma migrate dev
npm run db:seed      # Seed dữ liệu mẫu
npm run db:studio    # Prisma Studio
npm run sync:accesstrade # Đồng bộ campaigns + vouchers thật từ AccessTrade
```

## Ghi chú AccessTrade

Website vẫn chạy bằng dữ liệu database/seed khi chưa có API key. Khi có key thật, cấu hình:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=
ACCESSTRADE_PUBLISHER_ID=
ACCESSTRADE_AUTH_SCHEME=Token
ACCESSTRADE_SYNC_ENABLED=true
```

Sync thật nằm trong `server/services/accesstrade`; lệnh nhanh là `npm run sync:accesstrade`.

## Tài liệu migration

Xem chi tiết tại:

```txt
docs/HUONG_DAN_SU_DUNG.md
docs/BASE44_TO_OWNERSHIP_MIGRATION.md
```
