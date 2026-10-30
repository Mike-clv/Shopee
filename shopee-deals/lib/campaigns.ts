/**
 * Sale-event banners (ngày đôi 5.5 / 10.10 / 11.11 ...).
 *
 * Static, code-owned promos: every card links to a real search-filter result
 * (so a click always lands on live deals, never a dead promo page). Gradients
 * are full literal strings so Tailwind can scan them.
 */

import {
  type LucideIcon,
  BadgePercent,
  Crown,
  Flame,
  Gift,
  PartyPopper,
  Rocket,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

export type SaleEvent = {
  id: string;
  /** Gregorian month (1-12) and day the sale lands on, Vietnam time. */
  month: number;
  day: number;
  badge: string;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
};

export const SALE_EVENTS: SaleEvent[] = [
  {
    id: "sale-1-1",
    month: 1,
    day: 1,
    badge: "SALE 1.1",
    title: "Siêu sale khai xuân 1/1",
    subtitle: "Khui deal đầu năm — voucher sàn + mã shop giảm sâu",
    href: "/tim-kiem",
    icon: PartyPopper,
    gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
  },
  {
    id: "sale-5-5",
    month: 5,
    day: 5,
    badge: "SALE 5.5",
    title: "Siêu sale ngày đôi 5/5",
    subtitle: "Deal giảm sâu giữa mùa — chớp mã nhanh tay",
    href: "/tim-kiem",
    icon: Gift,
    gradient: "bg-gradient-to-br from-[#7c3aed] to-[#4c1d95]",
  },
  {
    id: "sale-6-6",
    month: 6,
    day: 6,
    badge: "SALE 6.6",
    title: "Sale giữa năm 6/6",
    subtitle: "Mã sàn + mã shop cộng dồn giảm đến 50%",
    href: "/tim-kiem",
    icon: Sparkles,
    gradient: "bg-gradient-to-br from-[#0284c7] to-[#0c4a6e]",
  },
  {
    id: "sale-7-7",
    month: 7,
    day: 7,
    badge: "SALE 7.7",
    title: "Sale tháng 7 ngày 7/7",
    subtitle: "Freeship + voucher khủng cho đơn cuối tháng",
    href: "/tim-kiem",
    icon: Star,
    gradient: "bg-gradient-to-br from-[#f59e0b] to-[#92400e]",
  },
  {
    id: "sale-8-8",
    month: 8,
    day: 8,
    badge: "SALE 8.8",
    title: "Siêu sale 8/8",
    subtitle: "Giá sốc ngày đôi — săn mã trước khi hết",
    href: "/tim-kiem",
    icon: Flame,
    gradient: "bg-gradient-to-br from-[#dc2626] to-[#7f1d1d]",
  },
  {
    id: "sale-9-9",
    month: 9,
    day: 9,
    badge: "SALE 9.9",
    title: "Sale ngày đôi 9/9",
    subtitle: "Deal mới về liên tục — lần đầu giảm sâu",
    href: "/tim-kiem",
    icon: Rocket,
    gradient: "bg-gradient-to-br from-[#059669] to-[#064e3b]",
  },
  {
    id: "sale-10-10",
    month: 10,
    day: 10,
    badge: "SALE 10.10",
    title: "Siêu sale 10/10",
    subtitle: "Ngày đôi lớn — voucher sàn giảm đến 300K",
    href: "/tim-kiem",
    icon: Crown,
    gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
  },
  {
    id: "sale-11-11",
    month: 11,
    day: 11,
    badge: "SALE 11.11",
    title: "Cơn bão deal 11/11",
    subtitle: "Sale lớn nhất năm — mã sàn, mã shop, điểm x2",
    href: "/su-kien/11-11",
    icon: BadgePercent,
    gradient: "bg-gradient-to-br from-[#c026d3] to-[#701a75]",
  },
  {
    id: "sale-12-12",
    month: 12,
    day: 12,
    badge: "SALE 12.12",
    title: "Sale tổng kết năm 12/12",
    subtitle: "Chốt đơn cuối năm — deal giảm sâu nhất mùa",
    href: "/tim-kiem",
    icon: Zap,
    gradient: "bg-gradient-to-br from-[#1d4ed8] to-[#172554]",
  },
];

export type LiveSaleEvent = SaleEvent & {
  /** Days from today (Vietnam time) until the event; 0 = today, -1 = last day. */
  daysLeft: number;
  status: string;
};

/**
 * The `count` nearest sale events that have not finished (event day + 1, in
 * Vietnam time). Year-end wraps into the next year automatically, so the
 * promo slots always show real sale seasons.
 */
export function upcomingSaleEvents(
  now: Date = new Date(),
  count = 2,
): Array<LiveSaleEvent> {
  const vn = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // "YYYY-MM-DD"
  const [year, month, day] = vn.split("-").map(Number);
  const today = Date.UTC(year, month - 1, day);
  const DAY = 86_400_000;

  const candidates: Array<LiveSaleEvent> = [];
  for (const y of [year, year + 1]) {
    for (const event of SALE_EVENTS) {
      const diff = Math.round(
        (Date.UTC(y, event.month - 1, event.day) - today) / DAY,
      );
      if (diff < -1) continue; // finished more than a day ago
      candidates.push({
        ...event,
        daysLeft: diff,
        status:
          diff <= 0
            ? "ĐANG DIỄN RA"
            : diff === 1
              ? "CÒN 1 NGÀY"
              : `CÒN ${diff} NGÀY`,
      });
    }
  }
  candidates.sort((a, b) => a.daysLeft - b.daysLeft);
  return candidates.slice(0, count);
}
