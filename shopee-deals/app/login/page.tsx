import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/lib/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-bold">Quản trị</h1>
        <p className="mb-4 text-sm text-neutral-500">
          Trang thương hiệu chỉ dành cho bạn.
        </p>
        <Suspense fallback={<p className="text-sm text-neutral-400">Tải…</p>}>
          <Gate>
            <LoginForm />
          </Gate>
        </Suspense>
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
