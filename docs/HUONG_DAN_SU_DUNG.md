# Hướng Dẫn Sử Dụng Mã Giảm Giá Pro

Tài liệu này hướng dẫn cài đặt, chạy local, quản trị nội dung, đồng bộ AccessTrade, deploy lên Vercel và xử lý các lỗi thường gặp cho dự án `Mã Giảm Giá Pro`.

## 1. Yêu cầu môi trường

Máy cần có:

- Node.js LTS
- npm
- Docker Desktop
- Git

## 2. Cài đặt lần đầu

Trong thư mục dự án:

```powershell
npm install
copy .env.example .env
```

Mở file `.env` và chỉnh tối thiểu:

```env
AUTH_SECRET=change-me
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
DATABASE_URL=postgresql://shopee:shopee@localhost:5432/shopee_magiamgia?schema=public
DATABASE_URL_UNPOOLED=postgresql://shopee:shopee@localhost:5432/shopee_magiamgia?schema=public
```

Lưu ý:

- Không đưa file `.env` lên GitHub.
- Không dùng `localhost` trong `DATABASE_URL` khi deploy lên Vercel.
- Tài liệu bảo mật và chống DDoS xem thêm tại `docs/SECURITY_HARDENING.md`.

## 3. Bật database local

```powershell
npm run db:up
```

Sau khi chạy:

- PostgreSQL: `localhost:5432`
- PgAdmin: `http://localhost:5050`

## 4. Tạo bảng và seed dữ liệu

```powershell
npm run db:migrate
npm run db:seed
```

Nếu muốn reset lại bộ dữ liệu mẫu cho giao diện:

```powershell
$env:SEED_FORCE_BASELINE='true'
npm run db:seed
Remove-Item Env:\SEED_FORCE_BASELINE
```

Ngoài ra có thể seed lại riêng dữ liệu trang chủ:

```powershell
npm run seed:homepage
```

## 5. Chạy website local

```powershell
npm run dev
```

Lệnh này chạy đồng thời:

- API/backend: `http://localhost:3001`
- Website/frontend: `http://localhost:5173`

Các trang chính:

- Trang chủ: `http://localhost:5173/`
- Blog: `http://localhost:5173/blog`
- Admin: `http://localhost:5173/admin`

## 6. Truy cập từ điện thoại trong cùng Wi-Fi

Frontend local cần mở bằng IP LAN của máy:

```txt
http://192.168.1.47:5173/
```

Lưu ý:

- Port `3001` là API, không phải giao diện website.
- Frontend chỉ truy cập được từ điện thoại nếu `vite.config.js` dùng:

```js
server: {
  host: '0.0.0.0'
}
```

## 7. Restart server sau khi sửa `.env`

Nếu `npm run dev` đang chạy trong cửa sổ terminal, bấm:

```powershell
Ctrl + C
npm run dev
```

Nếu không có cửa sổ terminal nhưng web vẫn chạy, thường là server đang chạy nền. Khi đó kiểm tra PID:

```powershell
Get-NetTCPConnection -LocalPort 3001,5173 -ErrorAction SilentlyContinue | Select-Object LocalPort,State,OwningProcess
```

Sau đó tắt tiến trình và chạy lại:

```powershell
Stop-Process -Id PID_3001,PID_5173 -Force
cd D:\Shopee
npm run dev
```

## 8. Đăng nhập admin

Trang đăng nhập:

```txt
http://localhost:5173/login
```

Tài khoản admin local lấy từ `.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

Sau khi đăng nhập:

```txt
http://localhost:5173/admin
```

## 9. Đồng bộ dữ liệu thật từ AccessTrade

Khai báo trong `.env`:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=api_key_that_cua_anh
ACCESSTRADE_PUBLISHER_ID=publisher_id_cua_anh
ACCESSTRADE_AUTH_SCHEME=Token
ACCESSTRADE_SYNC_ENABLED=true
```

Chạy sync:

```powershell
npm run sync:accesstrade
```

Hoặc chạy riêng:

```powershell
npm run sync:accesstrade -- campaigns
npm run sync:accesstrade -- vouchers
```

Sau khi sync thành công, hệ thống sẽ:

- Tạo hoặc cập nhật voucher thật từ AccessTrade
- Chuyển voucher sample hoặc voucher không đạt điều kiện về `draft`
- Cập nhật brand, category và số lượng voucher active
- Ẩn các brand hoặc category sample không còn dữ liệu thật

Nếu muốn giới hạn khi test:

```env
ACCESSTRADE_SYNC_PAGE_SIZE=50
ACCESSTRADE_SYNC_MAX_PAGES=5
ACCESSTRADE_SYNC_MAX_ITEMS=500
```

## 10. Bảng mã nhúng AccessTrade và banner

- Bấm biểu tượng kính lúp hoặc ô tìm kiếm lớn ở hero sẽ mở bảng mã giảm giá nhúng AccessTrade.
- Nếu nhập từ khóa rồi tìm kiếm, website sẽ tìm trong dữ liệu voucher local đã sync.

### Banner đầu trang

Quản lý tại:

- `Admin > Banner đầu trang`

### Banner mục “Mã Giảm Giá Hot Hôm Nay”

Quản lý riêng tại:

- `Admin > Banner mã hot`

Đây là khu vực độc lập với banner đầu trang.

### Bài viết “Có Thể Bạn Quan Tâm”

Quản lý tại:

- `Admin > Có Thể Bạn Quan Tâm`

### Tạo bài Quan tâm tự động từ sản phẩm Shopee AccessTrade

Trong trang `Admin > Quan tâm`, anh có thể bấm nút:

- `Tạo 20 bài nháp`

Cách hệ thống chạy:

- Ưu tiên lấy sản phẩm bán chạy từ AccessTrade `top_products`
- Nếu `top_products` chưa có dữ liệu, hệ thống tự dùng `datafeeds?domain=shopee.vn`
- Chỉ tạo bài khi sản phẩm có tối thiểu tên, ảnh và link sản phẩm hợp lệ
- Tự lọc trùng theo mã sản phẩm/fingerprint để chạy lại không tạo bài trùng
- Link sản phẩm sẽ tự động bọc qua AccessTrade và bọc bằng tên miền của anh dạng `/go/...`
- Bài mới luôn ở trạng thái `Nháp`; anh cần xem lại rồi đổi sang `Xuất bản` thì mới hiển thị ngoài trang chủ

## 11. Quản trị blog

Trang quản trị blog:

```txt
http://localhost:5173/admin/blog
```

Các trường chính:

- `Tiêu đề`: tên bài viết
- `Slug`: phần cuối của URL, ví dụ `meo-san-sale-shopee`
- `Ảnh bìa URL`: ảnh thumbnail của bài
- `Nội dung`: nội dung bài viết
- `Trạng thái`: `draft`, `published`, `scheduled`
- `Hẹn giờ đăng`: thời điểm tự động publish

### Slug là gì?

`Slug` là phần cuối của đường dẫn bài viết.

Ví dụ:

```txt
/blog/meo-san-sale-shopee
```

Thì slug là:

```txt
meo-san-sale-shopee
```

Slug nên:

- ngắn gọn
- không dấu
- dùng dấu `-`
- không trùng bài khác

## 12. Upload ảnh bài viết và banner

### Local

Có thể dùng URL ảnh trong `/uploads/...` hoặc URL ngoài.

### Production trên Vercel

Nếu muốn upload ảnh trực tiếp trong admin khi chạy production, cần:

```env
BLOB_READ_WRITE_TOKEN=...
```

Không có biến này thì upload ảnh production sẽ lỗi.

## 13. Các thay đổi giao diện đã có

Hiện tại website đã có các cải tiến sau:

- Logo thương hiệu thật cho các brand chính
- Bảng mã nhúng AccessTrade mở bằng popup
- Banner quảng cáo/campaign tách riêng từng khu vực
- Admin mobile gọn hơn
- Card voucher mobile hiển thị gọn hơn
- Mã voucher trên card chỉ xem trước, copy qua nút `Lấy mã`
- Khi bấm vào voucher để vào trang chi tiết, trang sẽ mở ở đầu trang

## 14. SEO và Google Search Console

Hệ thống đã có:

- Meta title, description, canonical
- Open Graph và Twitter meta
- `robots.txt`
- `sitemap.xml`
- `noindex` cho trang admin, login và search

### Domain production hiện dùng

```txt
https://sansaleshopee.vercel.app/
```

### Xác minh Google Search Console

Meta verify đã được chèn trong `index.html`.

### Sitemap

Sitemap production:

```txt
https://sansaleshopee.vercel.app/sitemap.xml
```

### Robots

Robots production:

```txt
https://sansaleshopee.vercel.app/robots.txt
```

### Nếu Search Console báo “Couldn't fetch”

Nguyên nhân thường là Google đã đọc sitemap ở thời điểm cũ khi route trên Vercel còn lỗi.

Cách xử lý:

1. Kiểm tra trực tiếp `robots.txt` và `sitemap.xml` có mở được không
2. Chờ Google đọc lại
3. Nếu cần:
   - vào `Sitemaps`
   - xóa entry cũ
   - submit lại `sitemap.xml`

## 15. Deploy lên Vercel

Repo GitHub:

```txt
https://github.com/Mike-clv/Shopee
```

### Build command nên dùng

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

### Biến môi trường tối thiểu trên Vercel

```env
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...
AUTH_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

Lưu ý với Neon/Vercel:

- `DATABASE_URL` dùng cho runtime hoặc pooled connection.
- `DATABASE_URL_UNPOOLED` dùng cho `prisma migrate deploy` để tránh lỗi migrate qua pool.

Nếu dùng AccessTrade:

```env
ACCESSTRADE_API_BASE_URL=https://api.accesstrade.vn/v1
ACCESSTRADE_API_KEY=...
ACCESSTRADE_PUBLISHER_ID=...
ACCESSTRADE_AUTH_SCHEME=Token
ACCESSTRADE_SYNC_ENABLED=true
CRON_SECRET=...
```

Nếu upload ảnh:

```env
BLOB_READ_WRITE_TOKEN=...
```

### Deploy bằng CLI

```powershell
npx vercel
npx vercel --prod
```

### Deploy qua GitHub

Khi repo đã connect với Vercel, chỉ cần:

```powershell
git add .
git commit -m "Noi dung thay doi"
git push origin main
```

Vercel sẽ tự deploy lại từ branch `main`.

Nếu Vercel chưa tự nhận commit mới, có thể đẩy một commit rỗng để kích redeploy:

```powershell
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

## 16. Cron và hẹn giờ đăng bài trên Vercel

Project đã có endpoint:

```txt
/api/cron/publish
```

Nếu bật cron trên production, cần có:

```env
CRON_SECRET=...
```

Lưu ý:

- gói Hobby của Vercel bị giới hạn cron
- không nên đặt lịch quá dày kiểu mỗi 5 phút

Và thêm endpoint cron cho module theo dõi giá:

```txt
/api/cron/price-tracking
```

Lưu ý riêng cho module theo dõi giá:

- production chạy batch nhỏ, mỗi lần tối đa 3 sản phẩm
- Vercel Cron dùng UTC. Để chạy lúc 02:00 giờ Việt Nam/Asia-Bangkok, `vercel.json` đang để `0 19 * * *`

Biến môi trường mới:

```env
PRICE_TRACKING_BATCH_SIZE=3
PRICE_TRACKING_CRON_ENABLED=false
PRICE_TRACKING_TIMEOUT_MS=45000
PUPPETEER_EXECUTABLE_PATH=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Lưu ý thêm cho module theo dõi giá:

- Nếu `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` được cấu hình, hệ thống sẽ gửi cảnh báo khi một sản phẩm lỗi cào giá 3 lần liên tiếp.
- Để tránh spam, cảnh báo sẽ nhắc lại ở các mốc 6, 9, 12...
- Ở cuối mỗi lần cron `/api/cron/price-tracking` chạy xong, hệ thống sẽ tự dọn các bản ghi `PriceHistory` cũ hơn 90 ngày.
- SEO public cho `/theo-doi-gia/:slug` và `/tinh-tra-gop` đã chuyển sang `react-helmet-async` thông qua `HelmetProvider`.

Route mới:

- Public:
  - `/theo-doi-gia`
  - `/theo-doi-gia/:slug`
  - `/tinh-tra-gop`
- Admin:
  - `/admin/price-tracking`
  - `/admin/exit-intent-popup`
  - `/admin/global-coupons`

## 17. Xử lý lỗi thường gặp

### 17.1. Điện thoại vào được port 3001 nhưng không vào được 5173

Kiểm tra `vite.config.js` có:

```js
host: '0.0.0.0'
```

Sau đó restart `npm run dev`.

### 17.2. Sync AccessTrade không chạy trên Vercel

Cần kiểm tra:

- đã có `DATABASE_URL`
- đã redeploy sau khi thêm env
- build command có `prisma migrate deploy`
- vào `admin/sync` để bấm sync

### 17.3. Upload ảnh production lỗi

Kiểm tra:

- `BLOB_READ_WRITE_TOKEN`
- project đã kết nối Blob trên Vercel chưa

### 17.4. Mở trang chi tiết voucher nhưng bị giữ vị trí scroll cũ

Đã được sửa bằng:

- `src/components/ScrollToTop.jsx`
- `src/page/VoucherDetail.jsx`

Nếu production chưa nhận fix:

- kiểm tra commit mới đã lên GitHub chưa
- chờ Vercel deploy lại
- nếu cần, đẩy một empty commit để kích deploy mới

## 18. Logo, tốc độ và theo dõi production

### 18.1. Những gì đã được tối ưu

- Trang chủ dùng API gộp `/api/homepage` để giảm số request khi mở web
- Public site không bị chặn bởi kiểm tra đăng nhập admin
- Các thương hiệu chính có mapping logo thật trong `public/brand-logos/` và `src/lib/branding.js`
- Đã bật `Vercel Analytics` và `Vercel Speed Insights`
- Đã bổ sung `robots.txt`, `sitemap.xml`, canonical và meta SEO
- Đã sửa điều hướng để trang chi tiết voucher mở ở đầu trang

### 18.2. Các logo đã có sẵn

- `Shopee`
- `Lazada`
- `Tiki`
- `TikTok Shop`
- `Samsung`
- `Nike`
- `Unilever`
- `L'Oréal`
- `Grab`
- `The Coffee House`
- `concung`

### 18.3. Cách thay logo sau này

1. Thay file logo trong `public/brand-logos/`
2. Nếu cần, cập nhật mapping trong `src/lib/branding.js`
3. Chạy:

```powershell
npm run build
```

4. Đẩy code lên GitHub hoặc redeploy Vercel

### 18.4. Build command nên dùng trên Vercel

```powershell
npx prisma generate && npx prisma migrate deploy && npm run build
```

### 18.5. Kiểm tra sau khi deploy

1. Mở trang chủ
2. Mở trang admin
3. Hard refresh trình duyệt
4. Kiểm tra lại logo thương hiệu, voucher và dữ liệu mới
5. Kiểm tra trang chi tiết voucher có mở đúng đầu trang hay không

### 18.6. Vercel Analytics và Speed Insights

- `Analytics` dùng để đếm lượt truy cập, page views và visitor
- `Speed Insights` dùng để đo tốc độ tải trang và Core Web Vitals
- Sau khi deploy, cần mở web và điều hướng qua vài trang để Vercel bắt đầu có dữ liệu
- Hai package này đã được gắn ở `src/App.jsx`

### 18.7. Google Search Console

- Đã xác minh bằng HTML tag
- Sitemap cần submit là:

```txt
https://sansaleshopee.vercel.app/sitemap.xml
```

- Nếu Search Console báo `Couldn't fetch`, cần kiểm tra lại:
  - `https://sansaleshopee.vercel.app/robots.txt`
  - `https://sansaleshopee.vercel.app/sitemap.xml`
  - sau đó chờ Google đọc lại hoặc submit lại sitemap

### 18.8. Ghi chú production

Nếu production trên Vercel chưa nhận fix mới nhất dù GitHub đã có commit:

1. Kiểm tra deployment mới nhất trên Vercel
2. Hard refresh trình duyệt
3. Nếu cần, tạo empty commit để kích redeploy:

```powershell
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

## 19. Tài liệu liên quan

- Hướng dẫn tổng hợp chính: `docs/HUONG_DAN_SU_DUNG.md`
- Tài liệu tách khỏi Base44: `docs/BASE44_TO_OWNERSHIP_MIGRATION.md`

## 20. Coupon chọn lọc trên trang chủ

### 20.1. Vị trí quản lý

- Vào trang admin: `/admin/global-coupons`
- Dữ liệu được lưu trong bảng `SiteSetting`
- Key cố định là: `global_coupons`

### 20.2. Dùng để làm gì

Mục này dành cho các mã giảm giá anh muốn ghim nổi bật ở trang chủ thay vì phụ thuộc hoàn toàn vào dữ liệu sync tự động.

Ví dụ:
- Mã toàn sàn Shopee
- Mã freeship Lazada
- Mã evergreen cần người dùng bấm lưu trên app

### 20.3. Cách hoạt động

1. Anh tạo hoặc sửa coupon trong trang admin
2. Bấm `Lưu toàn bộ`
3. Hệ thống tự tạo link bọc dạng:

```txt
/go/coupon-<id>
```

4. Khi người dùng bấm vào coupon ở trang chủ:
   - coupon thường: web copy mã trước rồi điều hướng qua link bọc
   - coupon evergreen: web hiển thị nút kiểu `Bấm lưu trên App` và đi thẳng qua link bọc

### 20.4. Lưu ý dữ liệu

- `platform` chỉ hỗ trợ: `shopee`, `lazada`, `tiki`
- `type` chỉ hỗ trợ: `all_site`, `freeship`, `category`
- Nếu `expires_at` đã qua hạn, trang chủ sẽ tự ẩn coupon đó
- Nếu anh paste link sản phẩm gốc hoặc deep link AccessTrade, backend sẽ tự chuẩn hóa về đích redirect cuối cùng
