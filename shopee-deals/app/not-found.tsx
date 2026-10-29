import Link from "next/link";
import { ArrowRight, House, SearchX } from "lucide-react";

/** Branded 404 — replaces the stock Next.js not-found page. */
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p
        aria-hidden
        className="font-display text-8xl leading-none font-semibold tracking-tighter text-brand/15 sm:text-9xl"
      >
        404
      </p>
      <span
        aria-hidden
        className="mx-auto mt-2 grid h-11 w-11 place-items-center rounded-md border border-line bg-white text-brand"
      >
        <SearchX className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
        Không tìm thấy trang này
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/50">
        Deal có thể đã hết hạn và bị gỡ, hoặc đường dẫn sai. Thử tìm từ khóa khác xem sao.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <House className="h-4 w-4" aria-hidden />
          Trang chủ
        </Link>
        <Link
          href="/tim-kiem"
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
        >
          Tìm mã đang chạy
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
