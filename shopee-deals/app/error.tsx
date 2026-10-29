"use client";

import Link from "next/link";
import { CircleAlert, House, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="my-16 rounded-lg border border-line bg-white p-8 text-center">
      <span
        aria-hidden
        className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-accent/8 text-accent"
      >
        <CircleAlert className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 font-display text-xl font-semibold text-ink">
        Có lỗi khi hiển thị trang
      </h1>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-ink/50">
        {error.message.slice(0, 220)}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Thử lại
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
        >
          <House className="h-4 w-4" aria-hidden />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
