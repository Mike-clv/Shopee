import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, LegalSection } from "@/lib/components/LegalPage";
import { LEGAL_PAGES, getLegalPage } from "@/lib/legal/content";

export const instant = false;

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(
  props: PageProps<"/chinh-sach/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getLegalPage(slug);

  if (!page) {
    return {
      title: "Trang không tồn tại",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/chinh-sach/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/chinh-sach/${page.slug}`,
      type: "article",
    },
  };
}

export default async function LegalPageRoute(
  props: PageProps<"/chinh-sach/[slug]">,
) {
  const { slug } = await props.params;
  const page = getLegalPage(slug);

  if (!page) notFound();

  return (
    <LegalPage
      title={page.title}
      description={page.description}
      updated={page.updated}
      current={`/chinh-sach/${page.slug}`}
    >
      {page.sections.map((section) => (
        <LegalSection key={section.heading} section={section} />
      ))}
    </LegalPage>
  );
}
