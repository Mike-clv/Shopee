# Cập nhật logo và tốc độ tải trang

## Những gì đã được cải tiến

- Trang chủ đã dùng API gộp `/api/homepage` để giảm số request khi mở web.
- Public site không còn bị chặn toàn màn hình chỉ vì đang kiểm tra đăng nhập admin.
- Các logo thương hiệu quan trọng đã có fallback nội bộ để không bị trống trên Vercel nếu ảnh ngoài lỗi.

## Các logo đã có fallback nội bộ

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

## Khi nào web sẽ tự dùng logo fallback

Web và trang admin sẽ tự chuyển sang logo fallback nếu:

- `logo` trong database bị trống
- URL logo bên ngoài bị lỗi
- host ảnh ngoài phản hồi chậm hoặc chặn truy cập từ production

## Khi deploy lại lên Vercel

Nên để build command là:

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

Sau khi push code mới:

1. vào project trên Vercel
2. redeploy production
3. hard refresh trình duyệt để kiểm tra lại logo và dữ liệu mới
