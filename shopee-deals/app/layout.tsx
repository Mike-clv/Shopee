import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Be_Vietnam_Pro, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { FEATURED_CATEGORY_SLUGS, categoryFromSlug } from "@/lib/categories";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { NavTabs } from "@/lib/components/NavTabs";
import { getCurrentAdmin } from "@/lib/auth";
import { Search, Settings, Sparkles } from "lucide-react";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.defaultUrl),
  title: {
    default: `${SITE.name} – Mã giảm giá Shopee & deal Tiki, TikTok Shop, Lazada`,
    template: `%s – ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "mã giảm giá shopee",
    "coupon shopee",
    "mã freeship shopee",
    "deal tiki",
    "deal lazada",
    "deal tiktok shop",
    "mã giảm giá mới nhất",
    "shopee sale",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE.name,
    title: `${SITE.name} – Mã giảm giá Shopee & deal đa sàn`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  // Versioned URL forces browsers (Chrome favicon cache) to re-fetch the icon
  // after brand changes. Bump v= when the icon artwork changes.
  icons: {
    icon: [{ url: "/icon.svg?v=2", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f15a24",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${beVietnamPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

/** House brand glyph (price tag) — same asset as the favicon at /icon.svg. */
function TagGlyph({ className = "", tag = "#fff" }: { className?: string; tag?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={className}>
      <path
        fill={tag}
        fillRule="evenodd"
        d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42zM9.3 7.5a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 1 1 3.6 0z"
      />
    </svg>
  );
}

function SearchBox({ mobile = false }: { mobile?: boolean }) {
  return (
    <form
      action="/tim-kiem"
      method="GET"
      role="search"
      className={`relative ${mobile ? "w-full" : "hidden min-w-0 max-w-xl flex-1 md:flex"}`}
    >
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/35"
      />
      <input
        type="search"
        name="q"
        aria-label="Tìm mã giảm giá"
        placeholder="Tìm mã giảm giá, voucher, deal hot…"
        className="h-10 w-full rounded-full border border-line bg-muted py-2 pr-20 pl-10 text-sm text-ink transition placeholder:text-ink/35 focus:border-brand/50 focus:bg-white focus:ring-2 focus:ring-brand/10 focus:outline-none"
      />
      <button
        type="submit"
        className="absolute top-1 right-1 inline-flex h-8 items-center rounded-full bg-brand px-4 text-xs font-semibold text-white transition hover:bg-brand-dark"
      >
        Tìm
      </button>
    </form>
  );
}

/**
 * Static stand-in for the NavTabs client island: keeps the header labels
 * stable while prerendered shells stream, without usePathname().
 */
function NavTabsFallback({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav
      aria-hidden
      className={`flex items-center gap-0.5 text-[13px] font-medium md:gap-1 md:text-sm ${mobile ? "overflow-x-auto" : ""}`}
    >
      <span className="rounded-lg bg-brand/8 px-2.5 py-2 font-semibold whitespace-nowrap text-brand md:px-3">
        Mới nhất
      </span>
      <span className="rounded-lg px-2.5 py-2 whitespace-nowrap text-ink/65 md:px-3">Tìm mã</span>
      <span className="rounded-lg px-2.5 py-2 whitespace-nowrap text-ink/65 md:px-3">Mã hot</span>
      <span className="rounded-lg px-2.5 py-2 whitespace-nowrap text-ink/65 md:px-3">Blog</span>
    </nav>
  );
}

/**
 * Request-time admin entry: renders nothing for guests; "Quản lý" only for a
 * signed-in admin. connection() + Suspense keep the prerender shell static.
 */
async function AdminHeaderLink() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return (
    <Link
      href="/admin"
      className="ml-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-2 text-xs font-semibold whitespace-nowrap text-brand transition hover:bg-brand hover:text-white md:ml-1 md:px-3"
    >
      <Settings className="h-3.5 w-3.5" aria-hidden />
      Quản lý
    </Link>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 shadow-sm backdrop-blur-md">
      <div className="bg-brand text-white">
        <div className="topbar mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-1.5">
          <div className="topbar-marquee min-w-0 flex-1">
            <div className="topbar-track text-[11px] font-medium">
              <span className="pr-10 whitespace-nowrap">
                Tổng hợp mã giảm giá, voucher và deal hot nhất hôm nay — cập nhật 24/7
              </span>
              <span aria-hidden className="pr-10 whitespace-nowrap">
                Tổng hợp mã giảm giá, voucher và deal hot nhất hôm nay — cập nhật 24/7
              </span>
            </div>
          </div>
          <nav aria-label="Deal theo sàn" className="hidden shrink-0 items-center gap-4 text-[11px] font-medium md:flex">
            {SITE.merchants.map((merchant) => (
              <Link
                key={merchant}
                href={`/tim-kiem?merchant=${merchant}`}
                className="inline-flex items-center gap-1 text-white/85 transition hover:text-white hover:underline"
              >
                <MerchantLogo merchant={merchant} size={14} />
                {SITE.merchantLabels[merchant]}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-[68px] items-center gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-ink"
            aria-label={`${SITE.name} – trang chủ`}
          >
            <span className="brand-mark relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand">
              <TagGlyph className="relative h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="title-shimmer font-display text-[1.35rem] leading-tight font-bold whitespace-nowrap sm:text-[1.55rem] xl:text-[1.85rem]">
                {SITE.shortName}
              </span>
              <span className="brand-pro -mt-0.5 text-[10px] font-medium tracking-wide text-ink/45">
                PRO
              </span>
            </span>
          </Link>

          <SearchBox />

          <div className="hidden shrink-0 items-center gap-1 md:flex">
            <Suspense fallback={<NavTabsFallback />}>
              <NavTabs />
            </Suspense>
            <Suspense fallback={null}>
              <AdminHeaderLink />
            </Suspense>
          </div>

          {/* Compact mobile search entry — header keeps one search row only. */}
          <Link
            href="/tim-kiem"
            aria-label="Tìm mã giảm giá"
            className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-muted text-ink/55 transition hover:border-brand/40 hover:text-brand md:hidden"
          >
            <Search className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-2.5 md:hidden [scrollbar-width:none]">
          <div className="flex items-center gap-1">
            <Suspense fallback={<NavTabsFallback mobile />}>
              <NavTabs />
            </Suspense>
            <Suspense fallback={null}>
              <AdminHeaderLink />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const categories = FEATURED_CATEGORY_SLUGS.slice(0, 6).map((slug) => {
    const info = categoryFromSlug(slug);
    return { slug, label: info.label, Icon: info.icon };
  });
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="h-1 w-full bg-gradient-to-r from-brand via-[#2f80ed] to-accent" />
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid gap-8 text-sm sm:grid-cols-12">
          <div className="sm:col-span-5">
            <p className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-sm shadow-brand/25">
                <TagGlyph className="h-4.5 w-4.5" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                {SITE.name}
              </span>
            </p>
            <p className="mt-3 max-w-sm leading-relaxed text-ink/55">
              Tổng hợp mã giảm giá, voucher và deal sản phẩm từ Shopee, Tiki,
              TikTok Shop, Lazada — cập nhật tự động qua Accesstrade. Mua qua
              link affiliate giúp duy trì website miễn phí.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1 text-[11px] font-semibold text-brand">
              <Sparkles className="h-3 w-3" aria-hidden />
              Cập nhật 24/7 · Miễn phí sử dụng
            </p>
          </div>

          <nav aria-label="Danh mục hot" className="sm:col-span-4">
            <p className="font-semibold text-ink">Danh mục hot</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {categories.map(({ slug, label, Icon }) => (
                <li key={slug}>
                  <Link
                    href={`/tim-kiem?cate=${encodeURIComponent(slug)}`}
                    className="inline-flex items-center gap-1.5 text-ink/55 transition hover:text-brand"
                  >
                    <Icon className="h-3.5 w-3.5 text-ink/35" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-3">
            <p className="font-semibold text-ink">Deal theo sàn</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {SITE.merchants.map((merchant) => (
                <li key={merchant}>
                  <Link
                    href={`/tim-kiem?merchant=${merchant}`}
                    className="inline-flex items-center gap-2 text-ink/55 transition hover:text-brand"
                  >
                    <MerchantLogo merchant={merchant} size={16} />
                    Deal {SITE.merchantLabels[merchant]}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/blog"
              className="mt-3 inline-flex text-xs font-medium text-ink/45 transition hover:text-brand"
            >
              Mẹo săn deal trên blog →
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-line pt-5 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE.name}. Không phải website chính thức của Shopee, Tiki, Lazada hay TikTok Shop.</p>
          <p>Affiliate · Accesstrade · Cập nhật 24/7</p>
        </div>
      </div>
    </footer>
  );
}
