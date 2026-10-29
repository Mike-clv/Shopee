import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { BlogCard } from "@/lib/components/BlogCard";
import {
  BLOG_POSTS,
  getPost,
  postDateLabel,
  type BlogPost,
} from "@/lib/blog/posts";
import { siteUrl } from "@/lib/site";

// Allow params to be validated before streaming so unknown slugs return a real
// 404 instead of a 200 soft-404. Cache Components still prerenders the known
// slugs from generateStaticParams.
export const instant = false;

/**
 * Posts live in code, so their slugs are known at build time. Declaring them
 * lets Next prerender every article instead of hitting the "params accessed
 * outside Suspense" blocking-prerender error under Cache Components.
 */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) {
    return {
      title: "Bài viết không tồn tại",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage(
  props: PageProps<"/blog/[slug]">,
) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostBody post={post} />
    </Suspense>
  );
}

/** Blank editorial skeleton while the article streams/prerenders. */
function PostSkeleton() {
  return (
    <div className="py-6" aria-hidden>
      <div className="shimmer h-3 w-40 rounded-sm" />
      <div className="shimmer mt-5 h-3 w-28 rounded-sm" />
      <div className="shimmer mt-4 h-9 w-3/4 rounded-sm" />
      <div className="shimmer mt-3 h-4 w-2/3 rounded-sm" />
      <div className="mt-6 space-y-3 border-t border-line pt-6">
        <div className="shimmer h-3 w-full rounded-sm" />
        <div className="shimmer h-3 w-11/12 rounded-sm" />
        <div className="shimmer h-3 w-4/5 rounded-sm" />
      </div>
    </div>
  );
}

function PostBody({ post }: { post: BlogPost }) {
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const Icon = post.icon;

  // Structured data — stringified with "<" escaped, same rule as deal pages
  // so no content can break out of the script tag.
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Mã Giảm Giá Đa Sàn" },
    mainEntityOfPage: `${siteUrl()}/blog/${post.slug}`,
  };

  return (
    <article className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink/45"
      >
        <Link href="/" className="transition hover:text-brand">
          Trang chủ
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <Link href="/blog" className="transition hover:text-brand">
          Blog
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <Link
          href={post.tag.href}
          className="inline-flex items-center gap-1 transition hover:text-brand"
        >
          <Icon className="h-3 w-3" aria-hidden />
          {post.tag.label}
        </Link>
      </nav>

      <header className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            href={post.tag.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase transition hover:border-brand/40 hover:text-brand-dark"
          >
            <Icon className="h-3 w-3" aria-hidden />
            {post.tag.label}
          </Link>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink/35">
            <Clock3 className="h-3 w-3" aria-hidden />
            {postDateLabel(post.date)} · {post.minutes} phút đọc
          </span>
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/55">
          {post.excerpt}
        </p>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {post.body.map((block, index) => {
              if (block.kind === "h2") {
                return (
                  <h2
                    key={index}
                    className="pt-3 font-display text-[21px] font-bold tracking-tight text-ink"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.kind === "tip") {
                return (
                  <aside
                    key={index}
                    className="flex gap-2.5 rounded-xl border-l-2 border-brand bg-brand/[0.04] px-4 py-3.5"
                  >
                    <Lightbulb
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                    />
                    <p className="text-sm leading-relaxed text-ink/70">
                      <strong className="font-semibold text-ink">Mẹo nhanh: </strong>
                      {block.text}
                    </p>
                  </aside>
                );
              }
              if (block.kind === "list") {
                return (
                  <ul key={index} className="space-y-2.5">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-[14.5px] leading-7 text-ink/65"
                      >
                        <span
                          aria-hidden
                          className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-brand/60"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-[14.5px] leading-7 text-ink/65">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>

        <aside className="self-start lg:sticky lg:top-20 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white">
            <div className="p-5 pb-4">
              <p className="font-mono text-[9px] font-semibold tracking-[0.14em] text-ink/40 uppercase">
                Săn deal theo chủ đề này
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                Tìm mã đang chạy ngay hôm nay, xếp theo từng chủ đề trong bài.
              </p>
            </div>
            <div className="coupon-ticket rounded-b-2xl border-t border-dashed border-line bg-brand/[0.04] px-5 py-4">
              <div className="flex flex-col gap-2">
                {post.hintedCtas.map((cta, index) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className={
                      index === 0
                        ? "group/cta flex items-center justify-between gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                        : "group/cta flex items-center justify-between gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink/70 transition hover:border-brand/40 hover:text-brand"
                    }
                  >
                    {cta.label}
                    <ArrowRight
                      aria-hidden
                      className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5"
                    />
                  </Link>
                ))}
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink/40">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                Link chuyển hướng affiliate — giúp duy trì website miễn phí.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="more-posts" className="mt-10">
          <div className="mb-4 flex items-end justify-between border-b border-line pb-3">
            <h2
              id="more-posts"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              Bài viết khác
            </h2>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-dark"
            >
              Tất cả bài viết
              <ChevronRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
