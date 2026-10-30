# Báo cáo SEO — sansale247.io.vn

- **Ngày lập:** 2026-10-30
- **Baseline commit:** `66b05f24a31c6667fb95aeeea59cd8a40cb0475f`
- **Nhánh làm việc:** `seo/p0-fixes`
- **Backup Git:**
  - Branch: `backup/pre-seo-20261030` (trỏ đúng baseline)
  - Annotated tag: `pre-seo-20261030` (trỏ đúng baseline)
- **Trạng thái:** `P0 ĐÃ VERIFY PREVIEW — CHỜ DUYỆT PRODUCTION`
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

---

## 4. P1 — sau khi P0 ổn định

1. **Landing page sàn:** `app/san/[merchant]/page.tsx` cho 4 sàn; metadata riêng, canonical self, nội dung unique, FAQ, danh sách deal, link affiliate.
2. **Landing page danh mục:** `app/danh-muc/[slug]/page.tsx` cho 16 category; tương tự.
3. **Đổi internal link** từ `/tim-kiem?merchant=` / `?cate=` sang landing page mới ở header/footer/card/breadcrumb.
4. **Trust pages:** About, Contact, Privacy, Terms, affiliate disclosure.
5. **Schema/OG:** `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`; `og:image` mặc định.
6. **Sitemap:** thêm landing pages; kiểm tra lại index.

### 4.1. Checklist một website thương mại/affiliate hoàn chỉnh

Đây là checklist P1, không phải P0. Với mô hình của `sansale247` (site giới thiệu deal + link affiliate, **không bán trực tiếp**), không cần cart/checkout/shipping; nhưng cần minh bạch và đủ niềm tin.

#### A. Trang bắt buộc

| Trang | Mục đích | Ghi chú cho `sansale247` |
|---|---|---|
| Trang chủ | Định vị site, điều hướng, CTA | Đã có |
| Giới thiệu (`/gioi-thieu`) | Ai làm, vì sao đáng tin, sứ mệnh | Nên có ảnh/đội ngũ/thông tin liên hệ thật; không dùng profile giả |
| Liên hệ (`/lien-he`) | Kênh liên hệ, thời gian phản hồi | Email + form; nếu có SĐT/địa chỉ càng tốt |
| Chính sách bảo mật (`/chinh-sach-bao-mat`) | Thu thập gì, dùng làm gì, lưu bao lâu, chia sẻ ai, quyền xóa/sửa | Theo Nghị định 248/2026: tối thiểu 8 nội dung |
| Điều khoản sử dụng (`/dieu-khoan`) | Quy tắc dùng site, giới hạn trách nhiệm, IP, luật áp dụng | Cần thiết cho site có link ra ngoài |
| Tuyên bố affiliate (`/tuyen-bo-affiliate`) | Nói rõ có thể nhận hoa hồng khi mua qua link | Phải đặt **gần link** hoặc ở đầu bài, không chỉ một trang riêng |
| Chính sách biên tập (`/chinh-sach-bien-tap`) | Ai kiểm tra deal, tần suất cập nhật, tiêu chí chọn deal | Tăng E-E-A-T; rất quan trọng với site deal |
| FAQ (`/faq`) | Giải đáp cách dùng mã, mã hết hạn, hoàn tiền do ai xử lý | Giảm hỗ trợ, tăng internal link |
| 404 | Trang lỗi có hướng dẫn quay lại | Đã có; cần noindex/status đúng |
| Sitemap HTML (`/sitemap`) | Điều hướng cho người dùng và crawler | Tùy chọn, nhưng hữu ích |

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
| 0 | `2c6f29b` | `report.md` | Baseline + kế hoạch P0 + checklist P1 + quyết định `.net`/GSC | `git show --stat 2c6f29b` | Hoàn tất |
| 1 | `f51c778` | `app/blog/[slug]/page.tsx`, `app/ma/[id]/page.tsx`, `proxy.ts` | Real 404 cho blog/deal; 301/410 legacy URLs | `tsc`, `lint`, `build`, curl matrix | Hoàn tất (local) |
| 2 | `585791e` | `proxy.ts`, `app/ma/[id]/page.tsx`, `lib/coupons/dealExists.ts` | Proxy chặn deal/blog không tồn tại → 404 thật; `connection()` bỏ Date.now bailout; safe decode path malformed | `tsc`, `lint`, `build`, `pnpm start` + curl matrix, log check | Hoàn tất (local) |
| 3 | — | `report.md` | Ghi nhận kết quả verify Vercel Preview | Preview deployment `dpl_Gn4h2awtkEBjFjrCZ3jtFpSv4kfr` + matrix 404/301/410 | Hoàn tất (preview) |

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
