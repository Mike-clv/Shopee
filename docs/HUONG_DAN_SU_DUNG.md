# Hướng Dẫn Sử Dụng Mã Giảm Giá Pro

Tài liệu này hướng dẫn chạy website độc lập sau khi tách khỏi Base44, refresh dữ liệu mẫu giống giao diện gốc và quản trị nội dung.

## 1. Chạy Lần Đầu

Yêu cầu máy đã có Node.js LTS và Docker Desktop.

```powershell
npm install
copy .env.example .env
```

Mở `.env` và đổi ít nhất các biến sau:

```env
AUTH_SECRET=change-me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
DATABASE_URL=postgresql://shopee:shopee@localhost:5432/shopee_magiamgia?schema=public
```

Không đưa `.env` lên Git hoặc hosting công khai.

## 2. Bật Database

```powershell
npm run db:up
```

Các service local:

- PostgreSQL: `localhost:5432`
- PgAdmin: `http://localhost:5050`

## 3. Migrate Và Seed Dữ Liệu

```powershell
npm run db:migrate
npm run db:seed
```

Seed thường chỉ thêm dữ liệu khi bảng còn trống. Nếu muốn đưa dữ liệu mẫu về đúng baseline đang dùng để khớp giao diện gốc, chạy:

```powershell
$env:SEED_FORCE_BASELINE='true'
npm run db:seed
Remove-Item Env:\SEED_FORCE_BASELINE
```

Baseline blog hiện gồm 5 bài giống trang `https://sansaleshopee.base44.app/blog`:

- `Cách sử dụng mã giảm giá TikTok Shop cho người mới` - 5/6/2026
- `Top 10 mã giảm giá Lazada không thể bỏ lỡ tháng 6/2026` - 3/6/2026
- `Hướng dẫn săn mã giảm giá Shopee hiệu quả nhất 2026` - 1/6/2026
- `So sánh giá giữa Shopee, Lazada và Tiki - Sàn nào rẻ hơn?` - 28/5/2026
- `5 mẹo tiết kiệm khi mua sắm online mùa sale` - 25/5/2026

Dữ liệu mẫu nằm ở `prisma/seed-data.js`. Khi chạy force baseline, các bài blog mẫu cũ không còn khớp giao diện gốc sẽ được chuyển về `draft`.

## 3.1. Đồng Bộ Dữ Liệu Thật Từ AccessTrade

Khi đã có API key thật, cấu hình `.env`:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=access_key_cua_anh
ACCESSTRADE_AUTH_SCHEME=Token
ACCESSTRADE_SYNC_ENABLED=true
```

Chạy sync toàn bộ campaign và voucher/coupon/deal:

```powershell
npm run sync:accesstrade
```

Chạy riêng từng phần:

```powershell
npm run sync:accesstrade -- campaigns
npm run sync:accesstrade -- vouchers
```

Sau khi sync voucher thành công, hệ thống sẽ:

- Tạo/cập nhật voucher thật từ AccessTrade và chỉ giữ các voucher toàn sàn/toàn nền tảng.
- Tự chuyển voucher shop riêng, voucher sample hoặc voucher không đạt điều kiện về `draft`.
- Tạo/cập nhật brand và category dựa trên dữ liệu thật.
- Cập nhật số lượng voucher active cho brand/category.
- Chuyển voucher AccessTrade cũ không còn đạt bộ lọc về `draft`.
- Ẩn brand/category sample không còn voucher thật.
- Giữ logo 4 sàn Shopee, Lazada, Tiki, TikTok Shop trong khu vực thương hiệu nổi bật.

Nếu muốn giới hạn số trang hoặc số bản ghi khi test:

```env
ACCESSTRADE_SYNC_PAGE_SIZE=50
ACCESSTRADE_SYNC_MAX_PAGES=5
ACCESSTRADE_SYNC_MAX_ITEMS=500
```

## 4. Chạy Website

```powershell
npm run dev
```

Lệnh này chạy đồng thời:

- API: `http://localhost:3001`
- Website: `http://localhost:5173`

Để truy cập website từ điện thoại trong cùng Wi-Fi, dùng địa chỉ IP LAN của máy đang chạy web:

```txt
http://192.168.1.47:5173/
```

Lưu ý: port `3001` chỉ là API/backend, không phải giao diện website. Nếu điện thoại vào được `3001` nhưng không vào được `5173`, kiểm tra `vite.config.js` phải có `server.host = '0.0.0.0'` và khởi động lại bằng `npm run dev`.

Các trang nên kiểm tra sau khi chạy:

- Trang chủ: `http://localhost:5173/`
- Blog: `http://localhost:5173/blog`
- Admin: `http://localhost:5173/admin`

## 4.1. Bảng Mã Nhúng Và Banner AccessTrade

- Khi bấm biểu tượng kính lúp mà chưa nhập từ khóa, website mở `/tim-kiem?embed=1` và hiển thị bảng mã giảm giá nhúng từ AccessTrade.
- Trên trang chủ, bấm vào ô tìm kiếm lớn trong hero sẽ mở popup bảng mã AccessTrade ngay trên trang chủ.
- Nếu nhập từ khóa rồi bấm tìm, website vẫn tìm trong database voucher local đã sync.
- Khung banner/campaign nằm ngay dưới hero trang chủ. Nếu chưa có banner active trong database, website hiển thị 2 banner Shopee mặc định từ `/uploads/66.jpg` và `/uploads/661.png`, cùng trỏ về link campaign Shopee đã cấu hình trong `src/components/home/AdBannerSlot.jsx`.

Thêm banner active qua database:

```sql
INSERT INTO banners (id, title, image_url, target_url, placement, is_active, sort_order, created_date, updated_date)
VALUES (
  'banner_homepage_top_1',
  'Tên chiến dịch',
  'https://link-anh-banner.jpg',
  'https://link-chien-dich-accesstrade',
  'homepage_top',
  true,
  1,
  NOW(),
  NOW()
);
```

Hoặc vào Admin:

- `Admin > Banner đầu trang`: đổi ảnh/link banner nằm dưới hero trang chủ.
- `Admin > Banner mã hot`: đổi ảnh/link banner nằm trong mục `Mã Giảm Giá Hot Hôm Nay` khi chưa có mã hot.
- `Admin > Có Thể Bạn Quan Tâm`: tạo card bài viết/gợi ý sản phẩm có thumbnail và link affiliate AccessTrade.

Nếu cần khôi phục bộ danh mục/thương hiệu/banner mẫu cho trang chủ:

```powershell
npm run seed:homepage
```

## 5. Đăng Nhập Admin

Vào `http://localhost:5173/login`, dùng tài khoản trong `.env`:

```txt
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

Sau khi đăng nhập, vào `http://localhost:5173/admin` để quản trị voucher, thương hiệu, danh mục, blog và thống kê.

## 6. Quản Trị Blog

Vào `http://localhost:5173/admin/blog`.

Các trường chính:

- `Tiêu đề`: tên bài viết hiển thị trên card và trang chi tiết.
- `Slug`: đoạn cuối trong đường link bài viết, ví dụ `/blog/cach-su-dung-ma-giam-gia-tiktok-shop`.
- `Ảnh bìa URL`: ảnh hiển thị trên card blog.
- `Danh mục`: nhãn nhỏ màu cam trên card.
- `Trạng thái`:
  - `draft`: bài nháp, chưa hiển thị ngoài website
  - `published`: xuất bản ngay
  - `scheduled`: hẹn giờ đăng tự động
- `Thời gian đăng`: dùng để sắp xếp bài mới trước. Nếu chọn `scheduled`, đây là thời điểm bài tự chuyển sang `published`.

Các tính năng mới trong trình viết bài:

- `Upload ảnh bìa`: tải ảnh trực tiếp từ máy, không cần dán URL thủ công.
- `Chèn ảnh` trong editor: upload ảnh vào nội dung bài viết và chèn ngay vào markdown.
- `Preview`: xem trước nội dung bài viết ngay trong admin.

Ghi chú:

- Trang `/blog` chỉ hiển thị bài có `status = published`.
- Bài `scheduled` sẽ tự được publish khi tới thời gian hẹn.
- Ở môi trường local, bài scheduled sẽ được publish khi website/API gọi tới danh sách bài viết.
- Trên Vercel, có thể bật thêm cron job để việc publish chạy tự động theo chu kỳ, xem mục deploy bên dưới.

## 6.1. Quản Trị Mục "Có Thể Bạn Quan Tâm"

Vào `http://localhost:5173/admin/interests` hoặc menu `Quan tâm` trong admin.

Các bài ở đây cũng hỗ trợ:

- `draft`, `published`, `scheduled`
- upload thumbnail
- slug thân thiện
- link sản phẩm / affiliate

Giao diện ngoài trang chủ sẽ hiển thị thumbnail và tiêu đề giống nhóm bài blog.

## 7. Build Và Chạy Production Local

```powershell
npm run build
npm run start
```

`npm run start` chạy Express API và phục vụ thư mục `dist` sau khi build.

## 8. Deploy Lên Vercel

Repo hiện đã sẵn sàng để deploy frontend + API chung trên Vercel theo kiểu:

- frontend Vite build ra thư mục `dist`
- backend Express chạy qua `api/index.js`
- upload ảnh runtime dùng `Vercel Blob`

### 8.1. Những gì cần chuẩn bị

1. Database PostgreSQL public để Vercel truy cập được.
   Ví dụ: Neon, Supabase, Railway, Render Postgres, hoặc VPS PostgreSQL của anh.
   Database Docker local `localhost:5432` sẽ không dùng được trên Vercel.
2. Tài khoản Vercel.
3. Nếu muốn upload ảnh bài viết/banner trên production: cần tạo Blob store và lấy `BLOB_READ_WRITE_TOKEN`.

### 8.2. Biến môi trường cần có trên Vercel

Tối thiểu:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=mot_chuoi_bi_mat_rat_dai
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

Nếu dùng AccessTrade:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=
ACCESSTRADE_PUBLISHER_ID=
ACCESSTRADE_AUTH_SCHEME=Token
ACCESSTRADE_SYNC_ENABLED=true
```

Nếu muốn upload ảnh trong admin trên production:

```env
BLOB_READ_WRITE_TOKEN=
```

Khuyến nghị thêm:

```env
CRON_SECRET=mot_chuoi_ngau_nhien_dai_toi_thieu_16_ky_tu
MAX_UPLOAD_IMAGE_SIZE=4194304
```

### 8.3. Deploy bằng Vercel CLI

Theo tài liệu chính thức của Vercel cho Vite, có thể deploy ngay từ thư mục project bằng CLI:

```powershell
npm i -g vercel
vercel login
vercel
```

Lần đầu Vercel sẽ hỏi:

- link project hay tạo project mới
- framework: Vite
- build command: `npm run build`
- output directory: `dist`

Deploy production:

```powershell
vercel --prod
```

### 8.4. Kiểm tra sau khi deploy

Nên test lần lượt:

1. Trang chủ
2. `/blog`
3. `/admin`
4. đăng nhập admin
5. tạo bài viết mới
6. upload ảnh bìa
7. sync AccessTrade
8. mở banner và link affiliate

### 8.5. Hẹn giờ đăng trên Vercel

Code đã có sẵn endpoint:

```txt
/api/cron/publish
```

Endpoint này dùng để publish các bài `scheduled`.

Lưu ý rất quan trọng theo tài liệu Vercel:

- cron trên Vercel Hobby bị giới hạn rất mạnh, không chạy được kiểu mỗi 5 phút
- nếu anh đang dùng gói Hobby, nên dùng cách publish "khi có truy cập" như hiện tại, hoặc tự gắn cron ngoài
- nếu anh dùng Pro, có thể thêm cron job trong `vercel.json` hoặc dashboard

Ví dụ cấu hình cron cho gói Pro:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Khi đã đặt `CRON_SECRET`, Vercel sẽ tự gửi header `Authorization: Bearer <CRON_SECRET>` tới endpoint cron.

## 9. Kiểm Tra Trước Khi Bàn Giao

```powershell
npm run lint
npm run typecheck
npm run build
```

Kiểm tra không còn phụ thuộc Base44 runtime:

```powershell
rg -n "base44|Base44|BASE44|app\.base44\.com|VITE_BASE44|base44Client|@base44" -S -g '!node_modules' -g '!dist' .
```

Kết quả kỳ vọng: chỉ còn nhắc tới Base44 trong tài liệu hướng dẫn hoặc migration, không còn trong code runtime.

## 10. Ghi Chú AccessTrade

Website vẫn chạy bình thường bằng database local nếu chưa có key AccessTrade. Khi có key thật, cấu hình trong `.env`:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=
ACCESSTRADE_PUBLISHER_ID=
ACCESSTRADE_AUTH_SCHEME=Token
ACCESSTRADE_SYNC_ENABLED=true
```

Sau đó chạy `npm run sync:accesstrade` hoặc dùng khu vực admin sync để đồng bộ chiến dịch và voucher theo logic trong `server/services/accesstrade`.

## 11. Lỗi Thường Gặp

Nếu trang trắng hoặc dữ liệu không tải:

```powershell
Get-NetTCPConnection -LocalPort 3001,5173
```

Nếu database chưa có dữ liệu:

```powershell
$env:SEED_FORCE_BASELINE='true'
npm run db:seed
Remove-Item Env:\SEED_FORCE_BASELINE
```

Nếu build lỗi do Prisma client cũ:

```powershell
npx prisma generate
npm run build
```

Nếu upload ảnh trên Vercel bị lỗi:

- kiểm tra đã tạo Blob store chưa
- kiểm tra `BLOB_READ_WRITE_TOKEN` đã add vào Project Settings > Environment Variables chưa
- hệ thống hiện sẽ báo lỗi rõ ràng nếu deploy trên Vercel mà chưa có token Blob
