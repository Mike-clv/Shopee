import Link from "next/link";
import { ChevronRight, Clock3 } from "lucide-react";
import { postDateLabel, type BlogPost } from "@/lib/blog/posts";

/** Shared blog teaser card: gradient cover + meta + excerpt. */
export function BlogCard({ post }: { post: BlogPost }) {
  const Icon = post.icon;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}`}
        className={`relative block h-32 overflow-hidden ${post.gradient} p-4`}
        aria-label={post.title}
      >
        <span className="relative flex items-start justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Icon className="h-4.5 w-4.5 text-white" aria-hidden />
          </span>
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink uppercase">
            {post.tag.label}
          </span>
        </span>
        <Icon
          aria-hidden
          className="absolute -right-3 -bottom-5 h-24 w-24 text-white/10"
          strokeWidth={1.25}
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-[11px] text-ink/45">
          <Clock3 aria-hidden className="h-3.5 w-3.5" />
          {postDateLabel(post.date)} · {post.minutes} phút đọc
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-[15px] leading-snug font-semibold text-ink">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-brand">
            {post.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/50">
          {post.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-brand">
          Đọc tiếp
          <ChevronRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </article>
  );
}
