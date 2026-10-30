# Báo cáo SEO — sansale247.io.vn

- **Ngày lập:** 2026-10-30
- **Baseline commit:** `66b05f24a31c6667fb95aeeea59cd8a40cb0475f`
- **Nhánh làm việc:** `main`
- **Backup Git:**
  - Branch: `backup/pre-seo-20261030` (trỏ đúng baseline)
  - Annotated tag: `pre-seo-20261030` (trỏ đúng baseline)
- **Trạng thái:** `P2 ĐÃ DEPLOY PRODUCTION — GSC SITEMAP ĐÃ SUBMIT LẠI; UI MOBILE FOOTER + BACK TO TOP ĐÃ DEPLOY PRODUCTION`
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
| Brand `sansale247` | `.io.vn` đứng #2 sau `sansale247.net` (#1). Anh đã xác nhận `.net` là web copy, **không phải của anh** → không xử lý/gộp `.net`. |
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
- Anh đã xác nhận **đã verify Google Search Console** cho `sansale247.io.vn`.
- Lấy danh sách URL lỗi trong GSC: **Indexing → Pages → Not found (404)** và **Soft 404**; đối chiếu với query `site:sansale247.io.vn`.
- Ghi vào `report.md` bảng: URL cũ → URL đích → status.
- Sau khi P0 deploy: submit lại `sitemap.xml` trong GSC và dùng **URL Inspection** cho 4 nhóm URL đại diện (home, blog, deal, 1 URL cũ).

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
| `/gioi-thieu`, `/chinh-sach`, `/quan-tam`, `/thuong-hieu` | **410** | Anh đã chốt 410; P1 sẽ viết trang mới tại URL mới phù hợp, không tái sử dụng URL cũ |
| `/theo-doi-gia`, `/tinh-tra-gop` | **410** | Tool không còn; tránh redirect về trang không liên quan |

> **Phạm vi 410:** chỉ 6 URL nội dung/tool nêu trên. Các nhóm `/san/*`, `/danh-muc/*`, `/ma-giam-gia*` vẫn **301** vì đã có trang tương đương (search/merchant), 410 sẽ làm mất link equity vô ích.

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

### 3.1. Kết quả triển khai P0 (local, chưa deploy)

**File đã sửa:**
- `app/blog/[slug]/page.tsx`
- `app/ma/[id]/page.tsx`
- `proxy.ts`
- `lib/coupons/dealExists.ts` (mới)

**Thay đổi chính:**
- Blog: proxy chặn slug không tồn tại trước khi render → **404** thật; metadata `robots: noindex` vẫn là fallback.
- Deal: proxy kiểm tra UUID + tồn tại/active trong DB trước khi render → **404** thật, kể cả UUID hợp lệ nhưng không tồn tại. Page vẫn kiểm tra lại và dùng `connection()` trước lookup để tránh PGlite chạy trong prerender.
- Bỏ `generateStaticParams` một-deal và thêm `connection()`: loại bỏ log `Date.now()` / `NEXT_STATIC_GEN_BAILOUT`; route vẫn partial prerender nhưng không còn lỗi.
- `safeDecode()` cho path malformed: `/ma/%E0%A4%A` trả **404** thay vì 500.
- Legacy routing trong `proxy.ts`:
  - `/san/*` → `/tim-kiem?merchant=*` (301)
  - `/danh-muc` → `/tim-kiem` (301)
  - `/danh-muc/:slug` → `/tim-kiem?cate=:slug` (301)
  - `/ma-giam-gia` → `/tim-kiem` (301)
  - `/ma-giam-gia/:slug` → `/tim-kiem?q=:slug` (301)
  - 6 URL nội dung/tool cũ → **410** kèm trang HTML thân thiện, `noindex`.

**Kiểm chứng local (sau build, `pnpm start`):**
| URL | Kết quả |
|---|---|
| `/blog/does-not-exist-123` | 404 |
| `/blog/so-sanh-gia-shopee-lazada-tiki` (slug cũ) | 404 |
| `/blog/stack-voucher-shopee-3-lop` | 200 |
| `/ma/does-not-exist-123` | 404 |
| `/ma/00000000-0000-4000-8000-000000000000` | **404** |
| `/ma/%E0%A4%A` (malformed) | 404 |
| `/ma/23673e68-3fde-4ae0-a73f-6abde0583cba` (deal local) | 200 |
| `/san/tiktok-shop` | 301 → `/tim-kiem?merchant=tiktokshop` |
| `/danh-muc/sach` | 301 → `/tim-kiem?cate=sach` |
| `/ma-giam-gia`, `/ma-giam-gia/abc` | 301 → `/tim-kiem` |
| `/gioi-thieu`, `/chinh-sach`, `/quan-tam`, `/thuong-hieu`, `/theo-doi-gia`, `/tinh-tra-gop` | 410 |
| `/sitemap.xml` | 200, không chứa slug cũ/gone paths |

- `pnpm exec tsc --noEmit` — pass.
- `pnpm lint` — pass.
- `pnpm build` — pass; 17/17 static pages; `/ma/[id]` partial prerender; `/blog/[slug]` partial.
- `pnpm start` + curl matrix: **không còn** log `Date.now()` / `NEXT_STATIC_GEN_BAILOUT`; không có lỗi `URIError`.
- **Đã verify trên Vercel preview:** proxy đọc DB được trên Vercel; các case 404/301/410 hoạt động đúng.
- **Chưa promote production.** Cần anh duyệt trước khi merge `main` và deploy production.

### 3.2. Verify Vercel Preview (2026-10-30)

- **Branch:** `seo/p0-fixes` đã push lên `origin/seo/p0-fixes`.
- **Preview deployment:** `dpl_Gn4h2awtkEBjFjrCZ3jtFpSv4kfr`, commit `28e01ca`, trạng thái **Ready**.
- **URL:** https://shopee-git-seo-p0-fixes-mamoru09s-projects.vercel.app
- **Lưu ý:** Vercel Authentication đang bật cho preview; test qua Chrome đã đăng nhập Vercel (request cuối trả status thật sau SSO).
- **Kết quả:**

| URL | Kết quả |
|---|---|
| `/ma/does-not-exist-123` | **404** |
| `/ma/00000000-0000-4000-8000-000000000000` | **404** |
| `/ma/9a648a78-4522-4cf8-81b7-c5a0cc336945` (deal production) | **200**, nội dung đầy đủ |
| `/blog/does-not-exist-123` | **404** |
| `/blog/so-sanh-gia-shopee-lazada-tiki` (slug cũ) | **404** |
| `/san/tiktok-shop` | **301** → `/tim-kiem?merchant=tiktokshop` |
| `/danh-muc/sach` | **301** → `/tim-kiem?cate=sach` |
| `/gioi-thieu` | **410** |
| `/sitemap.xml` | **200** |

- **Proxy + DB trên Vercel:** hoạt động; UUID hợp lệ nhưng không tồn tại trả 404 thật, deal thật trả 200.
- **Runtime logs preview:** không thấy `Date.now` / `NEXT_STATIC_GEN_BAILOUT` / `Error` trong cửa sổ kiểm tra.
- **Chưa promote production.**

### 3.3. Deploy Production + GSC (2026-10-30)

- **Merge:** `seo/p0-fixes` → `main` fast-forward, push `66b05f2..6016324`.
- **Production deployment:** `dpl_8KVk8m3AZ76UeoC4YaTm6HSGh5SY`, commit `6016324`, trạng thái **Ready** lúc `9:13:43 GMT+7 30/10/2026`.
- **Domain:** `https://sansale247.io.vn` đã gán deployment mới.
- **Kết quả curl production:**

| URL | Kết quả |
|---|---|
| `/` | 200 |
| `/ma/does-not-exist-123` | **404** |
| `/ma/00000000-0000-4000-8000-000000000000` | **404** |
| `/ma/9a648a78-4522-4cf8-81b7-c5a0cc336945` | 200 |
| `/blog/does-not-exist-123` | **404** |
| `/blog/so-sanh-gia-shopee-lazada-tiki` | **404** |
| `/blog/stack-voucher-shopee-3-lop` | 200 |
| `/san/tiktok-shop` | **301** → `/tim-kiem?merchant=tiktokshop` |
| `/danh-muc/sach` | **301** → `/tim-kiem?cate=sach` |
| `/ma-giam-gia` | **301** → `/tim-kiem` |
| `/gioi-thieu` | **410** |
| `/sitemap.xml` | 200 |

- **404 body:** `robots: noindex, follow`, title `Không tìm thấy trang`.
- **Runtime logs production:** không có `Date.now` / `NEXT_STATIC_GEN_BAILOUT` / `Error` trong cửa sổ kiểm tra.
- **GSC:**
  - Sitemap `/sitemap.xml`: bấm Submit lại → **"Sitemap submitted successfully"**.
  - `/`: **Page is indexed**; đã **Request indexing**.
  - `/blog/stack-voucher-shopee-3-lop`: **Discovered — currently not indexed**; đã **Request indexing**.
  - `/ma/9a648a78-4522-4cf8-81b7-c5a0cc336945`: **Discovered — currently not indexed**; đã **Request indexing**.
  - `/san/tiktok-shop`: **Page is indexed**; đã **Request indexing** để Google thấy 301.
  - `/gioi-thieu`: live test **"Page cannot be indexed: Not found (404)"**; request indexing bị từ chối (đúng, vì URL đã 410). Google sẽ tự loại khi recrawl.

---

## 4. P1 — sau khi P0 ổn định

### 4.1. Trust pages P1 — đã code local (2026-10-30)

- **Branch:** `seo/p1-trust-pages`.
- **Route đã thêm:**
  - `/ve-chung-toi`
  - `/lien-he`
  - `/chinh-sach/tiet-lo-affiliate`
  - `/chinh-sach/chinh-sach-bien-tap`
  - `/chinh-sach/chinh-sach-bao-mat`
  - `/chinh-sach/dieu-khoan-su-dung`
  - `/chinh-sach/mien-tru-trach-nhiem`
  - `/chinh-sach/cookie`
- **Code:**
  - `lib/legal/content.ts`: nội dung 6 trang chính sách + `TRUST_LINKS`.
  - `lib/components/LegalPage.tsx`: layout chung, breadcrumb, sidebar internal link, ngày cập nhật.
  - `app/ve-chung-toi/page.tsx`, `app/lien-he/page.tsx`.
  - `app/chinh-sach/[slug]/page.tsx`: `generateStaticParams` 6 slug, metadata canonical/OG, unknown slug 404.
  - `proxy.ts`: chặn slug chính sách không tồn tại → 404 thật trước PPR shell.
  - `app/layout.tsx`: footer thêm 8 link trust pages.
  - `app/sitemap.ts`: thêm 8 URL trust pages.
- **Email liên hệ:** `contact@sansale247.io.vn` (fallback trong `SITE.contactEmail`, có thể override bằng `NEXT_PUBLIC_CONTACT_EMAIL`). **Đã hoạt động** — Zoho Mail free, SPF/DKIM/DMARC pass (xem 4.4).
- **Verify local:**
  - 8/8 trang trả **200**; `/chinh-sach/khong-ton-tai` trả **404**.
  - `/chinh-sach` và `/gioi-thieu` vẫn **410** (không xung đột route mới).
  - Footer homepage có link trust pages; sitemap có 8 URL mới.
  - `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` pass.
  - Screenshot desktop `/ve-chung-toi` + `/chinh-sach/chinh-sach-bao-mat` hiển thị đúng layout, sidebar, nội dung.
- **Đã push branch `seo/p1-trust-pages`:**
  - `89c75fb` — code trust pages.
  - `c00d6fe` — log verify + checklist.
- **Preview deployment:** `6J7XGA8imzMf4ydQtT4kLh6iUeZg` (Vercel, commit `c00d6fe`), trạng thái GitHub **success**.
- **URL preview:** https://shopee-git-seo-p1-trust-pages-mamoru09s-projects.vercel.app
- **Verify preview (Chrome đã đăng nhập Vercel, 2026-10-30):**
  - Fetch nội bộ trên preview: 8/8 trust page **200**; `/chinh-sach/khong-ton-tai` **404**; `/chinh-sach` + `/gioi-thieu` **410**; `/blog/does-not-exist-123` **404**.
  - Canonical + `og:url` của `/chinh-sach/cookie` trỏ đúng `https://sansale247.io.vn/...`.
  - Sitemap preview: **8/8** URL trust pages, tổng **888** URL, base đúng `https://sansale247.io.vn`.
  - Footer homepage có link trust pages; các trang render đúng layout/sidebar/nội dung.
- **Lưu ý:** preview bật Vercel Authentication (SSO), curl ngoài nhận **302** về `vercel.com/sso-api`; verify tự động cần đăng nhập Chrome hoặc Protection Bypass token.
- **Chưa merge `main`, chưa deploy production.**

### 4.2. Landing pages P1 — đã code local (2026-10-30)

- **Branch:** `seo/p1-landing-pages`, tạo từ `seo/p1-trust-pages`.
- **Route đã thêm:**
  - 4 trang sàn: `/san/shopee`, `/san/tiki`, `/san/lazada`, `/san/tiktokshop`.
  - 16 trang danh mục: `/danh-muc/{freeship,food,beauty,health,book,electronics,fashion,home,baby,sports,auto,pet,toys,jewelry,tools,voucher}`.
- **Code:**
  - `lib/landing/content.ts`: nội dung unique cho 4 sàn + 16 danh mục; FAQ dùng chung cho danh mục; type `MerchantLanding`, `CategoryLanding`, `LandingFaq`.
  - `lib/components/LandingPage.tsx`: layout chung hero, stats, tổng quan, lưới deal, FAQ `<details>`, sidebar, ghi chú affiliate.
  - `app/san/[merchant]/page.tsx`: `generateStaticParams` 4 sàn; metadata canonical/OG; JSON-LD `CollectionPage` + `BreadcrumbList` + `FAQPage`; 24 deal mới nhất; sidebar sàn khác + danh mục.
  - `app/danh-muc/[slug]/page.tsx`: `generateStaticParams` 16 danh mục; metadata canonical/OG; JSON-LD tương tự; 24 deal mới nhất; đếm deal theo sàn; sidebar sàn có deal + danh mục khác.
  - `lib/categories.ts`: thêm `CATEGORY_SLUGS`.
  - `proxy.ts`: bỏ redirect `/san/:merchant` và `/danh-muc/:slug`; giữ 301 `/san/tiktok-shop` → `/san/tiktokshop`; unknown slug trả 404 thật trước PPR shell; `/san`, `/danh-muc`, `/ma-giam-gia` vẫn 301 `/tim-kiem`.
  - `app/layout.tsx`, `app/page.tsx`: đổi internal link header/footer/home từ `/tim-kiem?merchant=` / `?cate=` sang `/san/*` / `/danh-muc/*`.
  - `app/sitemap.ts`: thêm 4 URL sàn + 16 URL danh mục.
- **Verify local:**
  - 4/4 trang sàn **200**; 16/16 trang danh mục **200**.
  - `/san/tiktok-shop` → **301** `/san/tiktokshop`; `/san/foo`, `/danh-muc/foo` → **404**.
  - `/san`, `/danh-muc`, `/ma-giam-gia` → **301** `/tim-kiem`; `/gioi-thieu`, `/chinh-sach` vẫn **410**.
  - Canonical + `og:url` đúng trên `/san/shopee` và `/danh-muc/freeship`; JSON-LD có `CollectionPage`, `BreadcrumbList`, `FAQPage`.
  - Sitemap local: **815 URL**, có đủ 4 sàn + 16 danh mục.
  - Homepage/header/footer có link `/san/*`, `/danh-muc/*`, trust pages.
  - `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` pass.
  - Screenshot desktop `/san/shopee` + `/danh-muc/freeship` hiển thị đúng hero, stats, sidebar.
- **Lưu ý:** một số danh mục hiện **0 deal** (ví dụ `freeship`); trang vẫn có nội dung + empty state. Nếu kéo dài, cân nhắc `noindex` hoặc loại khỏi sitemap để tránh thin content.
- **Đã commit `ba23ef6` + docs `76f2d01`; đã push branch `seo/p1-landing-pages`.**
- **Preview deployment:** `dpl_HJX5sX5UFNefdJfqr8EzuLzHCwQc` (Vercel, trạng thái **Ready**).
- **URL preview:** https://shopee-git-seo-p1-landing-pages-mamoru09s-projects.vercel.app
- **Verify preview (Chrome đã đăng nhập Vercel, 2026-10-30):**
  - 4/4 trang sàn **200**; 16/16 trang danh mục **200**.
  - `/san/tiktok-shop` → cuối cùng `/san/tiktokshop` (301); `/san/foo`, `/danh-muc/foo` **404**.
  - `/danh-muc`, `/san` → `/tim-kiem`; `/gioi-thieu`, `/chinh-sach` **410**; `/chinh-sach/khong-ton-tai` **404**.
  - 8/8 trust pages vẫn **200** trên preview.
  - Canonical `/san/shopee` = `https://sansale247.io.vn/san/shopee`; JSON-LD có `CollectionPage`, `BreadcrumbList`, `FAQPage`.
  - Sitemap preview: **908 URL**, có đủ 4 sàn + 16 danh mục.
  - Screenshot desktop `/san/shopee` + `/danh-muc/food` hiển thị đúng hero, stats, sidebar.
- **Lưu ý:** preview bật Vercel Authentication (SSO), curl ngoài nhận **302** về `vercel.com/sso-api`; console có cảnh báo CSP report-only do Vercel Live iframe, chỉ preview.
- **Chưa merge `main`, chưa deploy production.**

### 4.3. FAQ + HTML sitemap + schema/OG — đã code local (2026-10-30)

- **Branch:** `seo/p1-landing-pages`.
- **Route mới:**
  - `/faq`: trang câu hỏi thường gặp, 4 nhóm / 13 câu.
  - `/sitemap`: HTML sitemap cho người dùng.
  - `/opengraph-image`: ảnh OG mặc định 1200×630.
- **Code:**
  - `lib/faq/content.ts`: nội dung FAQ + `FAQ_GROUPS`, `FAQ_ITEMS`, `FAQ_UPDATED`.
  - `app/faq/page.tsx`: metadata canonical/OG, FAQ accordion, sidebar, JSON-LD `FAQPage` 13 câu.
  - `app/sitemap/page.tsx`: HTML sitemap gồm trang chính, 4 sàn, 16 danh mục, chính sách, blog, 60 deal mới.
  - `lib/seo.ts` + `app/opengraph-image.tsx`: ảnh OG mặc định; thêm `images: [OG_IMAGE]` vào `openGraph` của các page; deal page ưu tiên ảnh sản phẩm, fallback OG mặc định.
  - `app/layout.tsx`: JSON-LD `Organization` + `WebSite` (SearchAction), footer thêm link Sitemap.
  - `lib/legal/content.ts`: `TRUST_LINKS` thêm `/faq`.
  - `app/sitemap.ts`: thêm `/faq` + `/sitemap`.
- **Verify local:**
  - 30/30 route chính **200** (9 trust/FAQ + HTML sitemap + 4 sàn + 16 danh mục).
  - `/faq`, `/sitemap`, `/opengraph-image` (image/png), `/sitemap.xml` **200**.
  - FAQ có canonical đúng, `og:image` 1200×630, JSON-LD `Organization`, `WebSite`, `FAQPage` 13 câu.
  - HTML sitemap có 60 link deal + link `/faq`, `/sitemap.xml`, `/san/shopee`, `/danh-muc/freeship`, `/chinh-sach/cookie`, `/ve-chung-toi`.
  - Footer homepage có `/faq`, `/sitemap`, `/ve-chung-toi`, `/chinh-sach/cookie`.
  - XML sitemap local **817 URL**, có `/faq` + `/sitemap`.
  - `/san/foo`, `/danh-muc/foo`, `/chinh-sach/khong-ton-tai`, `/blog/does-not-exist-123` **404**; `/san`, `/danh-muc`, `/ma-giam-gia` **301** `/tim-kiem`; `/gioi-thieu`, `/chinh-sach` **410**.
  - `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` pass; screenshot desktop `/faq` + `/sitemap` hiển thị đúng.
- **Lưu ý:** file-based `opengraph-image` không tự thêm `og:image` khi page có `openGraph` explicit; đã sửa bằng `images: [OG_IMAGE]` ở tất cả metadata.
- **Đã commit `b0e3d45`; docs `12092ea`; đã push branch `seo/p1-landing-pages`.**
- **Preview deployment:** `dpl_GvkFttf387Nhw6xpdbXkp7iFpycM` (Vercel, trạng thái **Ready**).
- **URL preview:** https://shopee-git-seo-p1-landing-pages-mamoru09s-projects.vercel.app
- **Verify preview (Chrome đã đăng nhập Vercel, 2026-10-30):**
  - 30/30 route chính **200** (9 trust/FAQ + HTML sitemap + 4 sàn + 16 danh mục).
  - `/san/foo`, `/danh-muc/foo`, `/chinh-sach/khong-ton-tai`, `/blog/does-not-exist-123` **404**; `/san`, `/danh-muc` → `/tim-kiem`; `/gioi-thieu`, `/chinh-sach` **410**.
  - Canonical `/faq` = `https://sansale247.io.vn/faq`; `og:image` = `https://sansale247.io.vn/opengraph-image`; FAQ JSON-LD 13 câu.
  - `/san/shopee` + `/danh-muc/food` có `CollectionPage`, `BreadcrumbList`, `FAQPage`; `og:image` đúng.
  - HTML sitemap 60 link deal + link `/faq`; XML sitemap **910 URL**, có `/faq`, `/sitemap`, 4 sàn, 16 danh mục.
  - `/opengraph-image` trả **200 image/png**.
  - Screenshot desktop `/faq` + `/sitemap` trên preview hiển thị đúng.
- **Lưu ý:** preview bật Vercel Authentication (SSO); verify bằng Chrome đã đăng nhập. Console chỉ có cảnh báo CSP report-only do Vercel Live iframe.
- **Chưa merge `main`, chưa deploy production.**

### 4.4. Email liên hệ — ĐÃ HOẠT ĐỘNG (Zoho Mail free, 2026-10-30)

- **Kết luận:** `contact@sansale247.io.vn` **đã provision và gửi/nhận thành công**, SPF/DKIM/DMARC đều pass.
- **Nhà cung cấp:** Zoho Mail free (5 user, 5GB/user, webmail + app; **không có IMAP/POP/SMTP** — chỉ dùng webmail/app).
- **Tài khoản:** owner `Cao Phi Hung`, org id `944647294`, user id `944652771`; recovery email `cleverlearnmike@gmail.com`.
- **DNS đã thay đổi tại PA** (`https://access.pavietnam.vn/dns`, domain id `2934176`):
  - MX `@`: `mx.zoho.com` 10, `mx2.zoho.com` 20, `mx3.zoho.com` 50 — đã xóa MX cũ `mail.sansale247.io.vn`.
  - TXT `@`: `v=spf1 include:zoho.com ~all` (thay `v=spf1 a mx ~all`).
  - TXT `zmail._domainkey`: DKIM Zoho (`v=DKIM1; k=rsa; p=MIGf...IDAQAB`).
  - TXT `_dmarc`: `v=DMARC1; p=none; rua=mailto:contact@sansale247.io.vn`.
  - TXT `@`: `zoho-verification=zb63649413.zmverify.zoho.com`.
  - **Không đụng** A `@ 216.198.79.1`, CNAME `www`, A `mail`/`ftp`, wildcard A → website vẫn ở Vercel.
- **Xác thực:**
  - Zoho admin: `Tất cả các bản ghi đã được xác thực thành công`.
  - PA authoritative NS (`ns1.pavietnam.vn`): đủ MX/SPF/DKIM/DMARC.
  - Gmail → `contact@`: nhận lúc 10:29 (30/10/2026).
  - `contact@` → Gmail: nhận lúc 10:30; Gmail `mailed-by: sansale247.io.vn`, `signed-by: sansale247.io.vn`, TLS 1.3.
  - Header Gmail: `SPF: PASS` (IP 165.173.180.52), `DKIM: PASS` (`d=sansale247.io.vn`, `s=zmail`), `DMARC: PASS` (`p=NONE`).
- **Mật khẩu mailbox:** đã đổi trong Zoho admin (không ghi vào repo). Nếu cần reset: Zoho admin → Users → `contact@` → Bảo mật → Đổi mật khẩu.
- **Lưu ý vận hành:** free plan không gửi được từ Gmail/Outlook client (không SMTP); muốn dùng client phải nâng plan. Với nhu cầu hiện tại (nhận thư liên hệ + reply qua webmail) là đủ.
- **Trước production:** không còn blocker email; `SITE.contactEmail` giữ `contact@sansale247.io.vn`.

### 4.5. Thứ tự P1 còn lại

1. ~~Landing page sàn~~ — đã code local.
2. ~~Landing page danh mục~~ — đã code local.
3. ~~Đổi internal link~~ — đã đổi header/footer/home.
4. ~~FAQ~~ — đã code local.
5. ~~HTML sitemap~~ — đã code local.
6. ~~Schema/OG~~ — đã thêm `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, OG mặc định.
7. ~~Preview + production~~ — đã deploy production `dpl_6VR9tsPhNs7mTtVmyr7mN8dGJZb2` ngày 30/10/2026.
8. ~~Sitemap~~ — đã submit lại GSC; request indexing 2 URL mới; landing pages đã indexed sẵn.

### 4.6. Checklist một website thương mại/affiliate hoàn chỉnh

Đây là checklist P1, không phải P0. Với mô hình của `sansale247` (site giới thiệu deal + link affiliate, **không bán trực tiếp**), không cần cart/checkout/shipping; nhưng cần minh bạch và đủ niềm tin.

#### A. Trang bắt buộc

| Trang | Mục đích | Ghi chú cho `sansale247` |
|---|---|---|
| Trang chủ | Định vị site, điều hướng, CTA | Đã có |
| Giới thiệu (`/ve-chung-toi`) | Ai làm, vì sao đáng tin, sứ mệnh | **Đã có** bản P1; cần bổ sung đội ngũ/ảnh thật khi có |
| Liên hệ (`/lien-he`) | Kênh liên hệ, thời gian phản hồi | **Đã có** email `contact@sansale247.io.vn`; hộp thư **đã hoạt động** (Zoho free, SPF/DKIM/DMARC pass) |
| Chính sách bảo mật (`/chinh-sach/chinh-sach-bao-mat`) | Thu thập gì, dùng làm gì, lưu bao lâu, chia sẻ ai, quyền xóa/sửa | **Đã có**; đủ 8 nhóm nội dung theo Nghị định 248/2026 |
| Điều khoản sử dụng (`/chinh-sach/dieu-khoan-su-dung`) | Quy tắc dùng site, giới hạn trách nhiệm, IP, luật áp dụng | **Đã có** |
| Tuyên bố affiliate (`/chinh-sach/tiet-lo-affiliate`) | Nói rõ có thể nhận hoa hồng khi mua qua link | **Đã có**; vẫn cần disclosure gần link/đầu nội dung |
| Chính sách biên tập (`/chinh-sach/chinh-sach-bien-tap`) | Ai kiểm tra deal, tần suất cập nhật, tiêu chí chọn deal | **Đã có** |
| FAQ (`/faq`) | Giải đáp cách dùng mã, mã hết hạn, hoàn tiền do ai xử lý | **Đã có** 4 nhóm / 13 câu; JSON-LD `FAQPage` |
| 404 | Trang lỗi có hướng dẫn quay lại | Đã có; noindex/status đúng |
| Sitemap HTML (`/sitemap`) | Điều hướng cho người dùng và crawler | **Đã có**; link footer + XML sitemap |

#### B. Trang pháp lý/niềm tin nên bổ sung

| Trang | Khi nào cần | Ghi chú |
|---|---|---|
| Chính sách cookie + consent | Có analytics, quảng cáo, pixel | Nếu dùng GA4/Ads, cần banner lấy consent theo luật áp dụng |
| Chính sách hoàn tiền/đổi trả | Chỉ khi bán trực tiếp | Site affiliate: ghi rõ giao dịch/hoàn trả do sàn/thương hiệu xử lý |
| Chính sách vận chuyển | Chỉ khi bán trực tiếp | Site affiliate: dẫn về chính sách của merchant |
| Phương thức thanh toán | Chỉ khi bán trực tiếp | Site affiliate: không cần, trừ khi có thu phí riêng |
| Tuyên bố trách nhiệm (`/mien-tru-trach-nhiem`) | Luôn nên có | Nêu rõ thông tin chỉ mang tính tham khảo, giá/mã có thể thay đổi |
| Chính sách kiểm duyệt/vi phạm | Có UGC/comment | Nếu chưa có comment, có thể gộp vào điều khoản |
| Tuyên bố khả năng tiếp cận | Nên có | WCAG 2.2 AA; nêu cách báo lỗi |
| Trang tác giả/đội ngũ | Có bài chuyên sâu | Byline + bio + link profile; tránh tác giả AI giả |
| Trang hợp tác/quảng cáo | Khi có nhãn hàng | Media kit, quy trình, liên hệ |

#### C. Thành phần chuyển đổi/UX

- Header/footer rõ ràng, link đến các trang trust ở footer.
- Tìm kiếm, lọc theo sàn/danh mục, breadcrumb.
- Card deal có: ảnh, giá, mức giảm, hạn dùng, nút “Lấy mã”/“Xem deal”, nhãn “có thể nhận hoa hồng”.
- FAQ ngay trên trang danh mục/deal.
- Internal link: deal → danh mục → bài blog → deal liên quan.
- Tốc độ, mobile-first, ảnh có alt, không interstitial che nội dung.
- Analytics + GSC + consent; không log dữ liệu nhạy cảm.

#### D. Lưu ý pháp lý Việt Nam (tham khảo, không phải tư vấn pháp lý)

- **Luật Thương mại điện tử 2025 (122/2025/QH15)** có hiệu lực **01/7/2026**; người làm tiếp thị liên kết có trách nhiệm xác thực danh tính, từ chối link vi phạm, gỡ link theo yêu cầu, cung cấp thông tin khi cơ quan quản lý yêu cầu.
- **Nghị định 248/2026/NĐ-CP** (hiệu lực 01/7/2026) quy định chính sách bảo mật trên nền tảng TMĐT phải có tối thiểu 8 nội dung: mục đích/phạm vi thu thập; phạm vi sử dụng; thời gian lưu trữ; ai được tiếp cận; biện pháp bảo mật; quy trình xem/sửa dữ liệu; quy trình xóa/hủy/hạn chế xử lý; quy trình tiếp nhận khiếu nại.
- Nếu site **có chức năng đặt hàng trực tuyến** (bán hàng trực tiếp), còn phải công bố thông tin chủ sở hữu, mã số doanh nghiệp, địa chỉ, liên hệ, điều kiện giao dịch, vận chuyển, thanh toán, hoàn trả và thực hiện thông báo/đăng ký với Bộ Công Thương. Site hiện tại **chưa bán trực tiếp**, nên không thuộc nhóm này — nhưng nếu sau này thêm checkout thì phải rà lại.
- **Affiliate disclosure**: đặt cạnh link/đầu nội dung, ngôn ngữ dễ hiểu; không chỉ để trong footer. FTC Hoa Kỳ yêu cầu “clear and conspicuous” nếu có độc giả Mỹ; nhiều thị trường khác cũng tương tự.
- Nên nhờ luật sư rà bản cuối trước khi publish các trang pháp lý.

#### E. Thứ tự làm P1 đề xuất

1. About + Contact + Affiliate Disclosure + Editorial Policy (niềm tin, nhanh).
2. Privacy + Terms + Disclaimer + Cookie consent.
3. Landing page sàn/danh mục + internal link.
4. FAQ, author pages, accessibility.
5. Schema/OG, sitemap, đo lại GSC.

#### F. Nguồn tham khảo

- Google Search Central — Creating helpful, reliable, people-first content (cập nhật 2026-10-05): https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- FTC — Endorsement Guides: What People Are Asking: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- U.S. Chamber of Commerce — What to Include on Your Business's Website (2026): https://www.uschamber.com/co/run/technology/what-to-include-on-business-websites
- LuatVietnam — Chính sách bảo mật trên nền tảng TMĐT theo Nghị định 248/2026/NĐ-CP: https://luatvietnam.vn/linh-vuc-khac/chinh-sach-bao-mat-tren-nen-tang-thuong-mai-dien-tu-phai-co-nhung-noi-dung-gi-883-114469-article.html
- LuatVietnam — Trách nhiệm người làm tiếp thị liên kết từ 01/7/2026: https://luatvietnam.vn/linh-vuc-khac/nguoi-lam-tiep-thi-lien-ket-trong-thuong-mai-dien-tu-phai-chiu-trach-nhiem-gi-tu-01-7-2026-883-111257-article.html
- Luật Thương mại điện tử 2025 (122/2025/QH15), hiệu lực 01/7/2026: https://vanban.chinhphu.vn/?pageid=27160&docid=216503

---

### 4.7. Deploy Production P1 + GSC (2026-10-30)

- **Merge:** `seo/p1-landing-pages` → `main` bằng merge commit `947cb6c` (`--no-ff`), push `d025e2f..947cb6c`.
- **Production deployment:** `dpl_6VR9tsPhNs7mTtVmyr7mN8dGJZb2` (`https://shopee-ccuwmunmq-mamoru09s-projects.vercel.app`), trạng thái **Ready**; alias `https://sansale247.io.vn` và `https://www.sansale247.io.vn`.
- **Verify production:**
  - **30/30 route P1 trả 200:** 2 trust + 6 legal + 4 landing sàn + 16 landing danh mục + `/faq` + `/sitemap`.
  - **404:** `/san/foo`, `/danh-muc/foo`, `/chinh-sach/khong-ton-tai`, `/blog/does-not-exist-123`.
  - **301:** `/san`, `/danh-muc`, `/ma-giam-gia` → `/tim-kiem`.
  - **410:** `/gioi-thieu`, `/chinh-sach`.
  - **Canonical:** homepage `https://sansale247.io.vn`; landing `/san/tiktokshop` → `https://sansale247.io.vn/san/tiktokshop`.
  - **OG image:** `/opengraph-image` trả 200 `image/png`, 68.137 bytes (1200×630).
  - **Sitemap XML:** 910 URL, có đủ `/ve-chung-toi`, `/lien-he`, `/san/tiktokshop`, `/danh-muc/voucher`, `/chinh-sach/cookie`; `robots.txt` trỏ `https://sansale247.io.vn/sitemap.xml`.
- **GSC:**
  - Sitemap `/sitemap.xml`: Submit lại → **"Sitemap submitted successfully"** (bảng đang hiển thị 880 discovered, sẽ cập nhật khi Google đọc lại).
  - Request indexing: `/ve-chung-toi`, `/lien-he` → **"Indexing requested"**.
  - Đã kiểm tra sẵn: `/san/shopee`, `/san/tiktokshop`, `/san/lazada`, `/danh-muc/voucher` → **"Page is indexed"** (không cần request).
  - `/chinh-sach/tiet-lo-affiliate`: **"Discovered — currently not indexed"**; live test treo >3 phút nên chưa request được — để sitemap crawl, có thể request lại sau.
- **Rollback:** Vercel Instant Rollback về `dpl_8KVk8m3AZ76UeoC4YaTm6HSGh5SY` (P0) nếu cần.

---

## 5. P2 — tăng trưởng

### 5.1. Blog + internal link — đã code local (2026-10-30)

- Thêm **6 bài blog mới** đúng search intent:
  - `ma-giam-gia-shopee-hom-nay` — cách kiểm tra mã Shopee còn sống trước khi mua.
  - `voucher-freeship-shopee-khong-ap-duoc` — 6 nguyên nhân voucher freeship không áp dụng được.
  - `mua-sach-tiki-gia-tot` — so giá và chồng mã khi mua sách Tiki.
  - `lazada-flash-sale-khung-gio` — khung giờ flash sale Lazada và cách giữ giá.
  - `tiktok-shop-livestream-gia-that` — khi nào giá livestream TikTok Shop giảm thật.
  - `chuan-bi-sale-11-11` — 7 việc nên làm trước ngày sale 11.11.
- Cập nhật **4 bài cũ**: tag và CTA chuyển từ `/tim-kiem` sang landing page `/san/{merchant}` hoặc `/danh-muc/{slug}`.
- Thêm helper `postsForMerchant`, `postsForCategory`, `postsForDeal` trong `lib/blog/posts.ts`.
- Landing sàn/danh mục và deal page có thêm mục **“Đọc thêm trước khi mua”**; deal page link merchant/category trỏ về landing page khi xác định được.
- Luồng internal link đã khép kín: **deal page → blog → landing page**.
- Verify local:
  - `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` — pass.
  - `/blog` + 10 bài blog — 200; 6 bài mới render đúng.
  - 8 landing page (`/san/shopee`, `/san/tiki`, `/san/lazada`, `/san/tiktokshop`, `/danh-muc/freeship`, `/danh-muc/book`, `/danh-muc/beauty`, `/danh-muc/voucher`) — 200, có mục đọc thêm và bài liên quan.
  - 5 deal page thật — 200, có mục đọc thêm và link blog liên quan.
  - Sitemap local 823 URL, trong đó 10 URL blog (+6 bài mới). Số URL local thấp hơn production vì DB local ít deal hơn; production dự kiến 910 → 916.
  - 404/301/410 giữ nguyên: `/san/foo`, `/danh-muc/foo`, `/chinh-sach/khong-ton-tai`, `/blog/does-not-exist-123` → 404; `/san`, `/danh-muc`, `/ma-giam-gia` → 301 `/tim-kiem`; `/gioi-thieu`, `/chinh-sach` → 410.
- Commit code: `822e6b7`.
- Verify Vercel Preview:
  - Deployment `dpl_5eeEmRj6Xu3WNsYWwckLnibNj9YV`, alias `https://shopee-git-seo-p2-growth-mamoru09s-projects.vercel.app`, trạng thái **Ready**.
  - `/blog` + 10 bài blog, 8 landing page, 3 deal page thật → **200**.
  - 404/301/410 giữ nguyên trên preview.
  - Sitemap preview **916 URL**, trong đó **10 URL blog**; canonical bài mới = `https://sansale247.io.vn/blog/...`.
- **Deploy production:**
  - Merge `seo/p2-growth` → `main` bằng merge commit `685ede2`, push `de61020..685ede2`.
  - Production deployment `dpl_DqRHqTLUtViKcYTRTeXui6qdysDs` — **Ready**, alias `https://sansale247.io.vn` + `https://www.sansale247.io.vn`.
  - Verify production: **30/30 route P1** 200; **10/10 bài blog P2**, **8/8 landing**, **3/3 deal page** 200; sitemap **916 URL**; 404/301/410 đúng; canonical 6 bài mới đúng domain; OG image 200 `image/png` 68.137 bytes.
  - Rollback nếu cần: Vercel Instant Rollback về `dpl_6VR9tsPhNs7mTtVmyr7mN8dGJZb2` (P1).
- **GSC:**
  - Submit lại `/sitemap.xml` → **“Sitemap submitted successfully”**; bảng đang hiển thị 910 discovered, sẽ cập nhật khi Google đọc lại.
  - Request indexing 6 URL blog mới: đã thử `ma-giam-gia-shopee-hom-nay`, nhưng live test treo >3 phút nên phải Cancel; **chưa có indexing request nào được xác nhận**. Sẽ thử lại sau; các URL đã có trong sitemap + internal link.

### 5.2. GSC monitoring

- Đã submit lại `/sitemap.xml` trên production.
- Request indexing 6 URL blog mới: live test đang treo, sẽ thử lại sau.
- Theo dõi định kỳ GSC: Coverage, Enhancements, Core Web Vitals.

### 5.3. Backlink/PR + đo thứ hạng

- Chưa thực hiện; cần kênh/tài khoản backlink và cách đo thứ hạng theo từ khóa mục tiêu.

### 5.4. Việc cần anh cung cấp nếu muốn làm tiếp

- GA4 Measurement ID + cookie consent (nếu muốn đo analytics).
- Đánh giá pháp lý 6 trang policy.
- Danh sách kênh backlink/PR ưu tiên.

### 5.5. UI mobile footer + Back to top (2026-10-30)

- Footer mobile: nhóm link thông tin website chuyển từ `flex-wrap` sang grid 2 cột, khoảng cách hàng/cột đều; desktop vẫn giữ flex-wrap.
- Thêm `lib/components/BackToTop.tsx`: nút tròn cố định góc phải dưới, chỉ hiện sau khi cuộn >600px; cuộn mượt về đầu trang, tôn trọng `prefers-reduced-motion`; có `aria-label` + `title` "Về đầu trang".
- Thêm padding bottom cho footer mobile để nút không che copyright khi ở cuối trang.
- Verify local: `tsc` PASS, `lint` PASS, `build` PASS (57 static pages); Playwright 390×844 và 360×800 không overflow ngang (`scrollWidth` 350/360); click nút → `scrollY = 0`; desktop footer vẫn `display: flex`.
- Preview: branch `ui/mobile-footer-back-to-top` đã push; Vercel preview `dpl_HsEohS7kD5F5V2vEWZo6zvpYHRhA` Ready, alias `https://shopee-git-ui-mobile-footer-back-to-top-mamoru09s-projects.vercel.app`; HTML preview có markup nút Back to top + class footer mới.
- **Đã deploy production:** merge `ui/mobile-footer-back-to-top` → `main` bằng merge commit `10be144`, push `6aca3a5..10be144`; Vercel production `dpl_EjYakkT9occweZZYkodhGQuYRCVZ` Ready, alias `https://sansale247.io.vn` + `https://www.sansale247.io.vn`.
- Verify production: `/`, `/blog`, `/san/shopee`, `/danh-muc/voucher` → 200; HTML có markup Back to top + class footer mới; Playwright 390×844 không overflow ngang, cuộn xuống đáy rồi click nút → `scrollY = 0`, `aria-hidden="true"`.

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
| 0 | `2c6f29b` | `report.md` | Baseline + kế hoạch P0 + checklist P1 + quyết định `.net`/GSC | `git show --stat 2c6f29b` | Hoàn tất |
| 1 | `f51c778` | `app/blog/[slug]/page.tsx`, `app/ma/[id]/page.tsx`, `proxy.ts` | Real 404 cho blog/deal; 301/410 legacy URLs | `tsc`, `lint`, `build`, curl matrix | Hoàn tất (local) |
| 2 | `585791e` | `proxy.ts`, `app/ma/[id]/page.tsx`, `lib/coupons/dealExists.ts` | Proxy chặn deal/blog không tồn tại → 404 thật; `connection()` bỏ Date.now bailout; safe decode path malformed | `tsc`, `lint`, `build`, `pnpm start` + curl matrix, log check | Hoàn tất (local) |
| 3 | — | `report.md` | Ghi nhận kết quả verify Vercel Preview | Preview deployment `dpl_Gn4h2awtkEBjFjrCZ3jtFpSv4kfr` + matrix 404/301/410 | Hoàn tất (preview) |
| 4 | `6016324` | merge `seo/p0-fixes` → `main` | Deploy production P0 | Production `dpl_8KVk8m3AZ76UeoC4YaTm6HSGh5SY` + curl matrix 404/301/410, không còn log `Date.now` | Hoàn tất (production) |
| 5 | - | `report.md` | Ghi nhận deploy production + GSC sitemap/URL Inspection | GSC: sitemap submitted, 4 URL request indexing, `/gioi-thieu` live test 404 | Hoàn tất |
| 6 | `89c75fb` | `lib/legal/content.ts`, `lib/components/LegalPage.tsx`, `app/ve-chung-toi/page.tsx`, `app/lien-he/page.tsx`, `app/chinh-sach/[slug]/page.tsx`, `proxy.ts`, `app/layout.tsx`, `app/sitemap.ts`, `lib/site.ts` | Thêm 8 trust/legal pages; footer + sitemap; 404 thật cho slug chính sách không tồn tại | `tsc`, `lint`, `build`, `pnpm start` + curl 8 URL 200, slug lạ 404, `/chinh-sach` + `/gioi-thieu` 410, footer/sitemap check, screenshot desktop | Hoàn tất (local, chờ preview) |
| 7 | `c00d6fe` | `report.md` | Ghi nhận verify P1 + checklist trust pages + push preview | `git show --stat c00d6fe`; Vercel status success | Hoàn tất |
| 8 | `2f6c127` | `report.md` | Ghi nhận verify preview: 8/8 trang 200, 404/410 đúng, canonical + sitemap đúng domain production | Chrome fetch nội bộ trên preview + Vercel status success | Hoàn tất (preview) |
| 9 | `ba23ef6` | `app/san/[merchant]/page.tsx`, `app/danh-muc/[slug]/page.tsx`, `lib/landing/content.ts`, `lib/components/LandingPage.tsx`, `lib/categories.ts`, `proxy.ts`, `app/layout.tsx`, `app/page.tsx`, `app/sitemap.ts`, `report.md` | Thêm 4 landing sàn + 16 landing danh mục; đổi internal link header/footer/home; thêm sitemap; 404 thật cho slug lạ | `tsc`, `lint`, `build`, curl 4+16 trang 200, 301/404/410 matrix, canonical/JSON-LD, sitemap, screenshot desktop | Hoàn tất (local) |
| 10 | `76f2d01` | `report.md` | Ghi nhận verify landing pages + hash commit | `git show --stat 76f2d01` | Hoàn tất |
| 11 | `2d991ec` | `report.md` | Ghi nhận verify preview landing pages: 4 sàn + 16 danh mục 200, slug lạ 404, legacy 301/410, canonical/sitemap đúng | Chrome fetch nội bộ trên preview + Vercel status Ready | Hoàn tất (preview) |
| 12 | `b0e3d45` | `lib/faq/content.ts`, `app/faq/page.tsx`, `app/sitemap/page.tsx`, `lib/seo.ts`, `app/opengraph-image.tsx`, `app/layout.tsx`, `lib/legal/content.ts`, `app/sitemap.ts`, `app/ve-chung-toi/page.tsx`, `app/lien-he/page.tsx`, `app/chinh-sach/[slug]/page.tsx`, `app/san/[merchant]/page.tsx`, `app/danh-muc/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/ma/[id]/page.tsx`, `report.md` | Thêm FAQ + HTML sitemap; JSON-LD Organization/WebSite; OG image mặc định + fallback; footer/sitemap link | `tsc`, `lint`, `build`, 30 route 200, FAQ 13 câu JSON-LD, HTML sitemap 60 deal, XML 817 URL, OG 1200×630, screenshot desktop | Hoàn tất (local, chờ preview) |
| 13 | `12092ea` | `report.md` | Ghi nhận verify FAQ/HTML sitemap/schema/OG + hash commit | `git show --stat b0e3d45` | Hoàn tất |
| 14 | - | `report.md` | Ghi nhận preview FAQ/HTML sitemap/schema/OG: 30 route 200, 404/410 đúng, FAQ 13 câu, sitemap 910 URL, OG 1200×630 | Chrome fetch nội bộ trên preview + Vercel status Ready | Hoàn tất (preview) |
| 15 | - | `report.md` | Ghi nhận email `contact@sansale247.io.vn` đã hoạt động: Zoho Mail free, MX/SPF/DKIM/DMARC tại PA, test Gmail 2 chiều | `Resolve-DnsName` ns1.pavietnam.vn; Gmail header SPF/DKIM/DMARC = PASS; Zoho báo xác thực tất cả bản ghi | Hoàn tất |
| 16 | `947cb6c` | merge `seo/p1-landing-pages` → `main`; `report.md` | Deploy production P1 + GSC | Production `dpl_6VR9tsPhNs7mTtVmyr7mN8dGJZb2`; 30/30 route 200; 404/301/410 đúng; canonical/OG/sitemap 910 URL; GSC sitemap submitted + 2 URL request indexing | Hoàn tất (production) |
| 17 | `822e6b7` | `lib/blog/posts.ts`, `lib/components/LandingPage.tsx`, `app/blog/page.tsx`, `app/san/[merchant]/page.tsx`, `app/danh-muc/[slug]/page.tsx`, `app/ma/[id]/page.tsx` | Thêm 6 bài blog P2; internal link deal → blog → landing | `tsc`, `lint`, `build`; 10 blog + 8 landing + 5 deal page 200; sitemap local 823 URL (+6 blog); 404/301/410 giữ nguyên | Hoàn tất (local, chờ duyệt deploy) |
| 18 | - | `report.md` | Ghi nhận verify preview P2 | Preview `dpl_5eeEmRj6Xu3WNsYWwckLnibNj9YV`; 10 blog + 8 landing + 3 deal page 200; sitemap 916 URL; 404/301/410 đúng | Hoàn tất (preview, chờ duyệt production) |
| 19 | `685ede2` | merge `seo/p2-growth` → `main`; `report.md` | Deploy production P2 + GSC | Production `dpl_DqRHqTLUtViKcYTRTeXui6qdysDs`; 30/30 P1 + 10 blog + 8 landing + 3 deal page 200; sitemap 916 URL; 404/301/410 đúng; GSC sitemap submitted | Hoàn tất (production) |
| 20 | `8a03429` + `10be144` | `app/layout.tsx`, `lib/components/BackToTop.tsx` | Footer mobile grid 2 cột + nút Back to top; giữ desktop flex | `tsc`, `lint`, `build`; Playwright 390×844 + 360×800; không overflow ngang; click → `scrollY=0`; desktop flex; preview `dpl_HsEohS7kD5F5V2vEWZo6zvpYHRhA` Ready; production `dpl_EjYakkT9occweZZYkodhGQuYRCVZ` Ready, 4 route 200, nút hoạt động trên domain thật | Hoàn tất (production) |
| 21 | `c5c0ac9` | `app/page.tsx`, `report.md` | Home brand strip nổi bật trên mobile: grid 2×2 card thương hiệu, logo 26px + scale khi hover, hover lift/border/shadow màu brand, tap target min-h-12; desktop giữ nguyên hàng pills | `tsc`, `lint`, `build`; anh duyệt mobile view trực tiếp trên dev server `localhost:3210`; preview `dpl_DjWdW9eUSturL2NTdNLA6E45D23f` Ready (Vercel Authentication bảo vệ); production `dpl_E38HdVJ7PBu8MMdqv7DPkTx3ch9B` Ready, HTML domain thật chứa brand grid (`max-w-sm grid-cols-2` ×3, `min-h-12` ×12), `sansale247.io.vn` 200 | Hoàn tất (production) |
| 22 | — | Vercel project `shopee-deals` (không thuộc repo) | Xóa project rác `shopee-deals` (không connect Git, domain `shopee-deals-mu.vercel.app`); chỉ giữ project `shopee` ↔ `sansale247.io.vn` | Dashboard team chỉ còn `shopee`; domain rác không còn resolve | Hoàn tất |
| 23 | `4a7f605` | `app/layout.tsx`, `report.md` | Cắt khoảng trắng dư cuối footer mobile: `pb-24` (96px) → `pb-10` (40px); chừa lane phải `pr-16` cho chữ copyright để nút Back to top không đè lên | `tsc`, `lint`, `build`; Chrome thật trên `localhost:3210`: footer padding-bottom = 40px, không overflow ngang, footer desktop giữ nguyên; preview `dpl_8bwjVxS4inoVoMMHq5rKW1oGg3fh` Ready; production `dpl_GGWRszaioWpUhrWhk7JtkvWUSW1B` Ready — HTML domain thật: `px-4 pt-10 pb-10` ×3, `pt-10 pb-24` ×0, `pr-16` copyright ×3, `/blog` 200 | Hoàn tất (production) |
| 24 | `a934be2` | `app/page.tsx`, `report.md` | Thêm đường kẻ phân cách nhạt (`border-b border-line/80`, `pb-3`, `mb-4`) dưới hàng tiêu đề section trên home (Deal Shopee/Tiki/Lazada/TikTok Shop, Deal chớp nhoáng, danh mục, blog) để tách header khỏi lưới card và dễ nhận nút "Xem tất cả" | `tsc`, `lint`, `build`; Chrome thật `localhost:3210`: computed `border-bottom: 1px solid` line/80, `padding-bottom: 12px`, divider hiển thị đúng dưới "Deal Shopee"; preview `dpl_AvbFo6JWxzwN8R7BKGS2vNs8KUk8` Ready (`border-line/80` ×36); production `dpl_2Ge8rwguZT1FdqMNvRkeekRM2Pvf` Ready — `sansale247.io.vn` 200, `border-line/80` ×36, divider class ×24 | Hoàn tất (production) |
| 25 | `fe2de59` | `public/favicon*`, `public/apple-touch-icon.png`, `public/icon-*.png`, `app/layout.tsx`, `report.md` | Bổ sung bộ favicon đầy đủ từ artwork hiện tại: `favicon.ico` đa kích thước (16/32/48/96/144/192, PNG entries), PNG 16/32/48/96/144/192/512, apple-touch 180; khai báo metadata `icons` + dùng `icon-512x512.png` cho JSON-LD Logo. Khắc phục Google còn hiển thị favicon phiên bản web cũ do site thiếu `/favicon.ico` và chỉ có SVG | `tsc`, `lint`, `build`; preview `dpl_Chc6cUkC9xVdPczSgYysSKubdJKj` Ready — HTML có đủ icon links, `/favicon.ico` 15.182 bytes magic ICO, PNG 16/32/180/192/512 đúng `89-50-4E-47`; production `dpl_HmnAJEJ2tPfFY91sjX327XF98wc2` Ready — `sansale247.io.vn` 200, đủ icon links, `/favicon.ico` 15.182 bytes, PNG đúng định dạng | Hoàn tất (production) |
| 26 | — | Neon project `sansale-db` (không thuộc repo) | Dọn 3 branch preview cũ (`ui/footer-bottom-trim`, `ui/home-brand-strip`, `ui/mobile-footer-back-to-top`) do Neon free giới hạn 10 branches khiến Vercel không provision được DB branch cho preview mới (`One or more integration resources failed to provision`) | Neon console: 10 → 7 branches; redeploy `dpl_Chc6cUkC9xVdPczSgYysSKubdJKj` Ready | Hoàn tất |
| 27 | `cd3a719` | `lib/analytics.ts`, `lib/components/{Analytics,ConsentBanner,SearchAnalytics,DealViewTracker,TrackedAffiliateLink,CopyButton,CouponCard}.tsx`, `app/layout.tsx`, `app/tim-kiem/page.tsx`, `app/ma/[id]/page.tsx`, `lib/legal/content.ts` | G0.1+G0.2: consent banner lưu lựa chọn `sansale-consent`; GA4 chỉ load khi có `NEXT_PUBLIC_GA_ID` + consent; event `affiliate_click` (copy + link deal), `search_submit`, `filter_apply`, `deal_view`, `page_view`; cập nhật chính sách cookie | `tsc`, `lint`, `build` PASS (57 pages); Chrome thật: trước consent không có `gtag`/script GA, sau consent `gtag=function`, dataLayer nhận `search_submit`/`filter_apply`; `deal_view` bắn trên trang deal; đã thử GA test ID `G-TEST12345` local; preview `dpl_9CkRkko8yNEt7wSMdx5zt8nrLuKx` Ready — HTML 200, không load GA khi chưa consent; production `dpl_9GZKKDa4khRX9wftXiDsQ3itczAt` Ready — domain 200, không có script GA khi chưa consent (consent banner render client-side); GA4 Measurement ID `G-JL2DPMNPSE` đã thêm env Production+Preview; redeploy `dpl_En97sw3MgccgVf3Ly5HWYBrckKqp` Ready — sau consent: script `gtag/js?id=G-JL2DPMNPSE`, `gtag=function`, dataLayer=4, network `google-analytics.com/g/collect` có `page_view` + `tid=G-JL2DPMNPSE` | Hoàn tất (production) |
| 28 | `346efc4` | `app/su-kien/[slug]/page.tsx`, `lib/events/content.ts`, `lib/components/EventCountdown.tsx`, `app/sitemap.ts`, `app/sitemap/page.tsx`, `lib/campaigns.ts` | G1.1: landing `/su-kien/11-11` với hero, countdown, top deal 4 sàn, checklist 3 nhóm, 5 guide, 8 FAQ, JSON-LD Event/FAQ/ItemList/Breadcrumb, internal link + sitemap; nội dung 1.925 từ | `tsc`, `lint`, `build` PASS (59 pages, route static); browser 816px: 1.925 từ, 32 deal link, 8 FAQ, JSON-LD đủ, console sạch; CDP 390×844: `overflow=0`, không tràn ngang, consent banner + hero hiển thị đúng; desktop 1440 screenshot chuẩn; preview `dpl_9CkRkko8yNEt7wSMdx5zt8nrLuKx` Ready — 417.569 chars, canonical + JSON-LD Event/FAQ, sitemap có URL; production `dpl_9GZKKDa4khRX9wftXiDsQ3itczAt` Ready — `/su-kien/11-11` 200, 401.515 chars, canonical 1, H1 1, FAQ 3, Event 1, 144 deal link, sitemap 200 có URL, home 200 | Hoàn tất (production) |

> Mỗi commit code tiếp theo phải thêm một dòng vào bảng này **trước khi** commit, ghi rõ file, mục đích, cách verify và kết quả.

---

## 8. Câu hỏi cần anh quyết trước khi code P0

**Đã chốt:**
- `sansale247.net` là web copy, **không phải của anh** → không xử lý/gộp, chỉ tập trung `.io.vn`.
- Google Search Console cho `sansale247.io.vn` **đã verify** → dùng GSC để lấy URL lỗi và submit sitemap sau P0.
- P1 sẽ **viết mới** About + các trang chính sách tại URL mới phù hợp với website hiện tại; không khôi phục URL cũ.
- 6 URL nội dung/tool cũ (`/gioi-thieu`, `/chinh-sach`, `/quan-tam`, `/thuong-hieu`, `/theo-doi-gia`, `/tinh-tra-gop`) trả **410**.
- Các nhóm có trang tương đương: `/san/*`, `/danh-muc/*`, `/ma-giam-gia*` — trả **301**.
- Anh đã trả lời **"3"** cho câu hỏi duyệt P0 → em hiểu là **đồng ý bắt đầu P0**.

**Còn lại (P1, chưa cần chốt ngay):**
- Làm đủ bộ trust pages hay chỉ trước About/Contact/Affiliate Disclosure/Privacy/Terms.

---

## 9. Kế hoạch tăng trưởng traffic 90 ngày (đã duyệt 2026-10-30 — đang triển khai)

> Trạng thái: **Chưa triển khai**. Toàn bộ task trong mục này đang ở trạng thái `Chờ duyệt`.
> Khi anh duyệt, mỗi task hoàn thành sẽ được cập nhật vào bảng tiến độ §9.7 và thêm dòng tương ứng vào Change log §7.

### 9.1. Baseline & mục tiêu

**Số liệu GSC 28 ngày gần nhất (2026-09-30 → 2026-10-28):**

| Chỉ số | Giá trị |
|---|---|
| Organic clicks | 4 |
| Impressions | 417 |
| CTR | 1% |
| Average position | 45.5 |
| Query có impression | 77 |
| URL được index | 38 |
| URL chưa index | 18 (9 duplicate without user-selected canonical, 8 alternate page with proper canonical, 1 blocked by robots.txt) |
| URL trong sitemap | 916 (873 deal, 10 blog, 4 sàn, 16 danh mục) |
| Analytics | Chưa có GA4 / pixel / event tracking; chỉ có GSC |

**Top query đáng chú ý:** `tiki promo codes` (43 impressions), `tiki promo code` (27), `mã giảm giá lazada` (10), `mã giảm giá tiki` (8), `mã shopee hôm nay` (8).

**Mục tiêu 90 ngày (có điều kiện, không cam kết tuyệt đối):**

| Chỉ số | Baseline | 90 ngày | 180 ngày |
|---|---|---|---|
| URL chất lượng được index | 38 | 80–120 | 200–300 |
| Organic clicks/28 ngày | 4 | 300–800 | 1.500–4.000 |
| Referring domains | ~0 | 10–15 | 30–50 |
| Email/Zalo subscribers | 0 | 500–1.000 | 3.000–5.000 |
| Affiliate CTR (outbound/session) | Chưa đo | 8–12% | 10–15% |
| Blog posts | 10 | 30 | 40+ |
| Merchant hubs đủ sâu | 0 (4 trang mỏng) | 4 | 4 |
| Category hubs đủ sâu | 0 | 8 | 12–16 |

### 9.2. Nguyên tắc triển khai

1. **Đo lường trước khi tối ưu:** không chạy ads/viết thêm nội dung đại trà khi chưa có GA4 + event affiliate click.
2. **Chất lượng hơn số lượng:** ưu tiên trang có intent mua và nội dung unique; không cố index toàn bộ 873 deal mỏng.
3. **Mỗi thay đổi phải có bằng chứng:** `tsc` + `lint` + `build`, kiểm tra local/preview/production, ghi report.
4. **Không mua backlink spam, không copy nội dung, không che giấu affiliate link.**
5. **Deploy production phải được anh duyệt**; preview tự động khi push branch.
6. **Cập nhật report đến đâu ghi đến đó:** mỗi task/milestone cập nhật §9.7; mỗi commit code thêm dòng §7.

### 9.3. Giai đoạn G0 — Đo lường & sửa chất lượng index (Tuần 1–2)

| ID | Việc | Output / file dự kiến | Điều kiện nghiệm thu | Ước lượng |
|---|---|---|---|---|
| G0.1 | Cài GA4 + cookie consent | `app/layout.tsx`, `lib/components/Analytics.tsx`, `lib/components/ConsentBanner.tsx`, `lib/legal/content.ts`, `.env.local` (`NEXT_PUBLIC_GA_ID`) | GA4 Realtime nhận `page_view`; từ chối consent → không set cookie `_ga`; đồng ý → có cookie + event; trang chính sách cookie cập nhật | 1–2 ngày |
| G0.2 | Event tracking hành vi chính | `lib/analytics.ts`, deal card/outbound link, `/go/[id]`, search/filter components | GA4 DebugView thấy `affiliate_click` (merchant, deal_id, placement), `search_submit`, `filter_apply`, `deal_view`, `cta_click`; không lỗi console; `/go` vẫn redirect đúng | 1–2 ngày |
| G0.3 | Chuẩn hóa UTM | `report.md` (bảng quy ước), link builder nội bộ | 3 link mẫu (Facebook/TikTok/Email) hiển thị đúng source/medium/campaign trong GA4 | 0,5 ngày |
| G0.4 | Audit 18 URL chưa index + 38 URL đã index | Danh sách URL + nguyên nhân trong §9.8 | Phân loại đủ 4 nhóm lỗi; xác định URL nào sửa canonical, URL nào bỏ khỏi sitemap, URL nào cần content | 1–2 ngày |
| G0.5 | Sửa canonical + sitemap + quality gate | `app/sitemap.ts`, canonical metadata các route, `proxy.ts` (nếu cần), logic deal hết hạn | Sitemap chỉ chứa URL 200/indexable; deal hết hạn → 410 hoặc `noindex`; không còn nhóm `duplicate without user-selected canonical` sau recrawl | 2–3 ngày |
| G0.6 | Xử lý 1 URL bị robots.txt chặn | `app/robots.ts` hoặc xác nhận chủ đích | URL quan trọng được mở; URL không quan trọng ghi rõ lý do chặn | 0,5 ngày |
| G0.7 | Audit Core Web Vitals mobile | Lighthouse/PageSpeed cho home, 1 merchant hub, 1 deal page | Lab mobile: LCP < 2,5s, CLS < 0,1; fix các ảnh thiếu width/height, font, layout shift | 1–2 ngày |
| G0.8 | Submit lại sitemap + request indexing | GSC | Sitemap submitted; request indexing 10–20 URL ưu tiên (home, 4 sàn, 8 category, 5 blog, 2 deal) | 0,5 ngày |

### 9.4. Giai đoạn G1 — Nội dung & landing pages (Tuần 1–6)

**Fast-track 11.11 (ưu tiên cao nhất vì chỉ còn ~12 ngày):**

| ID | Việc | Output / file dự kiến | Điều kiện nghiệm thu | Ước lượng |
|---|---|---|---|---|
| G1.1 | Landing 11.11 | Route mới `/su-kien/11-11` (hoặc `/blog/11-11` nếu anh muốn giữ trong blog), `app/su-kien/[slug]/page.tsx`, `lib/events/content.ts` | 1.500+ từ unique; countdown; top deal theo sàn; checklist săn sale; FAQ schema; internal link; mobile CWV đạt; publish trước 03/11 | 3–4 ngày |
| G1.2 | Nâng cấp 4 merchant hub | `app/san/[merchant]/page.tsx`, `lib/landing/content.ts` | Mỗi trang 1.500–2.500 từ: voucher hôm nay, cách dùng, FAQ, top deal, link category/blog; target cả query tiếng Anh (`tiki promo codes`, `lazada promo codes`); schema `ItemList` + `FAQPage` + `BreadcrumbList` | 4–5 ngày |
| G1.3 | 8 category hub | `app/danh-muc/[slug]/page.tsx`, `lib/landing/content.ts` | 8 danh mục có ≥10 deal; 800–1.200 từ/trang; danh mục <10 deal → `noindex` hoặc không đưa vào sitemap | 4–5 ngày |
| G1.4 | 10 bài blog đầu tiên | `lib/blog/posts.ts`, `app/blog/[slug]/page.tsx` | 1.200–2.000 từ/bài; có bảng/FAQ/ảnh; tác giả + ngày cập nhật; CTA + internal link; 10 bài trong 30 ngày | 10–12 ngày |
| G1.5 | Content brief template + 10 brief | `report.md` hoặc `docs/content-briefs.md` | Mỗi brief có keyword chính/phụ, intent, outline, internal link, schema, CTA, nguồn, người duyệt | 1–2 ngày |
| G1.6 | Internal linking + HTML sitemap | Deal card, merchant/category page, `app/sitemap/page.tsx` | Mỗi deal link tới sàn + danh mục + 2 bài blog liên quan; mỗi bài blog link tới 2 merchant hub; HTML sitemap cập nhật | 1–2 ngày |
| G1.7 | E-E-A-T | `app/ve-chung-toi`, `app/tac-gia/[slug]` (nếu cần), `lib/legal/content.ts` | Có tác giả/ban biên tập, quy trình kiểm duyệt, affiliate disclosure, ngày cập nhật trên bài | 1–2 ngày |

**Danh sách 10 bài blog đề xuất (ưu tiên theo intent):**

1. Cách dùng mã giảm giá Shopee chi tiết: stack voucher, freeship, điều kiện.
2. Mã giảm giá Tiki tháng 11/2026: voucher mới + cách áp dụng.
3. Mã giảm giá Lazada: voucher freeship và mã giảm sâu.
4. TikTok Shop voucher: cách lấy mã và dùng khi thanh toán.
5. Freeship 0đ: điều kiện, cách săn và lỗi thường gặp.
6. 11.11 săn sale: checklist trước, trong và sau ngày sale.
7. 12.12: kế hoạch săn deal theo ngân sách.
8. So sánh Shopee – Tiki – Lazada: sàn nào rẻ hơn cho từng nhóm hàng.
9. Cách kiểm tra giá tốt, tránh “tăng giá ảo” trước sale.
10. Tổng hợp deal 1k/9k/99k: mua gì đáng, tránh gì.

### 9.5. Giai đoạn G2 — Phân phối, authority & giữ chân (Tuần 3–12)

| ID | Việc | Output / kênh | Điều kiện nghiệm thu | Ước lượng |
|---|---|---|---|---|
| G2.1 | Facebook Page + group | Fanpage “Săn sale & voucher”, group cộng đồng | 1–2 post/ngày; template deal card; link có UTM; tuân thủ quy định affiliate | 3–5 ngày setup |
| G2.2 | TikTok / Reels / Shorts | Kênh TikTok + cross-post | 3–5 video/tuần (15–30s); format deal trong 30 giây; link bio → site | 3–5 ngày setup |
| G2.3 | Zalo OA | Official Account | Verify OA; broadcast 2–3 lần/tuần; menu nhận voucher; có consent | 3–5 ngày |
| G2.4 | Email marketing | Brevo/Mailchimp/Resend + form capture | Double opt-in; welcome sequence 3 email; 2–3 email/tuần; đo open/click; tuân thủ privacy | 3–4 ngày |
| G2.5 | Backlink/PR | Guest post, blog tài chính/lifestyle, báo, KOL micro | 10–15 link chất lượng trong 90 ngày; không mua link spam; có nội dung thật | 10–15 ngày |
| G2.6 | Paid test | Facebook/TikTok retargeting + Google brand | Ngân sách test 3–5 triệu/tháng; CPA không vượt hoa hồng dự kiến; có UTM + dashboard | 2–3 ngày setup |
| G2.7 | Seasonal 12.12 / Black Friday / Tết | Landing pages + campaign | 12.12 và Black Friday publish trước 3–4 tuần; refresh hàng ngày trong cao điểm; Tết publish trước 4 tuần | 5–7 ngày |
| G2.8 | CRO | Home, merchant hub, deal page | Sticky CTA; CTA above-fold; A/B test 2–3 biến thể; trust signals (số deal, cập nhật, disclosure) | 3–5 ngày |
| G2.9 | Community/UGC | Group + social | Cho phép user gửi deal; kiểm duyệt; ưu đãi mã độc quyền | Ongoing |

### 9.6. Lịch 12 tuần (mốc bàn giao)

| Tuần | Thời gian | Việc chính | Mốc |
|---|---|---|---|
| 1 | 30/10–05/11 | G0.1–G0.3; G1.1 landing 11.11; bắt đầu G1.2 | GA4 + consent live local; 11.11 landing publish trước 03/11 |
| 2 | 06/11–12/11 | G1.1 refresh daily; G0.4–G0.8; G1.2 | 11.11 campaign live; sitemap/index fixes submitted |
| 3 | 13/11–19/11 | G1.2 hoàn tất; G1.3 bắt đầu; 4 bài blog; G2.1–G2.4 setup | 4 merchant hub + 4 blog mới; social/email sẵn sàng |
| 4 | 20/11–26/11 | G1.3; 3 bài blog; Black Friday landing; G2.5 bắt đầu | 8 category hub; Black Friday live trước 27/11 |
| 5 | 27/11–03/12 | Black Friday refresh; 12.12 landing; 3 bài blog | 12.12 publish trước 03/12 |
| 6 | 04/12–10/12 | 12.12 refresh; G2.6 paid test; backlink 5 | Paid test có dữ liệu 7 ngày |
| 7 | 11/12–17/12 | 12.12 campaign; email/Zalo; CRO | 12.12 traffic peak; báo cáo tuần |
| 8 | 18/12–24/12 | Giáng sinh/Năm mới; 3 bài blog; backlink 5 | 30 blog posts; 10 backlink |
| 9 | 25/12–31/12 | Review 90 ngày; Tết landing; tối ưu kênh có ROI | Báo cáo 90 ngày |
| 10 | 01/01–07/01 | Tết campaign; scale content | Tết landing live trước Tết 4 tuần |
| 11 | 08/01–14/01 | Tết refresh; email/Zalo; CRO | Báo cáo tuần |
| 12 | 15/01–31/01 | Tổng kết; kế hoạch 180 ngày | Báo cáo tổng kết + next plan |

### 9.7. Bảng tiến độ triển khai (cập nhật sau mỗi task)

| ID | Task | Trạng thái | Ngày | Commit / Deployment | Bằng chứng |
|---|---|---|---|---|---|
| G0.1 | GA4 + consent | Hoàn tất (production) | `cd3a719` | `dpl_En97sw3MgccgVf3Ly5HWYBrckKqp` | GA4 `G-JL2DPMNPSE`; sau consent script GA load, `gtag=function`, dataLayer=4, collect `page_view` đúng tid |
| G0.2 | Event tracking | Hoàn tất (production) | `cd3a719` | `dpl_9GZKKDa4khRX9wftXiDsQ3itczAt` | Production 200; sự kiện verified local |
| G0.3 | UTM convention | Chờ duyệt | — | — | — |
| G0.4 | Audit index | Chờ duyệt | — | — | — |
| G0.5 | Canonical/sitemap/quality gate | Chờ duyệt | — | — | — |
| G0.6 | Robots URL | Chờ duyệt | — | — | — |
| G0.7 | Core Web Vitals | Chờ duyệt | — | — | — |
| G0.8 | Submit/index | Chờ duyệt | — | — | — |
| G1.1 | Landing 11.11 | Hoàn tất (production) | `346efc4` | `dpl_9GZKKDa4khRX9wftXiDsQ3itczAt` | Production 200; 401.515 chars; canonical/JSON-LD/sitemap OK |
| G1.2 | 4 merchant hub | Chờ duyệt | — | — | — |
| G1.3 | 8 category hub | Chờ duyệt | — | — | — |
| G1.4 | 10 bài blog | Chờ duyệt | — | — | — |
| G1.5 | Content briefs | Chờ duyệt | — | — | — |
| G1.6 | Internal linking | Chờ duyệt | — | — | — |
| G1.7 | E-E-A-T | Chờ duyệt | — | — | — |
| G2.1 | Facebook | Chờ duyệt | — | — | — |
| G2.2 | TikTok/Reels | Chờ duyệt | — | — | — |
| G2.3 | Zalo OA | Chờ duyệt | — | — | — |
| G2.4 | Email | Chờ duyệt | — | — | — |
| G2.5 | Backlink/PR | Chờ duyệt | — | — | — |
| G2.6 | Paid test | Chờ duyệt | — | — | — |
| G2.7 | Seasonal | Chờ duyệt | — | — | — |
| G2.8 | CRO | Chờ duyệt | — | — | — |
| G2.9 | Community/UGC | Chờ duyệt | — | — | — |

**Quy ước trạng thái:** `Chờ duyệt` → `Đang làm` → `Hoàn tất (local)` → `Hoàn tất (preview)` → `Hoàn tất (production)`.
**Quy ước báo cáo:** mỗi lần hoàn thành task, cập nhật dòng §9.7 + thêm dòng §7 với commit hash, file, verify, trạng thái. Không gộp nhiều task vào một dòng nếu verify khác nhau.

### 9.8. Việc cần anh chốt trước khi triển khai

1. **Duyệt kế hoạch này** (hoặc yêu cầu chỉnh sửa phạm vi/thứ tự).
2. **GA4 Measurement ID** (`G-…`) hoặc cho phép em hướng dẫn tạo property; cần email/quyền admin.
3. **Email provider:** em đề xuất **Brevo** (free tier đủ giai đoạn đầu, có automation + double opt-in) — anh đồng ý hay dùng Mailchimp/Resend?
4. **Ngân sách paid test:** 3–5 triệu/tháng trong 2 tháng đầu — có duyệt không?
5. **Quyền truy cập** Facebook Page/group, Zalo OA, TikTok (email/password hoặc thêm em làm admin).
6. **Người duyệt nội dung + tone giọng:** anh duyệt trực tiếp hay giao ai?
7. **Route landing 11.11:** dùng `/su-kien/11-11` (sạch, mở rộng cho 12.12/Tết) hay `/blog/11-11` (giữ trong blog)?
8. **Ảnh sản phẩm:** dùng ảnh từ feed AccessTrade/merchant — anh xác nhận được phép dùng theo điều khoản affiliate không?
9. **Thời gian phản hồi duyệt content:** cần chốt để kịp 11.11 (publish trước 03/11).

### 9.9. Rủi ro & phụ thuộc

- **Google index chậm:** thay đổi canonical/sitemap cần 2–8 tuần để phản ánh; không thể cam kết traffic ngay.
- **11.11 sát ngày:** nếu chưa duyệt trước 01/11, landing 11.11 sẽ khó kịp; có thể chuyển trọng tâm sang 12.12.
- **Thiếu quyền truy cập** Facebook/Zalo/TikTok sẽ chặn G2.
- **GA4/consent** cần cập nhật chính sách cookie/privacy trước khi bật — không được bật tracking trước consent.
- **Paid test** cần ngân sách và theo dõi CPA; nếu hoa hồng thấp hơn CPA, dừng và chuyển sang organic.
- **Nội dung affiliate** phải có disclosure; không hứa hẹn giá/khuyến mãi không kiểm chứng.
- **Neon free 10 branches** có thể chặn preview mới; trước mỗi story branch cần kiểm tra số branch và dọn preview cũ nếu cần.
