# Báo cáo bảo mật - 2026-06-08

## Phạm vi kiểm tra

- Frontend Vite/React
- Backend Express tại `server/`
- Cấu hình deploy Vercel
- Xác minh nhanh trên production `https://sansaleshopee.vercel.app`

## Kết luận nhanh

Hiện tại web **chưa bị vỡ bảo mật kiểu đăng nhập admin bị bypass ngay lập tức**, nhưng có **một số lỗ hổng quan trọng cần xử lý sớm**, đặc biệt là:

1. API công khai đang để lộ dữ liệu nội bộ
2. Endpoint thống kê công khai có thể bị spam để làm sai số liệu
3. Đăng nhập admin chưa có rate limit / lockout
4. Upload SVG cùng origin và thiếu các security header cơ bản

## Phát hiện chi tiết

### 1. Public API exposure của dữ liệu nội bộ

- Mức độ: Cao
- Vị trí:
  - `server/index.js` dòng 260-268
  - `server/services/entity-service.js` dòng 47-100, 188-209
- Mô tả:
  - Route `GET /api/:resource` không yêu cầu đăng nhập admin.
  - Hàm `listResource()` cho phép đọc trực tiếp nhiều bảng như `blog-posts`, `interest-posts`, `sync-logs`, `click-events`, `copy-events`, `banners`.
  - Không có server-side rule chặn truy cập public vào dữ liệu nháp hoặc log nội bộ.
- Xác minh production:
  - `GET /api/blog-posts?limit=3` trả về cả bài có `status: "draft"`
  - `GET /api/sync-logs?limit=5` trả về log đồng bộ AccessTrade
  - `GET /api/click-events?limit=3` trả về dữ liệu sự kiện
- Ảnh hưởng:
  - Lộ bài viết chưa xuất bản
  - Lộ hoạt động đồng bộ nội bộ
  - Lộ dữ liệu hành vi người dùng/analytics ở mức cơ bản
  - Tăng bề mặt do thám cho đối thủ hoặc bot
- Khuyến nghị:
  - Chỉ cho public đọc whitelist thực sự cần thiết: voucher active, brand active, category active, blog published, interest published, banner active theo placement public
  - Chuyển các bảng `sync-logs`, `click-events`, `copy-events`, draft content sang admin-only

### 2. Analytics có thể bị spam công khai

- Mức độ: Trung bình cao
- Vị trí:
  - `server/index.js` dòng 274-296
  - `server/services/entity-service.js` dòng 233-263
- Mô tả:
  - `POST /api/click-events` và `POST /api/copy-events` không cần auth.
  - `trackEvent()` còn tự tăng `click_count` / `copy_count` cho voucher và brand nếu gửi `voucher_id`, `brand_id`.
- Ảnh hưởng:
  - Có thể bơm fake click/copy
  - Làm sai dashboard admin
  - Làm bẩn dữ liệu tối ưu nội dung
  - Có thể tăng dung lượng DB/log không cần thiết
- Khuyến nghị:
  - Thêm rate limit theo IP
  - Thêm validation chặt payload
  - Thêm anti-abuse token hoặc server-generated nonce
  - Cân nhắc chỉ ghi analytics qua server action nội bộ / queue

### 3. Đăng nhập admin chưa có rate limit hoặc lockout

- Mức độ: Trung bình
- Vị trí:
  - `server/index.js` dòng 177-191
  - `server/services/auth-service.js` dòng 95-98
- Mô tả:
  - Login admin dùng một cặp `ADMIN_EMAIL` / `ADMIN_PASSWORD` trong env.
  - Không có rate limit, lockout, delay tăng dần, captcha, MFA hoặc audit log đăng nhập thất bại.
- Ảnh hưởng:
  - Nếu password yếu hoặc bị lộ, rất dễ bị brute force / credential stuffing
  - Toàn bộ admin đang phụ thuộc vào một cặp thông tin đăng nhập tĩnh
- Ghi chú:
  - Em đã thử giả mạo cookie bằng secret mặc định `change-me` trên production và **không thành công**, nên production nhiều khả năng đã set `AUTH_SECRET` riêng.
- Khuyến nghị:
  - Thêm rate limit cho `/api/auth/login`
  - Ghi log đăng nhập thất bại
  - Đổi sang hash password thay vì so sánh plaintext env
  - Cân nhắc bật MFA hoặc ít nhất one-time verification cho admin

### 4. Upload SVG cùng origin làm tăng rủi ro XSS

- Mức độ: Trung bình
- Vị trí:
  - `server/services/upload-service.js` dòng 9-15, 27-55
  - `server/index.js` dòng 329
- Mô tả:
  - Admin được upload `image/svg+xml`
  - File được phục vụ trực tiếp cùng origin dưới `/uploads/...`
  - Nếu SVG chứa script độc hại và người dùng/admin mở trực tiếp file đó, có thể tạo bề mặt XSS cùng origin
- Ảnh hưởng:
  - Rủi ro chiếm phiên admin hoặc gọi API nội bộ nếu có kịch bản social engineering / nội dung độc hại
- Khuyến nghị:
  - Tắt upload SVG nếu không thật sự cần
  - Hoặc phục vụ SVG từ domain tách biệt / object storage domain riêng
  - Thêm `X-Content-Type-Options: nosniff` và CSP phù hợp

### 5. Thiếu security headers cơ bản

- Mức độ: Trung bình thấp
- Quan sát production:
  - Có `Strict-Transport-Security`
  - Chưa thấy `Content-Security-Policy`
  - Chưa thấy `X-Frame-Options`
  - Chưa thấy `X-Content-Type-Options`
  - Chưa thấy `Referrer-Policy`
- Ảnh hưởng:
  - Giảm lớp phòng thủ trước clickjacking, MIME sniffing, script injection và rò rỉ referrer
- Khuyến nghị:
  - Thêm bộ header bảo mật tại Vercel/Express:
    - `Content-Security-Policy`
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy`

### 6. Phụ thuộc có advisory XSS trong `react-quill` / `quill`

- Mức độ: Trung bình thấp
- Xác minh:
  - `npm audit --omit=dev`
- Kết quả:
  - `quill <=1.3.7` có advisory XSS
  - Gói bị kéo vào qua `react-quill`
- Ảnh hưởng:
  - Chủ yếu ảnh hưởng vùng editor/admin nếu có nội dung độc hại tương tác với editor
- Khuyến nghị:
  - Lên kế hoạch thay `react-quill` hoặc nâng cấp theo nhánh tương thích an toàn
  - Nếu chưa xử lý ngay, hạn chế paste HTML không tin cậy trong admin

## Điểm tốt hiện có

- Cookie admin đang có `httpOnly`
- Production có `secure` cookie khi `NODE_ENV=production`
- Production có `HSTS`
- Endpoint cron có kiểm tra `CRON_SECRET` nếu env được cấu hình
- Em đã thử giả mạo cookie với secret mặc định và không bypass được production

## Ưu tiên xử lý đề xuất

1. Khóa public API cho dữ liệu nội bộ và draft
2. Chặn spam analytics bằng rate limit + validation
3. Thêm rate limit cho login admin
4. Bỏ SVG upload hoặc tách origin phục vụ file
5. Bổ sung security headers
6. Lên kế hoạch thay `react-quill`

## Mức độ tổng thể hiện tại

- Nếu chỉ xét nguy cơ bị hack ngay: **trung bình**
- Nếu xét rò rỉ dữ liệu nội bộ và độ cứng hệ thống admin: **cần cải thiện sớm**

