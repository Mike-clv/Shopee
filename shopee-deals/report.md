# Báo cáo SEO — sansale247.io.vn

- **Ngày lập:** 2026-10-30
- **Baseline commit:** `66b05f24a31c6667fb95aeeea59cd8a40cb0475f`
- **Nhánh làm việc:** `seo/p0-fixes`
- **Backup Git:**
  - Branch: `backup/pre-seo-20261030` (trỏ đúng baseline)
  - Annotated tag: `pre-seo-20261030` (trỏ đúng baseline)
- **Trạng thái:** `KẾ HOẠCH — CHƯA SỬA CODE`
- **Nguyên tắc:** mỗi bước thay đổi = một commit riêng; mỗi commit phải có dòng tương ứng trong mục **Change log** bên dưới.

---

## 1. Mục tiêu

1. Loại bỏ **soft 404**: URL không tồn tại phải trả HTTP 404 (hoặc tối thiểu `noindex`) thay vì 200 + giao diện not-found.
2. Xử lý **19 URL cũ đang được Google index nhưng hiện 404**, bằng redirect 301/308 hoặc 410 có chủ đích.
3. Đảm bảo sitemap, canonical, robots nhất quán với các trang thật.
4. Tạo nền tảng để P1 xây landing page theo sàn/danh mục và tăng khả năng rank.

**Ngoài phạm vi P0:** không đổi giao diện lớn, không đổi schema DB, không đổi luồng affiliate/payment, không deploy production khi chưa được anh duyệt.

---

## 2. Baseline đã đo (ngày 30/10/2026)

### 2.1. Google

| Hạng mục | Kết quả |
|---|---|
| `site:sansale247.io.vn` | khoảng **30–43 URL** |
| 20 kết quả đầu | **19 URL cũ 404**, 1 trang chủ hiện tại |
| `site:.../ma/` | 3 kết quả, toàn bộ `/ma-giam-gia/...` cũ đã 404 |
| Deal hiện tại `9a648a78-4522-4cf8-81b7-c5a0cc336945` | **0 kết quả** |
| `site:.../blog` | 2 bài cũ, hiện 404; 4 bài hiện tại chưa thấy index |
| Brand `sansale247` | `.io.vn` đứng #2 sau `sansale247.net` (#1) |
| Từ khóa `mã giảm giá shopee hôm nay` | không có trong top 10 |

### 2.2. Soft 404 (lỗi ưu tiên cao nhất)

| URL | HTTP | Title | Robots |
|---|---:|---|---|
| `/blog/so-sanh-gia-shopee-lazada-tiki` | 200 | Bài viết không tồn tại | index, follow |
| `/blog/cach-su-dung-ma-giam-gia-tiktok-shop` | 200 | Bài viết không tồn tại | index, follow |
| `/blog/does-not-exist-123` | 200 | Bài viết không tồn tại | index, follow |
| `/ma/does-not-exist-123` | 200 | Mã không tồn tại | index, follow |

**Nguyên nhân code:** `notFound()` đang nằm trong `<Suspense>` ở `app/blog/[slug]/page.tsx` và `app/ma/[id]/page.tsx`. Server đã gửi 200 trước khi biết dữ liệu không tồn tại.

### 2.3. Sitemap / robots / routes

- `sitemap.xml`: 200, **880 URL** (873 `/ma/*`, 4 `/blog/*`, `/`, `/tim-kiem`, `/blog`).
- `robots.txt`: 200; allow `/`; disallow `/admin`, `/admin/login`, `/login`, `/api/`, `/go/`; sitemap đúng.
- Route hiện có: `/`, `/tim-kiem`, `/blog`, `/blog/[slug]`, `/ma/[id]`, `/admin`, `/login`, `/api/cron/sync`, `/api/dev/seed`, `/go/[id]`.
- Không có route `/san/*`, `/danh-muc/*`, `/gioi-thieu`, `/chinh-sach`.
- `/tim-kiem` canonical cố định `/tim-kiem` cho mọi `?merchant=` / `?cate=`.

### 2.4. Metadata / schema / performance

- Homepage: title/description/canonical/robots ổn; H1=1, H2=8; 42 ảnh đều có alt.
- **0 JSON-LD toàn site**, **không có `og:image`**; `twitter:card=summary`.
- Deal page có `Product` + `Offer`; blog có `BlogPosting`.
- TTFB ~0,28s; HTML gzip ~58 KB.
- PageSpeed Insights API trả 429 — **chưa đo được Core Web Vitals**.
- Thiếu About/Contact/Privacy/Terms/affiliate disclosure → E-E-A-T thấp.

---

## 3. Kế hoạch P0 — chống mất index (làm trước)

### Bước 0 — Chốt cơ chế 404 dưới Cache Components

**Mục tiêu:** tìm cách trả 404 thật mà không phá `cacheComponents: true`.

- Không dùng `export const dynamicParams = false` vì Next 16.4.3 + `cacheComponents` báo lỗi build.
- Thử nghiệm theo thứ tự:
  1. Validate `params` + dữ liệu **trước** `<Suspense>`; gọi `notFound()` trước khi stream.
  2. Nếu build chặn vì params nằm ngoài Suspense: dùng `proxy.ts` để chặn sớm các slug/id không tồn tại, trả 404 trước khi render.
  3. Phương án cuối: giữ 200 nhưng set `robots: { index: false, follow: false }` trong `generateMetadata` cho trang không tồn tại; ghi rõ đây là giải pháp tạm.
- **Acceptance:** `curl -I` trả `HTTP/1.1 404` cho `/blog/does-not-exist-123` và `/ma/does-not-exist-123`; các trang thật vẫn 200.
- **Verify:** `pnpm build`; chạy `pnpm dev`; kiểm tra status + title + robots.

### Bước 1 — Sửa blog 404

**File:** `app/blog/[slug]/page.tsx` (có thể thêm `app/blog/[slug]/not-found.tsx` nếu cần).

- `generateMetadata`: nếu slug không tồn tại → `robots: { index: false, follow: false }`, title rõ ràng.
- Page: kiểm tra `getPost(slug)` trước Suspense; nếu không có → `notFound()`.
- Không đổi nội dung 4 bài hiện tại; không đổi URL.
- **Acceptance:** 2 slug cũ + slug random trả 404 thật; 4 bài hiện tại 200.

### Bước 2 — Sửa deal 404

**File:** `app/ma/[id]/page.tsx`.

- `generateMetadata`: nếu id không tồn tại → `robots: { index: false, follow: false }`.
- Page: validate id + `getDealCached(id)` trước Suspense; nếu không có → `notFound()`.
- Giữ nguyên `Product`/`Offer` cho deal thật.
- **Acceptance:** `/ma/does-not-exist-123` trả 404; deal thật `9a648a78-4522-4cf8-81b7-c5a0cc336945` trả 200.

### Bước 3 — Redirect URL cũ đang được Google index

**Bước 3a — Thu thập URL cũ**
- Lấy đầy đủ danh sách từ Google Search Console (nếu có quyền) và/hoặc query `site:sansale247.io.vn`.
- Ghi vào `report.md` bảng: URL cũ → URL đích → status.

**Bước 3b — Map đề xuất**

| URL cũ | Đích P0 | Ghi chú |
|---|---|---|
| `/san/shopee` | `/tim-kiem?merchant=shopee` | P1 sẽ đổi sang `/san/shopee` |
| `/san/tiki` | `/tim-kiem?merchant=tiki` | |
| `/san/lazada` | `/tim-kiem?merchant=lazada` | |
| `/san/tiktok-shop` | `/tim-kiem?merchant=tiktokshop` | |
| `/danh-muc` | `/tim-kiem` | |
| `/danh-muc/:slug` | `/tim-kiem?cate=:slug` | slug không hợp lệ → `/tim-kiem` |
| `/ma-giam-gia` | `/tim-kiem` | |
| `/ma-giam-gia/:slug` | `/ma/:id` nếu map được; nếu không thì `/tim-kiem?q=:slug` | DB không có cột slug; cần map code/title hoặc bảng tĩnh |
| `/gioi-thieu`, `/chinh-sach`, `/quan-tam`, `/thuong-hieu` | khôi phục ở P1 hoặc 410 | cần anh quyết |
| `/theo-doi-gia`, `/tinh-tra-gop` | 410 | tool không còn; tránh redirect về trang không liên quan |

**Bước 3c — Cách triển khai**
- Redirect số lượng nhỏ, cố định: `redirects()` trong `next.config.ts` với `permanent: true` (308).
- Pattern `/ma-giam-gia/:slug` cần lookup DB: route handler hoặc `proxy.ts`, trả `301` tới đích; không tìm thấy → `/tim-kiem?q=`.
- 410: `proxy.ts` trả `new Response(null, { status: 410 })` cho danh sách exact path.
- Không tạo redirect chain; mỗi URL cũ chỉ 1 hop.

**Acceptance:** tất cả URL cũ trả 301/308/410, không còn 404; không redirect loop.

### Bước 4 — Metadata, canonical, sitemap

- `app/not-found.tsx`: xác nhận `robots: noindex` (nếu chưa có thì thêm).
- `app/layout.tsx`: thêm `og:image` mặc định; cân nhắc `Organization` + `WebSite` JSON-LD (P1).
- `app/sitemap.ts`: chỉ chứa URL 200; thêm `lastModified` phù hợp; không thêm URL redirect/404.
- `app/tim-kiem/page.tsx`: giữ canonical `/tim-kiem` cho query; **không** canonical query về homepage.
- `app/robots.ts`: giữ nguyên; chỉ thêm rule nếu cần.

**Acceptance:** sitemap không có URL lỗi; homepage/deal/blog có canonical đúng; 404 có noindex.

### Bước 5 — Verify tổng thể + cập nhật report

Chạy và ghi kết quả vào **Change log** + **Verification log**:

```powershell
pnpm build
pnpm lint
pnpm dev
# kiểm tra status/title/robots của 4 nhóm URL
```

- Kiểm tra 200: `/`, `/tim-kiem`, `/blog`, 4 bài blog, 1 deal thật.
- Kiểm tra 404: `/blog/does-not-exist-123`, `/ma/does-not-exist-123`, 2 slug blog cũ.
- Kiểm tra 301/308/410: 19 URL cũ.
- Kiểm tra `sitemap.xml` không có URL 404.
- Sau khi anh duyệt: deploy preview, kiểm tra lại trên preview; chỉ promote production khi anh đồng ý.

---

## 4. P1 — sau khi P0 ổn định

1. **Landing page sàn:** `app/san/[merchant]/page.tsx` cho 4 sàn; metadata riêng, canonical self, nội dung unique, FAQ, danh sách deal, link affiliate.
2. **Landing page danh mục:** `app/danh-muc/[slug]/page.tsx` cho 16 category; tương tự.
3. **Đổi internal link** từ `/tim-kiem?merchant=` / `?cate=` sang landing page mới ở header/footer/card/breadcrumb.
4. **Trust pages:** About, Contact, Privacy, Terms, affiliate disclosure.
5. **Schema/OG:** `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`; `og:image` mặc định.
6. **Sitemap:** thêm landing pages; kiểm tra lại index.

---

## 5. P2 — tăng trưởng

- Thêm bài blog đúng search intent; internal link từ deal page → blog → landing page.
- Theo dõi GSC: Coverage, Enhancements, Core Web Vitals.
- Backlink/PR; đo lại thứ hạng theo từ khóa mục tiêu.

---

## 6. Rollback

```powershell
# Quay lại baseline
git -C D:\web switch master
git -C D:\web reset --hard 66b05f2

# Hoặc xóa branch làm việc, quay lại backup
git -C D:\web switch backup/pre-seo-20261030
```

- Không xóa branch/tag backup.
- Nếu đã deploy production: dùng Vercel **Instant Rollback** về deployment trước đó; ghi lại deployment ID trong report.

---

## 7. Change log

| # | Commit | File | Nội dung | Verify | Trạng thái |
|---|---|---|---|---|---|
| 0 | _(chưa có)_ | `report.md` | Baseline + kế hoạch + rollback | Đang đọc | Kế hoạch |

> Mỗi commit code tiếp theo phải thêm một dòng vào bảng này **trước khi** commit, ghi rõ file, mục đích, cách verify và kết quả.

---

## 8. Câu hỏi cần anh quyết trước khi code P0

1. **`sansale247.net`** có phải của anh không? Nếu cùng sở hữu, có muốn gộp/301 về `.io.vn` không?
2. Các trang `/gioi-thieu`, `/chinh-sach`, `/quan-tam`, `/thuong-hieu`: **khôi phục nội dung** hay **410**?
3. Anh đã verify Google Search Console cho `sansale247.io.vn` chưa? Nếu chưa, anh muốn xác minh bằng **DNS** hay **HTML meta**? Em cần mã/xác nhận từ anh.
4. P0 chỉ sửa SEO kỹ thuật, **không đổi UI**. Anh đồng ý cho em bắt đầu sau khi anh duyệt report này chứ?
