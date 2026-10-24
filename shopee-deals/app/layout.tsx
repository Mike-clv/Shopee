import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE.defaultUrl),
  title: {
    default: `${SITE.name} – Mã giảm giá Shopee mới nhất mỗi ngày`,
    template: `%s – ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "mã giảm giá shopee",
    "coupon shopee",
    "mã freeship shopee",
    "mã giảm giá mới nhất",
    "shopee sale",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE.name,
    title: `${SITE.name} – Mã giảm giá Shopee mới nhất`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ee4d2d",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <SiteHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-[#ee4d2d] text-white shadow-sm">
      <div className="w-full max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold text-lg tracking-tight flex items-center gap-2">
          <span aria-hidden className="text-xl">🏷️</span>
          <span>{SITE.shortName}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:underline underline-offset-4">Mới nhất</Link>
          <Link href="/tim-kiem" className="hover:underline underline-offset-4">Tìm mã</Link>
          <Link
            href="/admin"
            className="rounded-md bg-white/15 px-2.5 py-1 hover:bg-white/25"
          >
            Quản lý
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-neutral-200 bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-6 text-sm text-neutral-500 space-y-2">
        <p className="font-medium text-neutral-700">{SITE.name}</p>
        <p>
          Mã giảm giá được cập nhật tự động qua Accesstrade. Chuyển hướng mua hàng
          qua link affiliate giúp duy trì website miễn phí. Cảm ơn bạn đã ủng hộ!
        </p>
        {/* Year is fixed at source level; a dynamic Date() would flag the
            whole layout for cacheComponents prerender validation. */}
        <p>© 2026 {SITE.name}. Không phải website chính thức của Shopee.</p>
      </div>
    </footer>
  );
}
