export const instant = false;
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, KeyRound } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/lib/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="relative overflow-hidden bg-brand p-6 text-white">
          <span
            aria-hidden
            className="absolute -top-12 -right-10 h-36 w-36 rounded-full bg-white/15 blur-2xl"
          />
          <KeyRound className="relative h-5 w-5 text-white/70" aria-hidden />
          <h1 className="relative mt-3 font-display text-2xl font-semibold tracking-tight">
            Khu vực quản trị
          </h1>
          <p className="relative mt-1 text-xs text-white/50">
            Chỉ dành cho chủ sở hữu website.
          </p>
        </div>
        <div className="p-6">
          <Suspense
            fallback={<p className="text-sm text-ink/40">Đang tải…</p>}
          >
            <Gate>
              <LoginForm />
            </Gate>
          </Suspense>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-0.5 text-sm font-medium text-ink/50 transition hover:text-brand"
          >
            <ChevronLeft aria-hidden className="h-3.5 w-3.5" />
            Về trang chính
          </Link>
        </div>
      </div>
    </div>
  );
}

/** If already signed in, straight to the dashboard. */
async function Gate({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");
  return <>{children}</>;
}
