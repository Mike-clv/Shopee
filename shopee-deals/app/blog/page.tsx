import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/lib/components/BlogCard";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog & mẹo săn mã giảm giá đa sàn",
  description:
    "Kinh nghiệm săn mã Shopee, freeship, flash sale Lazada, sách Tiki và livestream TikTok Shop — hướng dẫn thực chiến để mua đúng giá và không bỏ phí voucher.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="py-8">
      <header className="border-b border-line pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Mẹo săn deal &amp; tin sàn
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/50">
          Kinh nghiệm thực chiến ngắn gọn — đọc xong dùng được ngay cho đơn hàng
          tiếp theo.
        </p>
        <p className="mt-3 font-mono text-[10px] text-ink/35">
          {BLOG_POSTS.length} bài viết
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line pt-5 text-sm text-ink/50 sm:flex-row sm:items-center">
        <p>Đang tìm deal thay vì đọc lâu?</p>
        <Link
          href="/tim-kiem"
          className="inline-flex items-center gap-1 font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition hover:text-brand-dark"
        >
          Xem toàn bộ mã giảm giá
        </Link>
      </div>
    </div>
  );
}
