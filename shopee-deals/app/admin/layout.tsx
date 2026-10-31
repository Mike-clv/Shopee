import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/admin";
import { getCurrentAdmin } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { AdminNav } from "@/lib/components/admin/AdminNav";

/**
 * Cpanel chrome: a persistent module nav on desktop and a scrollable tab bar on
 * mobile. The session read stays behind Suspense so the shell prerenders.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="py-6">
      <Suspense fallback={<AdminBarFallback />}>
        <AdminBar />
      </Suspense>
      <div className="mt-5 grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

function AdminBarFallback() {
  return (
    <div className="flex h-[62px] items-center justify-between rounded-lg border border-line bg-white px-4 text-sm text-ink/30">
      Đang tải…
    </div>
  );
}

async function AdminBar() {
  const admin = await getCurrentAdmin();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white"
        >
          <LayoutDashboard className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-lg leading-tight font-semibold text-ink">
            Cpanel {SITE.shortName}
          </p>
          {admin && <p className="text-xs text-ink/45">Xin chào, {admin.email}</p>}
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
        >
          <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          Xem web
        </Link>
        {admin && (
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-medium text-white transition hover:bg-brand-dark"
            >
              <LogOut aria-hidden className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
