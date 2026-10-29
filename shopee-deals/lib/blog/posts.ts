/**
 * Blog content, stored in code (no CMS, no DB). Posts are plain data:
 * deterministic dates, no wall clock — the listing and detail pages stay
 * fully prerenderable under Cache Components.
 */

import {
  type LucideIcon,
  BadgePercent,
  BookOpen,
  ListChecks,
  Zap,
} from "lucide-react";

export type BlogBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "tip"; text: string }
  | { kind: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Static ISO date — deterministic, safe to render during prerender. */
  date: string;
  minutes: number;
  tag: { label: string; href: string };
  icon: LucideIcon;
  /** Full literal Tailwind gradient for the card cover. */
  gradient: string;
  /** Search-filter CTAs rendered in the detail page ticket box. */
  hintedCtas: { label: string; href: string }[];
  body: BlogBlock[];
};

const viDay = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function postDateLabel(iso: string): string {
  return viDay.format(new Date(iso));
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "stack-voucher-shopee-3-lop",
    title: "Stack voucher Shopee kiểu dân chuyên: cộng dồn 3 lớp giảm giá",
    excerpt:
      "Một đơn hàng có thể trừ tới ba lần: mã shop, mã sàn trong giỏ hàng và combo freeship. Đặt đúng thứ tự để không bỏ phí đồng nào.",
    date: "2026-10-18",
    minutes: 5,
    tag: { label: "Shopee", href: "/tim-kiem?merchant=shopee" },
    icon: BadgePercent,
    gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
    hintedCtas: [
      { label: "Voucher Shopee mới nhất", href: "/tim-kiem?merchant=shopee" },
      { label: "Mã freeship", href: "/tim-kiem?q=freeship" },
    ],
    body: [
      {
        kind: "p",
        text: "Đa số người mua nhập một mã rồi chịu thua, nhưng một đơn Shopee thực ra có thể trừ tới ba lần nếu biết chồng lớp ưu đãi. Đây là cách xếp thứ tự mà dân săn sale vẫn dùng.",
      },
      { kind: "h2", text: "Ba lớp giảm giá cộng dồn" },
      {
        kind: "list",
        items: [
          "Lớp 1 — mã của shop: dán ngay ở trang sản phẩm hoặc trang shop, giảm trực tiếp vào tiền hàng.",
          "Lớp 2 — mã/sàn áp ở giỏ hàng: Shopee gom những mã này ở khối “Ưu đãi trong giỏ hàng”, thường theo mốc đơn (100K, 300K…).",
          "Lớp 3 — combo freeship: chọn gói vận chuyển có mã freeship gắn theo, trừ tiền ship thay vì tiền hàng.",
        ],
      },
      {
        kind: "tip",
        text: "Kiểm tra dòng tổng cộng sau mỗi lần dán mã: nếu tổng giảm không đổi, mã vừa nhập đã bị lớp khác “chiếm chỗ” — bỏ lớp rẻ hơn để lấy lớp cao hơn.",
      },
      { kind: "h2", text: "Canh khung giờ điểm x1.5" },
      {
        kind: "p",
        text: "Vào các ngày đôi (1, 11, 15, 25), Shopee thường bật hệ số tính điểm hoặc mã sàn mạnh hơn. Nếu không mua gấp, hãy để giỏ hàng lại và canh đúng vòng mở mã lúc 0h hoặc 12h — mã to nhất luôn xuất hiện ở hai khung giờ này.",
      },
      {
        kind: "p",
        text: "Mẹo cuối: lưu mã trước khi thanh toán. Bạn không cần đoán ngày sale — chỉ cần một chỗ để chớp mã mới nhất ngay khi nó ra đời.",
      },
    ],
  },
  {
    slug: "chon-sach-thi-toeic-ielts",
    title: "Chọn sách thi Toeic/IELTS: so giá 3 sàn trong 2 phút",
    excerpt:
      "Cùng một bộ sách luyện thi, giá có thể lệch nhau cả trăm nghìn giữa các sàn. Quy trình bốn bước để mua đúng bản, đúng giá.",
    date: "2026-10-12",
    minutes: 4,
    tag: { label: "Sách & VPP", href: "/tim-kiem?cate=book" },
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-[#26364d] to-[#151f2d]",
    hintedCtas: [
      { label: "Deal sách đang giảm", href: "/tim-kiem?cate=book" },
      { label: "Deal Tiki", href: "/tim-kiem?merchant=tiki" },
    ],
    body: [
      {
        kind: "p",
        text: "Sách luyện thi là một trong những mặt hàng lệch giá nhiều nhất giữa các sàn — bản cùng nhà xuất bản nhưng nguồn nhập khác nhau. Nhất là bộ Toeic, IELTS luôn nằm trong deal Tiki và Shopee.",
      },
      { kind: "h2", text: "Quy trình bốn bước" },
      {
        kind: "list",
        items: [
          "Chốt đúng bộ bạn cần (kèm bản audio/CD nếu học listening) — tránh mua trùng vì deal rẻ.",
          "Lọc danh mục “Sách & Văn phòng phẩm” trên hệ thống mã giảm giá, để ý giá đã giảm sâu.",
          "So thêm mã cho mỗi sàn: Tiki thường mạnh về combo, Shopee về mã sàn trong ngày.",
          "Săn freeship trước khi thanh toán: với sách, phí ship có khi chiếm 10–15% giá bìa.",
        ],
      },
      {
        kind: "tip",
        text: "Bộ sách lẻ thường không đạt mốc voucher sàn — ghép thêm phụ kiện học (bút, sổ, flashcard) cho đủ 100K–200K rồi mới dán mã to.",
      },
      {
        kind: "p",
        text: "Lịch sale hàng tuần luôn có “học phẩm ngày đôi” hoặc sale đầu tháng — canh trước kỳ thi của bạn khoảng hai tuần để kịp giao và kịp hoàn trả nếu sai bản.",
      },
    ],
  },
  {
    slug: "tiktok-shop-nha-ban-uu-tien",
    title: "TikTok Shop: mua gì từ nhà bán hàng ưu tiên?",
    excerpt:
      "Phần lớn deal TikTok Shop đến từ nhà bán hàng được sàn ưu tiên. Dấu hiệu nhận biết đơn an toàn và cách bắt deal theo trend.",
    date: "2026-10-06",
    minutes: 3,
    tag: { label: "TikTok Shop", href: "/tim-kiem?merchant=tiktokshop" },
    icon: Zap,
    gradient: "bg-gradient-to-br from-[#242820] to-[#111310]",
    hintedCtas: [
      { label: "Deal TikTok Shop", href: "/tim-kiem?merchant=tiktokshop" },
      { label: "Làm đẹp & Chăm sóc", href: "/tim-kiem?cate=beauty" },
    ],
    body: [
      {
        kind: "p",
        text: "Deal trên TikTok Shop thường theo chu kỳ livestream: giảm sâu trong lúc phát sóng, về giá gốc ngay sau đó. Vì vậy quan trọng không phải “mua lúc nào”, mà là mua từ nhà bán hàng nào.",
      },
      { kind: "h2", text: "Ba dấu hiệu đơn an toàn" },
      {
        kind: "list",
        items: [
          "Nhà bán hàng có nhãn “ưu tiên” và số giao dịch tháng lớn — tỷ lệ sai hàng thấp hơn hẳn.",
          "Deal có mã giảm giá công khai (không phải giá “phồng rồi giảm”).",
          "Freeship Xtra hoặc mã combo ship — với đồ nhỏ, ship chiếm gần nửa đơn.",
        ],
      },
      {
        kind: "tip",
        text: "Deal theo trend có hạn ngắn thường chỉ 12–48 giờ. Nếu bạn dùng link chuyển hướng trên hệ thống mã giảm giá, luôn đúng cửa nhập sàn — không sợ vào nhầm link sai.",
      },
      {
        kind: "p",
        text: "Một tín hiệu tốt nữa: nhà bán ưu tiên thường có chính sách đổi trả rõ ràng, đọc được ngay trong tab sản phẩm — ưu tiên họ khi có hai deal cùng giá.",
      },
    ],
  },
  {
    slug: "kiem-tra-ma-truoc-het-han",
    title: "Đừng để mã ngủ quên trong kho: 5 phút kiểm tra cuối tuần",
    excerpt:
      "Routine cuối tuần: soát mã sắp hết hạn, deal giảm sâu nhất đêm ngày chủ nhật và làm sạch giỏ hàng để tuần mới bắt đầu trôi chảy.",
    date: "2026-09-28",
    minutes: 4,
    tag: { label: "Mẹo tổng hợp", href: "/tim-kiem" },
    icon: ListChecks,
    gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
    hintedCtas: [
      { label: "Deal mới nhất theo HSD", href: "/tim-kiem?sort=moi-nhat" },
      { label: "Giảm sâu nhất", href: "/tim-kiem?sort=giam-sau" },
    ],
    body: [
      {
        kind: "p",
        text: "Săn deal không cần dành mỗi ngày một giờ — chỉ cần một routine 5 phút cuối tuần. Làm đúng, bạn luôn có sẵn mã cho đơn hàng phát sinh trong tuần, thay vì săn gấp lúc 0h.",
      },
      { kind: "h2", text: "Năm bước kiểm tra" },
      {
        kind: "list",
        items: [
          "Mở bộ lọc “Mới nhất” — deal mới về thường đi kèm hạn dài hơn.",
          "Lướt “Giảm sâu nhất” một lượt: mức -50% thường chỉ tồn tại đến chủ nhật.",
          "Chấm dứt bằng phân loại “Mã & Voucher” — các mã sàn luôn hạn ngắn nhất.",
          "Note lại 1–2 mã dùng được cho mọi đơn (loại freeship, min-max cao) để giữ bên cạnh.",
          "Đặt giỏ hàng dở dang theo mốc 100K/300K — để chờ ngày đôi dán mã to.",
        ],
      },
      {
        kind: "tip",
        text: "Nếu thấy mã hết hạn ngay sau khi dán, thử lại cùng mã vào vòng refresh khác — nhiều sàn reset lại quỹ mã theo từng khung giờ.",
      },
      {
        kind: "p",
        text: "Routine này gọn hơn cả việc dựng bảng tính: hệ thống mã giảm giá đã xếp HSD sẵn, bạn chỉ cần soát và giữ lại mã nào xài được.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function postUrl(slug: string): string {
  return `/blog/${slug}`;
}
