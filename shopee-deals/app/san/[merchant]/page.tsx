import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage, LandingSidebarCard, LandingLinkList, LandingAffiliateNote } from "@/lib/components/LandingPage";
import { postsForMerchant } from "@/lib/blog/posts";
import { categoryFromSlug } from "@/lib/categories";
import { countDealsPerMerchant, countSearchDeals, listTopCategories, searchDeals } from "@/lib/coupons/data";
import { getMerchantLanding } from "@/lib/landing/content";
import { OG_IMAGE } from "@/lib/seo";
import { SITE, merchantLabel, siteUrl } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return SITE.merchants.map((merchant) => ({ merchant }));
}

export async function generateMetadata(
  props: PageProps<"/san/[merchant]">,
): Promise<Metadata> {
  const { merchant } = await props.params;
  const landing = getMerchantLanding(merchant);

  if (!landing) {
    return {
      title: "Sàn không tồn tại",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: `/san/${landing.slug}` },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url: `/san/${landing.slug}`,
      type: "website",
      images: [OG_IMAGE],
    },
  };
}

export default async function MerchantLandingPage(
  props: PageProps<"/san/[merchant]">,
) {
  const { merchant } = await props.params;
  const landing = getMerchantLanding(merchant);
  if (!landing) notFound();

  const label = merchantLabel(merchant);
  const [deals, total, topCategories, merchantCounts] = await Promise.all([
    searchDeals("", { merchant, limit: 24 }),
    countSearchDeals("", { merchant }),
    listTopCategories(8, merchant),
    countDealsPerMerchant(),
  ]);

  const url = `${siteUrl()}/san/${landing.slug}`;
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
        about: { "@type": "Thing", name: `Deal ${label}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl() },
          { "@type": "ListItem", position: 2, name: `Deal ${label}`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: landing.faqs.map((faq) => ({
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
        badge={`Deal theo sàn · ${label}`}
        title={landing.title}
        description={landing.description}
        intro={landing.intro}
        highlights={landing.highlights}
        stats={[
          { label: "Deal đang hoạt động", value: total.toLocaleString("vi-VN") },
          { label: "Danh mục", value: topCategories.length.toString() },
          { label: "Dữ liệu", value: "Tự động" },
        ]}
        deals={deals}
        faqs={landing.faqs}
        relatedPosts={postsForMerchant(merchant, 3)}
        breadcrumb={[
          { label: "Trang chủ", href: "/" },
          { label: `Deal ${label}` },
        ]}
        moreHref={`/tim-kiem?merchant=${merchant}`}
        moreLabel={`Xem tất cả deal ${label}`}
        emptyTitle={`Chưa có deal ${label} nào`}
        emptyDescription={`Danh sách deal ${label} đang được cập nhật. Bạn có thể xem các deal mới nhất trên trang tìm kiếm.`}
        sidebar={
          <>
            <LandingSidebarCard title="Sàn khác">
              <LandingLinkList
                links={SITE.merchants
                  .filter((item) => item !== merchant)
                  .map((item) => ({
                    href: `/san/${item}`,
                    label: SITE.merchantLabels[item],
                    meta:
                      merchantCounts[item] != null
                        ? `${merchantCounts[item].toLocaleString("vi-VN")} deal`
                        : undefined,
                  }))}
              />
            </LandingSidebarCard>

            <LandingSidebarCard title={`Danh mục trên ${label}`}>
              {topCategories.length > 0 ? (
                <LandingLinkList
                  links={topCategories.map(({ slug, count }) => ({
                    href: `/danh-muc/${slug}`,
                    label: categoryFromSlug(slug).label,
                    meta: `${count.toLocaleString("vi-VN")} deal`,
                  }))}
                />
              ) : (
                <p className="px-2 text-xs leading-relaxed text-ink/50">
                  Chưa có danh mục nào được ghi nhận cho sàn này.
                </p>
              )}
            </LandingSidebarCard>

            <LandingAffiliateNote />
          </>
        }
      />
    </>
  );
}
