/**
 * Category classification for synced deals.
 *
 * Real-world data shapes differ per source:
 * - Lazada datafeeds ship a proper `cate` slug ("health_and_beauty").
 * - Tiki feeds ship an empty `cate`, TikTok chains are often empty — those are
 *   classified from the product title with the keyword rules below.
 * - Shopee offers carry marketing voucher categories like {category_name_show:
 *   "Other"} which are useless, so they fall back to title classification.
 *
 * Slugs are lowercase latin keys ("book", "fashion", …) so values stay
 * URL-friendly and comparable; `categoryFromSlug` maps a slug back to a
 * Vietnamese label + icon and humanizes anything unknown (e.g. TikTok
 * Vietnamese category names).
 */

import {
  type LucideIcon,
  Truck,
  ShoppingCart,
  Sparkles,
  HeartPulse,
  BookOpen,
  Smartphone,
  Shirt,
  House,
  Baby,
  Dumbbell,
  Car,
  PawPrint,
  Gamepad2,
  Gem,
  Wrench,
  TicketPercent,
  Tag,
} from "lucide-react";

export type CategoryInfo = { label: string; icon: LucideIcon; accent: string };

/** Tile styling utilities — full literal strings so Tailwind can scan them. */
const BRAND_ACCENT = "bg-gradient-to-br from-[#ee4d2d]/15 to-[#f97316]/10 text-[#ee4d2d]";

export type CategoryDef = CategoryInfo & { slug: string; match: RegExp };

/** Ordered — first hit wins. Covers Vietnamese + English keywords. */
const CATEGORIES: CategoryDef[] = [
  { slug: "freeship", label: "Freeship", icon: Truck, accent: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600", match: /\bfreeship|miễn phí (vận chuyển|ship)/i },
  { slug: "food", label: "Bách hóa & Ăn vặt", icon: ShoppingCart, accent: "bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600", match: /\bgrocery|\bsnacks?\b|\bfood\b|\bbánh|\bđồ ăn\b|thực phẩm|bách hóa/i },
  { slug: "beauty", label: "Làm đẹp & Chăm sóc", icon: Sparkles, accent: "bg-gradient-to-br from-pink-100 to-fuchsia-50 text-pink-500", match: /\bbeauty|\bcosmetic|\bmakeup|\bskincare\b|mỹ phẩm|\bson\b|\bkem\b|serum|mặt nạ|niacinamide|\bhealth_and_beauty\b|chăm sóc da|nước hoa|tắm trắng/i },
  { slug: "health", label: "Sức khỏe", icon: HeartPulse, accent: "bg-gradient-to-br from-rose-100 to-rose-50 text-rose-500", match: /\bhealth|medicine|supplement|vitamin|\bthuốc\b|glucosamine/i },
  { slug: "book", label: "Sách & Văn phòng phẩm", icon: BookOpen, accent: "bg-gradient-to-br from-indigo-100 to-sky-50 text-indigo-500", match: /\bbook|\bsách|văn phòng phẩm|toeic|ielts|toefl|\bsổ\b|vở/i },
  { slug: "electronics", label: "Điện tử & Công nghệ", icon: Smartphone, accent: "bg-gradient-to-br from-cyan-100 to-sky-50 text-cyan-600", match: /\belectr|phone|mobile|tablet|laptop|comput|điện thoại|tai nghe|\bsạc\b/i },
  { slug: "fashion", label: "Thời trang", icon: Shirt, accent: "bg-gradient-to-br from-violet-100 to-purple-50 text-violet-500", match: /\bfashion|apparel|clothing|\bshirt|t-?shirt|dress|\bjeans|\bgiày|\bquần|\báo\b|váy|vớ|thời trang|biti/i },
  { slug: "home", label: "Nhà cửa & Đời sống", icon: House, accent: "bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600", match: /\bhome|house|kitchen|furniture|chăn|gối|\bnhà\b|bếp|nồi|chảo/i },
  { slug: "baby", label: "Mẹ & Bé", icon: Baby, accent: "bg-gradient-to-br from-pink-100 to-rose-50 text-pink-500", match: /\bbaby|\bkids?\b|em bé|trẻ em|sữa bột|\bbỉm/i },
  { slug: "sports", label: "Thể thao", icon: Dumbbell, accent: "bg-gradient-to-br from-lime-100 to-green-50 text-lime-600", match: /\bsport|\bfitness|\bgym|yoga|\bbóng/i },
  { slug: "auto", label: "Ô tô & Xe máy", icon: Car, accent: "bg-gradient-to-br from-slate-200 to-zinc-50 text-slate-600", match: /\bauto|\bcar\b|motor|ô tô|xe máy|mũ bảo hiểm/i },
  { slug: "pet", label: "Thú cưng", icon: PawPrint, accent: "bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-700", match: /\bpets?\b|thú cưng|\bchó\b|\bmèo\b/i },
  { slug: "toys", label: "Đồ chơi & Game", icon: Gamepad2, accent: "bg-gradient-to-br from-fuchsia-100 to-purple-50 text-fuchsia-500", match: /\btoys?\b|\bgames?\b|đồ chơi|\blego\b/i },
  { slug: "jewelry", label: "Trang sức & Đồng hồ", icon: Gem, accent: "bg-gradient-to-br from-yellow-100 to-amber-50 text-yellow-600", match: /jewelry|\bwatch|đồng hồ|trang sức|\bvòng\b/i },
  { slug: "tools", label: "Dụng cụ", icon: Wrench, accent: "bg-gradient-to-br from-zinc-200 to-neutral-50 text-zinc-600", match: /\btools?\b|hardware|dụng cụ|\bkhoan\b/i },
  { slug: "voucher", label: "Mã & Voucher", icon: TicketPercent, accent: BRAND_ACCENT, match: /\bvoucher\b|coupon|mã giảm|khuyến mã|giảm \d|\d+\s*%/i },
];

/** Stable list for sitemap/static params and landing-page validation. */
export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

const FALLBACK_ICON: LucideIcon = Tag;

/** Keyword-based classification (for titles/names without real category data). */
export function classifyCategory(text: string | null | undefined): string | null {
  if (!text) return null;
  for (const cat of CATEGORIES) {
    if (cat.match.test(text)) return cat.slug;
  }
  return null;
}

const SLUG_INDEX = new Map(CATEGORIES.map((c) => [c.slug, c] as const));

const GENERIC_SLUGS = new Set(["other", "khác", "khac", "unknown", "misc"]);

/** Resolve a stored category value to a friendly label + lucide icon. */
export function categoryFromSlug(raw: string | null | undefined): CategoryInfo {
  const slug = raw?.trim();
  if (!slug) return { label: "Khác", icon: FALLBACK_ICON, accent: BRAND_ACCENT };
  const known = SLUG_INDEX.get(slug.toLowerCase());
  if (known) return { label: known.label, icon: known.icon, accent: known.accent };
  // Lazada-style compound slugs ("health_and_beauty") still hit keyword rules.
  for (const cat of CATEGORIES) {
    if (cat.match.test(slug) && !GENERIC_SLUGS.has(slug.toLowerCase())) {
      return { label: cat.label, icon: cat.icon, accent: cat.accent };
    }
  }
  if (GENERIC_SLUGS.has(slug.toLowerCase())) {
    return { label: "Khác", icon: FALLBACK_ICON, accent: BRAND_ACCENT };
  }
  // Unknown value — likely a Vietnamese category name (TikTok) → show as-is.
  if (/[^\x00-\x7F]/.test(slug)) {
    return { label: slug, icon: FALLBACK_ICON, accent: BRAND_ACCENT };
  }
  return {
    label: slug
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    icon: FALLBACK_ICON,
    accent: BRAND_ACCENT,
  };
}

/**
 * Accesstrade offer categories arrive loosely shaped: plain strings or objects
 * like Shopee's { category_name: "EC-29", category_name_show: "Other" }.
 * String(obj) would produce "[object Object]" rows in the DB — pick the most
 * displayable key explicitly and let the meaningless filter drop the rest.
 */
export function coerceCategory(value: unknown): string | null {
  if (typeof value === "string") {
    const s = value.trim();
    return s || null;
  }
  if (value != null && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    for (const key of [
      "category_name_show",
      "category_name",
      "name",
      "slug",
      "title",
      "label",
      "id",
    ]) {
      const v = rec[key];
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "number") return String(v);
    }
  }
  return null;
}

/** AT marketing buckets / internal codes that carry no product signal. */
const MEANINGLESS = /^(other|khác|khac|unknown|misc|ec-\d+)$/i;

/**
 * Choose the categories to store for a synced row. Stored values (Lazada
 * `cate`, TikTok chain names, coerced Shopee objects) are normalized through
 * the keyword rules into canonical slugs; if none hit, the title is
 * classified; if that also fails, unclassifiable non-Latin names are kept
 * verbatim instead of being dropped.
 */
export function pickCategorySlug(
  storedCate: string | string[] | null | undefined,
  title: string | null | undefined,
): string[] {
  const candidates = Array.isArray(storedCate) ? storedCate : storedCate ? [storedCate] : [];
  const meaningful = candidates.filter(
    (c): c is string =>
      typeof c === "string" && c.trim().length > 0 && !MEANINGLESS.test(c.trim()),
  );
  const slugs = new Set<string>();
  for (const c of meaningful) {
    const slug = classifyCategory(c);
    if (slug) slugs.add(slug);
  }
  if (slugs.size === 0) {
    const fromTitle = classifyCategory(title);
    if (fromTitle) slugs.add(fromTitle);
  }
  if (slugs.size === 0) {
    for (const c of meaningful) if (/[^\x00-\x7F]/.test(c)) slugs.add(c.trim());
  }
  return [...slugs].slice(0, 3);
}

/** Hand-picked slugs for footer quick-links (always render, data or not). */
export const FEATURED_CATEGORY_SLUGS = [
  "voucher",
  "freeship",
  "beauty",
  "fashion",
  "book",
  "electronics",
  "food",
  "home",
  "baby",
  "toys",
] as const;

/** Pill colors per marketplace (used by cards and section headers). */
export const MERCHANT_PILL_CLASS: Record<string, string> = {
  shopee: "bg-[#ee4d2d]/10 text-[#d73211]",
  tiki: "bg-sky-100 text-sky-700",
  lazada: "bg-blue-100 text-blue-700",
  tiktokshop: "bg-neutral-900 text-white",
};

export function merchantPillClass(merchant: string | null | undefined): string {
  return (merchant && MERCHANT_PILL_CLASS[merchant]) || "bg-neutral-200 text-neutral-700";
}
