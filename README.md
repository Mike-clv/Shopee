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
