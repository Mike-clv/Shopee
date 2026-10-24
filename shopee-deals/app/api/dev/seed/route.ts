import { revalidateTag } from "next/cache";
import { seedDemoDeals } from "@/lib/coupons/demo";
import { SITE } from "@/lib/site";

/**
 * DEV-ONLY seed for the demo coupons. Refuses in production build or when
 * DEMO_SEED is not explicitly set, so a prod deployment cannot be tampered
 * with accidentally.
 */
export async function POST() {
  if (process.env.NODE_ENV === "production" && process.env.DEMO_SEED !== "1") {
    return Response.json({ ok: false, error: "dev-only" }, { status: 403 });
  }

  const inserted = await seedDemoDeals();
  // Route Handler: expire immediately so the change is visible next request.
  revalidateTag(SITE.couponsTag, { expire: 0 });
  return Response.json({ ok: true, inserted });
}
