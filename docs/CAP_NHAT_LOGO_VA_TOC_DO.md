# Cập Nhật Logo Và Tốc Độ

## 1. Những gì đã được cải tiến

- Trang chủ dùng API gộp `/api/homepage` để giảm số request khi mở web
- Public site không còn bị chặn toàn màn hình vì kiểm tra đăng nhập admin
- Các thương hiệu chính đã có logo thật để tránh ô logo bị trống
- Bật `Vercel Analytics` và `Vercel Speed Insights`
- Bổ sung `robots.txt`, `sitemap.xml`, canonical và meta SEO
- Sửa điều hướng để trang chi tiết voucher mở ở đầu trang

## 2. Các logo đã có sẵn

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

## 3. Vị trí file logo

- Logo assets: `public/brand-logos/`
- Mapping logo: `src/lib/branding.js`

## 4. Cách thay logo sau này

1. Thay file logo trong `public/brand-logos/`
2. Nếu cần, cập nhật mapping trong `src/lib/branding.js`
3. Chạy:

```bash
npm run build
```

4. Đẩy code lên GitHub hoặc redeploy Vercel

## 5. Build command trên Vercel

Nên dùng:

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

## 6. Kiểm tra sau khi deploy

1. Mở trang chủ
2. Mở trang admin
3. Hard refresh trình duyệt
4. Kiểm tra lại logo thương hiệu, voucher và dữ liệu mới
5. Kiểm tra trang chi tiết voucher có mở đúng đầu trang hay không

## 7. Vercel Analytics và Speed Insights

- Package đã được gắn vào app root trong `src/App.jsx`
- `Analytics` dùng để đếm lượt truy cập, page views và visitor
- `Speed Insights` dùng để đo tốc độ tải trang và Core Web Vitals
- Sau khi deploy, cần mở web và điều hướng qua vài trang để Vercel bắt đầu có dữ liệu

## 8. SEO và Google

- Meta title, description, canonical, Open Graph và Twitter tags đã được thêm theo từng trang
- `robots.txt` và `sitemap.xml` được phục vụ riêng trên Vercel
- Các trang admin, login và tìm kiếm được để `noindex`
- Đã xác minh Google Search Console bằng HTML tag
- Nên submit:

```txt
https://sansaleshopee.vercel.app/sitemap.xml
```

## 9. Ghi chú production

Nếu production trên Vercel chưa nhận fix mới nhất dù GitHub đã có commit:

1. Kiểm tra deployment mới nhất trên Vercel
2. Hard refresh trình duyệt
3. Nếu cần, tạo empty commit để kích redeploy:

```powershell
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```
