import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Mail, ShieldCheck, Users } from "lucide-react";
import { BlogCard } from "@/lib/components/BlogCard";
import { LegalPage, LegalSection } from "@/lib/components/LegalPage";
import { EDITORIAL_TEAM } from "@/lib/blog/author";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { OG_IMAGE } from "@/lib/seo";
import { SITE, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: EDITORIAL_TEAM.name,
  description: EDITORIAL_TEAM.description,
  alternates: { canonical: EDITORIAL_TEAM.href },
  openGraph: {
    title: `${EDITORIAL_TEAM.name} — Sansale247`,
    description: EDITORIAL_TEAM.description,
    url: EDITORIAL_TEAM.href,
    type: "profile",
    images: [OG_IMAGE],
  },
};

export default function EditorialTeamPage() {
  const pageUrl = `${siteUrl()}${EDITORIAL_TEAM.href}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: EDITORIAL_TEAM.name,
        description: EDITORIAL_TEAM.description,
        inLanguage: "vi-VN",
        isPartOf: { "@id": `${siteUrl()}/#website` },
        mainEntity: { "@id": `${pageUrl}#team` },
      },
      {
        "@type": "Organization",
        "@id": `${pageUrl}#team`,
        name: EDITORIAL_TEAM.name,
        url: pageUrl,
        description: EDITORIAL_TEAM.shortBio,
        parentOrganization: {
          "@type": "Organization",
          name: "Sansale247",
          url: siteUrl(),
        },
        knowsAbout: [...EDITORIAL_TEAM.expertise],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: siteUrl(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Ban biên tập",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <LegalPage
      title={EDITORIAL_TEAM.name}
      description={EDITORIAL_TEAM.shortBio}
      updated={EDITORIAL_TEAM.updated}
      current={EDITORIAL_TEAM.href}
      eyebrow="Hồ sơ biên tập"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="rounded-2xl border border-brand/20 bg-brand/[0.04] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-sm shadow-brand/25">
            <Users className="h-7 w-7" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl font-bold tracking-tight text-ink">
              {EDITORIAL_TEAM.name}
            </p>
            <p className="mt-1 text-sm font-medium text-brand">
              {EDITORIAL_TEAM.title}
            </p>
            <p className="mt-2 text-[14.5px] leading-7 text-ink/65">
              {EDITORIAL_TEAM.shortBio}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Phạm vi nội dung">
              {EDITORIAL_TEAM.expertise.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-brand/20 bg-white px-2.5 py-1 text-[11px] font-medium text-ink/60"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <LegalSection
        section={{
          heading: "Ai viết nội dung trên Sansale247?",
          paragraphs: [
            "Các bài hướng dẫn, so sánh và phân tích trên blog được biên soạn bởi Ban biên tập Sansale247. Nhóm làm việc với dữ liệu khuyến mãi công khai, datafeed của sàn, trang chương trình của thương hiệu và phản hồi của người đọc.",
            "Sansale247 không phải sàn thương mại điện tử và không bán hàng. Vì vậy, nội dung tập trung vào việc giúp bạn đọc điều kiện, so sánh quyền lợi và tự kiểm tra lại giao dịch trên trang chính thức của sàn.",
          ],
        }}
      />

      <LegalSection
        section={{
          heading: "Chúng tôi dựa vào nguồn nào?",
          bullets: [
            "Chương trình khuyến mãi, voucher và freeship do sàn hoặc AccessTrade công bố.",
            "Trang sản phẩm, điều kiện sử dụng và chính sách đổi trả của người bán.",
            "Thông tin công khai từ thương hiệu hoặc nhà phân phối khi cần đối chiếu.",
            "Phản hồi của người đọc về mã hết hạn, link lỗi, giá hoặc điều kiện chưa đúng.",
          ],
          paragraphs: [
            "Không phải thông tin nào cũng có thể xác minh hoàn toàn trước khi đăng, vì chương trình khuyến mãi thay đổi theo thời điểm. Khi đó, bài viết ghi rõ giới hạn, tránh khẳng định chắc chắn và hướng dẫn bạn kiểm tra ở bước thanh toán.",
          ],
        }}
      />

      <section>
        <h2 className="font-display text-[20px] font-bold tracking-tight text-ink">
          Quy trình kiểm duyệt
        </h2>
        <ol className="mt-3 space-y-3">
          {EDITORIAL_TEAM.process.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-xl border border-line bg-white p-4"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand/10 font-mono text-[11px] font-bold text-brand">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-[14px] leading-7 text-ink/60">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <LegalSection
        section={{
          heading: "Nguyên tắc biên tập",
          bullets: [...EDITORIAL_TEAM.principles],
        }}
      >
        <p className="flex items-start gap-2 rounded-lg bg-brand/[0.04] px-3 py-2.5 text-xs leading-relaxed text-ink/55">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
          Quy trình này áp dụng cho bài blog, landing page và nội dung hướng dẫn;
          deal tự động vẫn được kiểm tra trạng thái trước khi hiển thị.
        </p>
      </LegalSection>

      <LegalSection
        section={{
          heading: "Affiliate và tính độc lập",
          paragraphs: [
            "Sansale247 có thể nhận hoa hồng khi bạn mua hàng qua link tiếp thị liên kết. Khoản hoa hồng do sàn hoặc mạng tiếp thị chi trả, không cộng thêm vào giá bạn thanh toán.",
            "Hoa hồng không quyết định việc một deal có được đăng, thứ tự hiển thị hoặc nội dung đánh giá. Website không bán vị trí hiển thị và không nhận tiền để đẩy một deal lên đầu. Nếu có nội dung được tài trợ trong tương lai, thông tin đó sẽ được ghi rõ tại nội dung.",
          ],
        }}
      >
        <p className="text-sm leading-relaxed text-ink/60">
          Đọc thêm{" "}
          <Link
            href="/chinh-sach/tiet-lo-affiliate"
            className="font-semibold text-brand hover:text-brand-dark"
          >
            Tiết lộ affiliate
          </Link>{" "}
          và{" "}
          <Link
            href="/chinh-sach/chinh-sach-bien-tap"
            className="font-semibold text-brand hover:text-brand-dark"
          >
            Chính sách biên tập
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection
        section={{
          heading: "Báo lỗi, đính chính và cập nhật",
          paragraphs: [
            "Nếu bạn thấy mã đã hết hạn, link sai, giá hoặc điều kiện không còn đúng, hãy gửi URL và mô tả ngắn. Ban biên tập sẽ kiểm tra lại nguồn trước khi sửa hoặc gỡ nội dung.",
            "Mỗi bài viết hiển thị ngày cập nhật gần nhất. Ngày này chỉ được đổi sau khi nội dung đã được rà soát, không dùng để tạo cảm giác bài mới.",
          ],
        }}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Gửi báo lỗi
          </Link>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink/65 transition hover:border-brand/40 hover:text-brand"
          >
            {SITE.contactEmail}
          </a>
        </div>
      </LegalSection>

      <section aria-labelledby="author-posts">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-3">
          <div>
            <h2
              id="author-posts"
              className="flex items-center gap-2 font-display text-[20px] font-bold tracking-tight text-ink"
            >
              <ClipboardCheck className="h-4 w-4 text-brand" aria-hidden />
              Bài viết của ban biên tập
            </h2>
            <p className="mt-1 text-sm text-ink/50">
              10 bài hướng dẫn đã xuất bản, sắp theo ngày cập nhật.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-dark"
          >
            Tất cả bài viết
            <ArrowRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </LegalPage>
  );
}
