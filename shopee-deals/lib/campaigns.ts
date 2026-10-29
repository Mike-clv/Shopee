/**
 * Marketing campaign banners.
 *
 * Static, code-owned promos: every banner links to a real search-filter
 * result (so a click always lands on live deals, never a dead promo page).
 * Gradients are full literal strings so Tailwind can scan them.
 */

import {
  type LucideIcon,
  BadgePercent,
  BookOpen,
  Gamepad2,
  Truck,
  Zap,
} from "lucide-react";

export type Campaign = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "freeship",
    badge: "FREESHIP",
    title: "Vận chuyển 0đ toàn sàn",
    subtitle: "Săn mã miễn phí vận chuyển cho mọi đơn hàng",
    href: "/tim-kiem?q=freeship",
    icon: Truck,
    gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
  },
  {
    id: "shopee-11-11",
    badge: "11.11 SALE",
    title: "Voucher Shopee đến 300K",
    subtitle: "Cộng dồn mã sàn, mã shop cùng điểm x1.5",
    href: "/tim-kiem?merchant=shopee",
    icon: BadgePercent,
    gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
  },
  {
    id: "exam-books",
    badge: "MÙA THI",
    title: "Sách Toeic • IELTS giảm sâu",
    subtitle: "Giá sách đã rẻ — cộng thêm voucher sàn nữa",
    href: "/tim-kiem?cate=book",
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-[#26364d] to-[#151f2d]",
  },
  {
    id: "toys-weekend",
    badge: "CUỐI TUẦN",
    title: "Đồ chơi & Game sale",
    subtitle: "Lego, board game, phụ kiện console theo mã",
    href: "/tim-kiem?cate=toys",
    icon: Gamepad2,
    gradient: "bg-gradient-to-br from-[#4a3245] to-[#261a24]",
  },
  {
    id: "tiktok-trend",
    badge: "TREND",
    title: "Deal TikTok Shop theo trend",
    subtitle: "Giá nhà sản xuất — hạn ngắn, chớp nhanh",
    href: "/tim-kiem?merchant=tiktokshop",
    icon: Zap,
    gradient: "bg-gradient-to-br from-[#242820] to-[#111310]",
  },
];
