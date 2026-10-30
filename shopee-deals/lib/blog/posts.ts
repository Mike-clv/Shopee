/**
 * Blog content, stored in code (no CMS, no DB). Posts are plain data:
 * deterministic dates, no wall clock — the listing and detail pages stay
 * fully prerenderable under Cache Components.
 */

import {
  type LucideIcon,
  BadgePercent,
  BookOpen,
  CalendarDays,
  ListChecks,
  Timer,
  Truck,
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
    slug: "ma-giam-gia-shopee-hom-nay",
    title: "Mã giảm giá Shopee hôm nay: cách kiểm tra mã còn sống trước khi mua",
    excerpt:
      "Mã được đăng công khai không có nghĩa vẫn dùng được. Bốn bước kiểm tra trước khi thanh toán giúp bạn không mất thời gian thử từng mã.",
    date: "2026-10-29",
    minutes: 5,
    tag: { label: "Shopee", href: "/san/shopee" },
    icon: BadgePercent,
    gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
    hintedCtas: [
      { label: "Mã Shopee đang chạy", href: "/san/shopee" },
      { label: "Voucher mới nhất", href: "/danh-muc/voucher" },
      { label: "Mã freeship", href: "/danh-muc/freeship" },
    ],
    body: [
      {
        kind: "p",
        text: "Một mã giảm giá Shopee có thể hết lượt trong vài phút, đổi điều kiện giữa chừng hoặc chỉ áp dụng cho một nhóm tài khoản. Vì vậy, việc nhìn thấy mã trên một trang tổng hợp chưa đủ để kết luận mã còn dùng được hôm nay.",
      },
      { kind: "h2", text: "Bốn bước kiểm tra một mã Shopee" },
      {
        kind: "list",
        items: [
          "Đọc điều kiện ngay dưới mã: giá trị đơn tối thiểu, danh mục, phương thức thanh toán và đối tượng áp dụng.",
          "Thêm đúng sản phẩm vào giỏ hàng rồi mới dán mã — nhiều mã chỉ hiện hoặc chỉ áp dụng khi giỏ đã đủ điều kiện.",
          "Thử lần lượt mã shop, mã sàn và mã freeship; xem dòng tổng thanh toán sau mỗi lần dán thay vì chỉ nhìn nhãn giảm giá.",
          "Nếu mã báo không hợp lệ, bỏ mã có giá trị thấp hơn rồi thử lại — một số chương trình không cho cộng dồn cùng lúc.",
        ],
      },
      {
        kind: "tip",
        text: "Đừng mua thêm món không cần chỉ để đạt mức giảm. Hãy so số tiền tiết kiệm thực tế với phần phát sinh; nếu mua thêm 50K để giảm 30K thì bạn đang lỗ.",
      },
      { kind: "h2", text: "Dấu hiệu mã đã hết hiệu lực" },
      {
        kind: "list",
        items: [
          "Mã báo đã hết lượt hoặc hết hạn dù vẫn hiển thị trên trang tổng hợp.",
          "Mã chỉ dành cho người dùng mới, hạng thành viên hoặc phương thức thanh toán cụ thể.",
          "Mã không áp dụng cho danh mục đang mua, dù đơn đã đủ giá trị tối thiểu.",
          "Tổng tiền không đổi sau khi dán — mã đã bị lớp ưu đãi khác thay thế.",
        ],
      },
      {
        kind: "p",
        text: "Cách nhanh nhất là bắt đầu từ trang sàn hoặc danh mục đang có deal, sau đó kiểm tra lại mã ở bước thanh toán. Danh sách chỉ giúp bạn thu hẹp lựa chọn; quyết định cuối cùng vẫn là điều kiện hiển thị trên Shopee tại thời điểm mua.",
      },
    ],
  },
  {
    slug: "voucher-freeship-shopee-khong-ap-duoc",
    title: "Voucher freeship Shopee không áp dụng được: 6 nguyên nhân thường gặp",
    excerpt:
      "Đủ điều kiện hay không phụ thuộc đơn tối thiểu, khu vực, đơn vị vận chuyển và hạn mức tài khoản. Kiểm tra đúng thứ tự để không bỏ phí mã.",
    date: "2026-10-28",
    minutes: 4,
    tag: { label: "Freeship", href: "/danh-muc/freeship" },
    icon: Truck,
    gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
    hintedCtas: [
      { label: "Deal freeship", href: "/danh-muc/freeship" },
      { label: "Deal Shopee", href: "/san/shopee" },
    ],
    body: [
      {
        kind: "p",
        text: "Voucher freeship là loại mã dễ bị từ chối nhất khi thanh toán, vì điều kiện của nó thay đổi theo đơn hàng, khu vực và đơn vị giao. Sáu nguyên nhân dưới đây giải thích phần lớn các trường hợp mã không áp dụng được.",
      },
      { kind: "h2", text: "Sáu nguyên nhân thường gặp" },
      {
        kind: "list",
        items: [
          "Đơn chưa đạt giá trị tối thiểu sau khi trừ mã shop — hãy kiểm tra mốc tính trên tổng tiền hàng, không phải tổng sau giảm.",
          "Sản phẩm thuộc danh mục hoặc shop không tham gia chương trình freeship.",
          "Địa chỉ giao hàng hoặc đơn vị vận chuyển không nằm trong phạm vi áp dụng.",
          "Phương thức thanh toán chưa đúng — một số mã chỉ hỗ trợ ví hoặc thẻ nhất định.",
          "Tài khoản đã dùng hết hạn mức freeship trong tháng hoặc không thuộc nhóm được ưu tiên.",
          "Mã đã hết lượt, hết hạn hoặc không còn trong quỹ mã của sàn.",
        ],
      },
      {
        kind: "tip",
        text: "Nếu thiếu vài nghìn để đạt mốc freeship, hãy thêm một món nhỏ thật sự cần dùng. Đừng thêm món chỉ để đủ điều kiện nếu phí ship tiết kiệm được thấp hơn giá món đó.",
      },
      { kind: "h2", text: "Thứ tự áp mã nên thử" },
      {
        kind: "list",
        items: [
          "Áp mã của shop trước để biết giá trị đơn còn lại.",
          "Áp mã sàn hoặc mã danh mục ở giỏ hàng.",
          "Chọn freeship sau cùng và kiểm tra lại phí giao hàng ở bước thanh toán.",
        ],
      },
      {
        kind: "p",
        text: "Mỗi lần đổi mã, hãy nhìn tổng tiền cuối cùng thay vì số tiền giảm trên nhãn. Một mã freeship nhỏ vẫn có thể tốt hơn mã giảm hàng lớn nhưng bị tính phí ship cao.",
      },
    ],
  },
  {
    slug: "mua-sach-tiki-gia-tot",
    title: "Mua sách Tiki giá tốt: so giá và chồng mã trong 3 bước",
    excerpt:
      "Sách cùng tựa có thể lệch giá giữa bản bìa mềm, bìa cứng và nhà bán. Cách chọn đúng bản, đủ điều kiện freeship và không mua trùng.",
    date: "2026-10-26",
    minutes: 4,
    tag: { label: "Sách & VPP", href: "/danh-muc/book" },
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-[#26364d] to-[#151f2d]",
    hintedCtas: [
      { label: "Deal sách đang giảm", href: "/danh-muc/book" },
      { label: "Deal Tiki", href: "/san/tiki" },
    ],
    body: [
      {
        kind: "p",
        text: "Sách là nhóm hàng dễ mua nhầm bản nhất: cùng tên nhưng khác nhà xuất bản, khác năm tái bản, khác bìa hoặc khác bộ. Giá rẻ chỉ có ý nghĩa khi bạn mua đúng cuốn mình cần.",
      },
      { kind: "h2", text: "Bước 1 — chốt đúng bản sách" },
      {
        kind: "p",
        text: "Kiểm tra tên tác giả, nhà xuất bản, năm xuất bản và mã ISBN nếu có. Với sách luyện thi, xác nhận bản có audio hoặc đáp án đi kèm; với sách bộ, kiểm tra số tập và tình trạng còn đủ bộ.",
      },
      { kind: "h2", text: "Bước 2 — so giá và điều kiện freeship" },
      {
        kind: "list",
        items: [
          "So cùng một bản sách giữa Tiki và các sàn khác, không so bìa mềm với bìa cứng.",
          "Xem giá sau khi trừ mã, cộng phí ship và kiểm tra thời gian giao.",
          "Tận dụng combo hoặc mua theo bộ nếu bạn chắc chắn dùng hết, thay vì mua lẻ nhiều lần.",
          "Kiểm tra chính sách đổi trả nếu sách có kèm đĩa, mã kích hoạt hoặc phụ kiện.",
        ],
      },
      {
        kind: "tip",
        text: "Với sách luyện thi, đừng mua bản quá cũ chỉ vì rẻ. Cấu trúc đề và nội dung có thể đã thay đổi; hãy kiểm tra kỹ năm tái bản so với kỳ thi của bạn.",
      },
      { kind: "h2", text: "Bước 3 — kiểm tra trước khi bấm mua" },
      {
        kind: "p",
        text: "Đọc kỹ mô tả tình trạng sách, đánh giá người bán và phí giao hàng. Nếu mua từ nhà bán bên thứ ba, thời gian giao và chính sách đổi trả có thể khác với Tiki; hãy xác nhận trước khi thanh toán.",
      },
    ],
  },
  {
    slug: "lazada-flash-sale-khung-gio",
    title: "Lazada flash sale: khung giờ nào đáng canh và cách giữ giá",
    excerpt:
      "Flash sale Lazada thường mở theo khung giờ và số lượng giới hạn. Chuẩn bị trước để không mua nhầm giá hoặc mất mã ở bước thanh toán.",
    date: "2026-10-24",
    minutes: 5,
    tag: { label: "Lazada", href: "/san/lazada" },
    icon: Timer,
    gradient: "bg-gradient-to-br from-[#123a6b] to-[#0a2342]",
    hintedCtas: [
      { label: "Deal Lazada", href: "/san/lazada" },
      { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
    ],
    body: [
      {
        kind: "p",
        text: "Flash sale không phải lúc nào cũng là mức giá tốt nhất, nhưng nếu đúng món và đúng khung giờ, bạn có thể tiết kiệm đáng kể. Điều quan trọng là chuẩn bị trước thay vì mở app đúng lúc sale bắt đầu.",
      },
      { kind: "h2", text: "Flash sale vận hành theo khung giờ" },
      {
        kind: "p",
        text: "Lazada thường chia flash sale thành nhiều khung trong ngày, mỗi khung có số lượng và mức giảm riêng. Một số món chỉ giảm sâu ở khung đầu, sau đó trở về giá gần gốc. Hãy xem lịch khung giờ và chọn món bạn thực sự cần, không chạy theo mọi khung.",
      },
      { kind: "h2", text: "Chuẩn bị trước khung giờ" },
      {
        kind: "list",
        items: [
          "Thêm sản phẩm vào giỏ và kiểm tra biến thể, kích thước, màu trước ngày sale.",
          "Lưu địa chỉ giao hàng và phương thức thanh toán để không mất thời gian nhập.",
          "Ghi lại giá trước sale để biết mức giảm có thật hay chỉ là giá niêm yết bị đẩy lên.",
          "Kiểm tra mã giảm giá và điều kiện áp dụng trước khi khung giờ mở.",
          "Đọc chính sách đổi trả, bảo hành và thời gian giao hàng của người bán.",
        ],
      },
      {
        kind: "tip",
        text: "Nếu món bạn cần không giảm trong khung hiện tại, đừng mua món khác chỉ vì đang sale. Hãy chờ khung sau hoặc so sang sàn khác; flash sale là cơ hội, không phải nghĩa vụ.",
      },
      {
        kind: "p",
        text: "Trước khi bấm đặt hàng, kiểm tra lại tổng tiền gồm giá, phí ship và mã đã áp. Một mức giảm lớn nhưng phí ship cao hoặc thời gian giao quá lâu có thể không còn là deal tốt.",
      },
    ],
  },
  {
    slug: "tiktok-shop-livestream-gia-that",
    title: "TikTok Shop livestream: khi nào giá giảm thật?",
    excerpt:
      "Giá livestream có thể thấp hơn nhưng cũng dễ bị đẩy bởi quà tặng và combo. Cách kiểm tra giá thật, người bán và chính sách đổi trả.",
    date: "2026-10-22",
    minutes: 4,
    tag: { label: "TikTok Shop", href: "/san/tiktokshop" },
    icon: Zap,
    gradient: "bg-gradient-to-br from-[#242820] to-[#111310]",
    hintedCtas: [
      { label: "Deal TikTok Shop", href: "/san/tiktokshop" },
      { label: "Làm đẹp & Chăm sóc", href: "/danh-muc/beauty" },
    ],
    body: [
      {
        kind: "p",
        text: "Livestream TikTok Shop tạo cảm giác khẩn cấp: mã chỉ trong vài phút, quà tặng giới hạn, số lượng còn ít. Nhưng giá hiển thị trong livestream không phải lúc nào cũng là giá tốt nhất nếu bạn không so đúng cách.",
      },
      { kind: "h2", text: "Ba con số cần so trước khi chốt" },
      {
        kind: "list",
        items: [
          "Giá trên trang sản phẩm ngoài livestream — đây là mốc so sánh cơ bản nhất.",
          "Tổng tiền sau khi cộng phí ship và trừ voucher, không chỉ giá hiển thị trên màn hình.",
          "Giá trên sàn khác cho cùng sản phẩm, cùng dung tích hoặc cùng bộ phụ kiện.",
        ],
      },
      { kind: "h2", text: "Đừng để livestream ép mua" },
      {
        kind: "p",
        text: "Trước khi mua, kiểm tra đánh giá người bán, số lượng đã bán, chính sách đổi trả và thông tin sản phẩm. Với mỹ phẩm, thực phẩm bổ sung hoặc đồ cho bé, hãy xem thành phần, hạn dùng và nguồn gốc kỹ hơn giá.",
      },
      {
        kind: "tip",
        text: "Nếu bạn không chắc món đó có thật sự cần, hãy thoát livestream và quay lại sau 10 phút. Cảm giác khẩn cấp thường giảm đi rất nhiều khi bạn không còn nghe thông báo liên tục.",
      },
      {
        kind: "p",
        text: "Deal livestream có thể rất tốt, nhưng chỉ khi sản phẩm phù hợp và người bán đáng tin. Đừng đổi chất lượng lấy mức giảm vài chục nghìn.",
      },
    ],
  },
  {
    slug: "chuan-bi-sale-11-11",
    title: "Chuẩn bị sale 11.11: 7 việc nên làm trước ngày sale",
    excerpt:
      "Đừng đợi đến 0h mới mở app. Danh sách việc cần làm trước 11.11 để chốt đúng món, đúng mã và không mua vì giảm giá.",
    date: "2026-10-20",
    minutes: 6,
    tag: { label: "Mã & Voucher", href: "/danh-muc/voucher" },
    icon: CalendarDays,
    gradient: "bg-gradient-to-br from-[#5b3a0e] to-[#352208]",
    hintedCtas: [
      { label: "Voucher mới nhất", href: "/danh-muc/voucher" },
      { label: "Deal Shopee", href: "/san/shopee" },
      { label: "Deal Lazada", href: "/san/lazada" },
    ],
    body: [
      {
        kind: "p",
        text: "Sale 11.11 chỉ thật sự có lợi nếu bạn biết mình cần gì trước khi mã và giá thay đổi. Chuẩn bị từ một tuần giúp bạn tránh mua theo cảm xúc và giảm thời gian thử mã trong đêm sale.",
      },
      { kind: "h2", text: "Bảy việc nên làm trước 11.11" },
      {
        kind: "list",
        items: [
          "Lập danh sách món thật sự cần, kèm mức giá tối đa bạn sẵn sàng trả cho từng món.",
          "Kiểm tra giá trước sale để nhận ra mức giảm thật, tránh giá bị đẩy lên rồi hạ xuống.",
          "Thêm sản phẩm vào giỏ và chọn đúng biến thể, kích thước, màu sắc.",
          "Lưu địa chỉ giao hàng và phương thức thanh toán trước ngày sale.",
          "Theo dõi mã của sàn, mã shop và freeship; ghi lại điều kiện đơn tối thiểu.",
          "So sánh cùng món giữa các sàn thay vì chỉ tin nhãn giảm giá trên một sàn.",
          "Đặt giới hạn ngân sách và kiểm tra lại giỏ hàng trước khi bấm thanh toán.",
        ],
      },
      {
        kind: "tip",
        text: "Đừng dùng hết mã chỉ vì mã sắp hết hạn. Một mã giảm 20K cho món 500K không đáng nếu bạn không cần món đó; tiết kiệm thật nằm ở việc không mua thứ không dùng.",
      },
      { kind: "h2", text: "Sau khi chốt đơn" },
      {
        kind: "p",
        text: "Lưu lại ảnh chụp giá, mã đã áp và tổng tiền thanh toán để đối chiếu nếu đơn bị sai. Kiểm tra thời gian giao trước khi mua quà hoặc đồ cần dùng gấp, vì sale lớn thường kéo theo thời gian xử lý lâu hơn.",
      },
    ],
  },
  {
    slug: "stack-voucher-shopee-3-lop",
    title: "Stack voucher Shopee kiểu dân chuyên: cộng dồn 3 lớp giảm giá",
    excerpt:
      "Một đơn hàng có thể trừ tới ba lần: mã shop, mã sàn trong giỏ hàng và combo freeship. Đặt đúng thứ tự để không bỏ phí đồng nào.",
    date: "2026-10-18",
    minutes: 5,
    tag: { label: "Shopee", href: "/san/shopee" },
    icon: BadgePercent,
    gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
    hintedCtas: [
      { label: "Voucher Shopee mới nhất", href: "/san/shopee" },
      { label: "Mã freeship", href: "/danh-muc/freeship" },
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
    tag: { label: "Sách & VPP", href: "/danh-muc/book" },
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-[#26364d] to-[#151f2d]",
    hintedCtas: [
      { label: "Deal sách đang giảm", href: "/danh-muc/book" },
      { label: "Deal Tiki", href: "/san/tiki" },
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
    tag: { label: "TikTok Shop", href: "/san/tiktokshop" },
    icon: Zap,
    gradient: "bg-gradient-to-br from-[#242820] to-[#111310]",
    hintedCtas: [
      { label: "Deal TikTok Shop", href: "/san/tiktokshop" },
      { label: "Làm đẹp & Chăm sóc", href: "/danh-muc/beauty" },
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
    tag: { label: "Mẹo tổng hợp", href: "/danh-muc/voucher" },
    icon: ListChecks,
    gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
    hintedCtas: [
      { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
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

/** Blog posts whose tag or CTA points at a merchant landing page. */
export function postsForMerchant(merchant: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) =>
      post.tag.href === `/san/${merchant}` ||
      post.hintedCtas.some((cta) => cta.href === `/san/${merchant}`),
  ).slice(0, limit);
}

/** Blog posts whose tag or CTA points at a category landing page. */
export function postsForCategory(category: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) =>
      post.tag.href === `/danh-muc/${category}` ||
      post.hintedCtas.some((cta) => cta.href === `/danh-muc/${category}`),
  ).slice(0, limit);
}

/**
 * Pick a short reading list for a deal. Merchant matches come first, then
 * category matches; unknown deals fall back to the newest posts.
 */
export function postsForDeal(
  deal: { merchant?: string | null; category?: string | null },
  limit = 2,
): BlogPost[] {
  const picks: BlogPost[] = [];
  const add = (post: BlogPost) => {
    if (!picks.some((item) => item.slug === post.slug)) picks.push(post);
  };

  if (deal.merchant) postsForMerchant(deal.merchant, limit).forEach(add);
  if (deal.category) postsForCategory(deal.category, limit).forEach(add);

  return picks.length > 0 ? picks.slice(0, limit) : BLOG_POSTS.slice(0, limit);
}

export function postUrl(slug: string): string {
  return `/blog/${slug}`;
}
