import { Suspense } from "react";
import { logoutAction } from "@/app/actions/admin";
import { SITE } from "@/lib/site";
import { getCurrentAdmin } from "@/lib/auth";
import Link from "next/link";

/**
 * Admin chrome. The session read lives behind Suspense:
 * everything full-bleed (bar) prerenders, the auth check streams in.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="py-6">
      <ItemSuspense>
        <AdminBar />
      </ItemSuspense>
      {children}
    </div>
  );
}

function ItemSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AdminBarFallback />}>{children}</Suspense>;
}

function AdminBarFallback() {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <span className="text-sm text-neutral-400">…</span>
    </div>
  );
}

async function AdminBar() {
  const admin = await getCurrentAdmin();
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-semibold">Quản trị {SITE.shortName}</p>
        {admin && (
          <p className="text-xs text-neutral-500">Xin chào, {admin.email}</p>
        )}
      </div>
      <div className="flex gap-2 text-sm">
        <Link
          href="/"
          className="rounded-lg border border-neutral-200 px-3 py-1.5 hover:bg-neutral-50"
        >
          Xem web
        </Link>
        {admin && (
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
            >
              Đăng xuất
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
