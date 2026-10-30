import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingPage, LandingSidebarCard, LandingLinkList, LandingAffiliateNote } from "@/lib/components/LandingPage";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { CATEGORY_SLUGS, categoryFromSlug } from "@/lib/categories";
import { countSearchDeals, searchDeals } from "@/lib/coupons/data";
import { categoryFaqs, getCategoryLanding } from "@/lib/landing/content";
import { SITE, siteUrl } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/danh-muc/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const landing = getCategoryLanding(slug);

  if (!landing) {
    return {
      title: "Danh mục không tồn tại",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: `/danh-muc/${slug}` },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url: `/danh-muc/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryLandingPage(
  props: PageProps<"/danh-muc/[slug]">,
) {
  const { slug } = await props.params;
  const landing = getCategoryLanding(slug);
  if (!landing) notFound();

  const label = categoryFromSlug(slug).label;
  const [deals, total, merchantCounts] = await Promise.all([
    searchDeals("", { category: slug, limit: 24 }),
    countSearchDeals("", { category: slug }),
    Promise.all(
      SITE.merchants.map(async (merchant) => ({
        merchant,
        count: await countSearchDeals("", { category: slug, merchant }),
      })),
    ),
  ]);
  const activeMerchants = merchantCounts.filter((item) => item.count > 0);
  const otherCategories = CATEGORY_SLUGS.filter((item) => item !== slug).slice(0, 8);

  const url = `${siteUrl()}/danh-muc/${slug}`;
  const faqs = categoryFaqs(label);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: landing.title,
        description: landing.description,
        isPartOf: { "@type": "WebSite", name: SITE.name, url: siteUrl() },
        about: { "@type": "Thing", name: label },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl() },
          {
            "@type": "ListItem",
            position: 2,
            name: "Danh mục",
            item: `${siteUrl()}/tim-kiem`,
          },
          { "@type": "ListItem", position: 3, name: label, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LandingPage
        badge={`Deal theo danh mục · ${label}`}
        title={landing.title}
        description={landing.description}
        intro={landing.intro}
        highlights={landing.highlights}
        stats={[
          { label: "Deal đang hoạt động", value: total.toLocaleString("vi-VN") },
          { label: "Sàn có deal", value: activeMerchants.length.toString() },
          { label: "Dữ liệu", value: "Tự động" },
        ]}
        deals={deals}
        faqs={faqs}
        breadcrumb={[
          { label: "Trang chủ", href: "/" },
          { label: "Danh mục", href: "/tim-kiem" },
          { label },
        ]}
        moreHref={`/tim-kiem?cate=${encodeURIComponent(slug)}`}
        moreLabel={`Xem tất cả deal ${label}`}
        emptyTitle={`Chưa có deal ${label} nào`}
        emptyDescription={`Danh sách deal ${label} đang được cập nhật. Bạn có thể xem các deal mới nhất trên trang tìm kiếm.`}
        sidebar={
          <>
            <LandingSidebarCard title="Sàn có deal">
              {activeMerchants.length > 0 ? (
                <ul className="space-y-1">
                  {activeMerchants.map(({ merchant, count }) => (
                    <li key={merchant}>
                      <Link
                        href={`/tim-kiem?merchant=${merchant}&cate=${encodeURIComponent(slug)}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs text-ink/60 transition hover:bg-ink/[0.03] hover:text-brand"
                      >
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <MerchantLogo merchant={merchant} size={16} />
                          <span className="truncate">{SITE.merchantLabels[merchant]}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-ink/35">
                          {count.toLocaleString("vi-VN")} deal
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 text-xs leading-relaxed text-ink/50">
                  Chưa có sàn nào được ghi nhận cho danh mục này.
                </p>
              )}
            </LandingSidebarCard>

            <LandingSidebarCard title="Danh mục khác">
              <LandingLinkList
                links={otherCategories.map((item) => ({
                  href: `/danh-muc/${item}`,
                  label: categoryFromSlug(item).label,
                }))}
              />
            </LandingSidebarCard>

            <LandingAffiliateNote />
          </>
        }
      />
    </>
  );
}
