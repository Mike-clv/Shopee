import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CopyButton } from "@/lib/components/CopyButton";
import { getDealCached } from "@/lib/coupons/data";
import { truncateVi, formatDayVi } from "@/lib/utils";
import Image from "next/image";

export async function generateMetadata(
  props: PageProps<"/ma/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const deal = await getDealCached(id);
  if (!deal) return { title: "Mã không tồn tại" };
  const title = truncateVi(deal.title, 60);
  return {
    title,
    description: truncateVi(deal.content ?? deal.title, 160),
    alternates: { canonical: `/ma/${deal.id}` },
    openGraph: {
      title,
      description: truncateVi(deal.content ?? deal.title, 160),
      images: deal.image ? [{ url: deal.image }] : undefined,
    },
  };
}

export default function DealDetailPage(props: PageProps<"/ma/[id]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DealBody params={props.params} />
    </Suspense>
  );
}

function DetailSkeleton() {
  return (
    <div className="py-6" aria-hidden>
      <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex gap-4">
          <div className="h-18 w-18 rounded-xl bg-neutral-200" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-5 w-3/4 rounded bg-neutral-200" />
            <div className="h-3.5 w-1/3 rounded bg-neutral-100" />
          </div>
        </div>
        <div className="mt-5 h-28 rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}

async function DealBody({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await getDealCached(id);
  if (!deal) notFound();

  return (
    <article className="py-6">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500 mb-3">
        <Link href="/" className="hover:text-[#ee4d2d]">Trang chủ</Link>
        {deal.merchant && (
          <span>
            {" / "}
            <span className="capitalize">{deal.merchant}</span>
          </span>
        )}
      </nav>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex gap-4">
          {deal.image ? (
            <Image
              src={deal.image}
              alt={deal.title}
              width={72}
              height={72}
              className="h-18 w-18 shrink-0 rounded-xl object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-xl bg-[#ee4d2d]/10 text-2xl font-bold text-[#ee4d2d]">
              {(deal.merchantName ?? deal.merchant ?? "S").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-snug">{deal.title}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {deal.merchantName ?? deal.merchant}
              {deal.domain ? ` (${deal.domain})` : ""}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-neutral-50 border border-neutral-200 p-4">
          <div className="text-xs font-medium text-neutral-500 mb-1">Mã giảm giá</div>
          {deal.code ? (
            <CopyButton code={deal.code} goPath={`/go/${deal.id}`} />
          ) : (
            <a
              href={`/go/${deal.id}`}
              target="_blank"
              rel="noopener nofollow"
              className="block rounded-lg bg-[#ee4d2d] px-4 py-2.5 text-center font-semibold text-white hover:bg-[#d73211]"
            >
              Nhận ưu đãi tại website →
            </a>
          )}
          <ul className="mt-3 grid grid-cols-1 gap-1 text-xs text-neutral-500 sm:grid-cols-2">
            <li>
              Ngày bắt đầu: {formatDayVi(deal.startTime)}
            </li>
            <li>
              Hạn dùng: {formatDayVi(deal.endTime)}
            </li>
            <li>
              Lượt click: {deal.clickCount.toLocaleString("vi-VN")}
            </li>
            {deal.categories && deal.categories.length > 0 && (
              <li>Danh mục: {deal.categories.join(", ")}</li>
            )}
          </ul>
        </div>

        {deal.content && (
          <div className="mt-4 text-sm leading-relaxed text-neutral-700">
            <h2 className="mb-1 font-semibold text-base">Điều kiện ưu đãi</h2>
            <p className="whitespace-pre-line">{deal.content}</p>
          </div>
        )}
      </div>
    </article>
  );
}
