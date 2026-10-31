import { ListChecks } from "lucide-react";
import type { BlogPost } from "../post-types";

export const routinePost: BlogPost = {
  slug: "kiem-tra-ma-truoc-het-han",
  title: "Đừng để mã ngủ quên: routine 5 phút kiểm tra voucher cuối tuần",
  excerpt:
    "Một routine ngắn mỗi cuối tuần giúp bạn nhận ra mã sắp hết hạn, dọn giỏ hàng và chuẩn bị cho đơn tiếp theo mà không phải săn gấp lúc 0h.",
  date: "2026-09-28",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "Mẹo tổng hợp", href: "/danh-muc/voucher" },
  icon: ListChecks,
  gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
  cover: {
    src: "/images/blog/kiem-tra-ma-truoc-het-han.svg",
    alt: "Minh họa routine 5 phút kiểm tra voucher và giỏ hàng cuối tuần",
    width: 1200,
    height: 630,
    caption:
      "Kiểm tra ngắn mỗi tuần giúp bạn bỏ mã hết hạn và giữ lại mã thật sự dùng được.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
    { label: "Giảm sâu nhất", href: "/tim-kiem?sort=giam-sau" },
    { label: "Deal Shopee", href: "/san/shopee" },
  ],
  faqs: [
    {
      question: "Bao lâu nên kiểm tra voucher một lần?",
      answer:
        "Với người mua thường xuyên, một lần mỗi cuối tuần là đủ để bắt kịp mã sắp hết hạn và deal mới. Nếu bạn đang chuẩn bị cho đợt sale lớn, có thể kiểm tra thêm một lần giữa tuần. Điều quan trọng là giữ routine ngắn, không biến việc săn mã thành công việc hàng ngày.",
    },
    {
      question: "Có nên lưu tất cả mã nhìn thấy không?",
      answer:
        "Không. Chỉ nên lưu mã có điều kiện phù hợp với nhu cầu và có khả năng dùng trong thời gian tới. Lưu quá nhiều mã khiến bạn khó theo dõi hạn và dễ mua thêm món không cần để đạt điều kiện.",
    },
    {
      question: "Mã đã hết hạn có thể dùng lại không?",
      answer:
        "Thường không. Một số chương trình có thể mở lại cùng nội dung nhưng với mã mới, nhưng mã cũ không nên được coi là còn hiệu lực. Hãy kiểm tra trang voucher hoặc thử ở bước thanh toán; nếu báo hết hạn, bỏ qua.",
    },
    {
      question: "Có nên giữ mã cho đợt sale lớn?",
      answer:
        "Chỉ nên giữ nếu bạn chắc chắn sẽ mua trong thời gian mã còn hiệu lực và điều kiện không thay đổi. Nếu món cần dùng trước đợt sale, đừng trì hoãn chỉ để chờ mã. Hãy so lợi ích của việc chờ với chi phí thời gian.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Săn mã giảm giá không cần dành mỗi ngày một giờ. Phần lớn thời gian bị mất không phải vì thiếu mã, mà vì mã đã hết hạn, không đúng danh mục hoặc không còn phù hợp với giỏ hàng. Một routine 5 phút mỗi cuối tuần giúp bạn kiểm tra lại mọi thứ trước khi bắt đầu tuần mới.",
    },
    {
      kind: "p",
      text: "Routine này không hứa hẹn tìm được mã tốt nhất. Mục tiêu là loại bỏ mã không dùng được, ghi lại vài lựa chọn phù hợp và dọn giỏ hàng để lần mua tiếp theo nhanh hơn. Bạn có thể điều chỉnh thời gian theo lịch cá nhân.",
    },
    { kind: "h2", text: "Vì sao cần kiểm tra định kỳ?" },
    {
      kind: "p",
      text: "Voucher có hạn sử dụng và số lượng giới hạn. Một mã có thể biến mất trước hạn ghi trên trang nếu đã hết lượt phát. Nếu bạn chỉ kiểm tra khi cần mua gấp, khả năng gặp mã lỗi hoặc hết hạn sẽ cao hơn. Kiểm tra định kỳ giúp bạn biết mã nào còn thật sự khả dụng.",
    },
    {
      kind: "p",
      text: "Ngoài ra, giá và chương trình thay đổi liên tục. Một món bạn theo dõi tuần trước có thể đã hết deal hoặc có mã mới. Kiểm tra lại giúp bạn tránh mua theo thông tin cũ và tránh cảm giác tiếc khi bỏ lỡ.",
    },
    { kind: "h2", text: "Năm bước trong năm phút" },
    {
      kind: "p",
      text: "Bước một: mở danh sách voucher và lọc theo “mới nhất” để xem chương trình vừa cập nhật. Bước hai: xem nhóm “giảm sâu nhất” một lượt, nhưng chỉ ghi lại món thật sự cần. Bước ba: kiểm tra mã sắp hết hạn và bỏ những mã không còn phù hợp.",
    },
    {
      kind: "p",
      text: "Bước bốn: mở giỏ hàng, xóa món không còn cần và kiểm tra biến thể. Bước năm: ghi lại một hoặc hai mã có điều kiện rõ ràng để dùng cho đơn tiếp theo. Toàn bộ quá trình nên dừng ở mức vài phút; nếu kéo dài, bạn dễ bị cuốn vào việc duyệt deal không mục tiêu.",
    },
    {
      kind: "list",
      items: [
        "Lọc voucher mới nhất và ghi lại chương trình phù hợp.",
        "Xem nhóm giảm sâu nhưng không thêm món ngoài nhu cầu.",
        "Kiểm tra hạn và điều kiện của mã đã lưu.",
        "Dọn giỏ hàng, xóa món không còn cần.",
        "Ghi chú một hai mã dùng được cho tuần tới.",
      ],
    },
    {
      kind: "table",
      caption: "Loại voucher và cách kiểm tra nhanh",
      headers: ["Loại voucher", "Hạn thường gặp", "Cách kiểm tra"],
      rows: [
        [
          "Mã sàn theo mốc đơn",
          "Ngắn, theo ngày hoặc khung giờ",
          "Xem mốc đơn, danh mục và số lượt còn lại",
        ],
        [
          "Mã shop",
          "Theo chương trình của shop",
          "Kiểm tra sản phẩm áp dụng và hạn trong trang shop",
        ],
        [
          "Freeship",
          "Theo ngày hoặc theo tháng",
          "Kiểm tra khu vực, đơn vị vận chuyển và hạn mức tài khoản",
        ],
        [
          "Ưu đãi thanh toán",
          "Theo ngân hàng hoặc ví",
          "Xem điều kiện thẻ, số lần và thời gian áp dụng",
        ],
      ],
    },
    { kind: "h2", text: "Dọn giỏ hàng để không mua nhầm" },
    {
      kind: "p",
      text: "Giỏ hàng là nơi dễ tích tụ món không cần nhất. Mỗi tuần, hãy xóa những món bạn đã hết nhu cầu hoặc đã mua ở nơi khác. Kiểm tra lại biến thể, số lượng và người bán. Một món nằm lâu trong giỏ có thể khiến bạn mua vì tiếc công chờ chứ không vì cần.",
    },
    {
      kind: "p",
      text: "Nếu bạn đang chờ sale cho một món cụ thể, hãy ghi mức giá hợp lý bên cạnh. Khi giá xuống dưới mức đó, bạn có thể chốt; nếu không, tiếp tục chờ mà không mua món khác để bù. Cách này giúp giỏ hàng phản ánh nhu cầu thật.",
    },
    { kind: "h2", text: "Ghi chú mã sao cho hữu ích" },
    {
      kind: "p",
      text: "Khi lưu mã, hãy ghi kèm ba thông tin: điều kiện đơn tối thiểu, danh mục áp dụng và hạn sử dụng. Chỉ lưu mã nếu bạn có khả năng dùng trong thời gian tới. Mã đã lưu nhưng không có món phù hợp chỉ làm bạn thêm phân vân.",
    },
    {
      kind: "p",
      text: "Không chia sẻ mã gắn với tài khoản cá nhân cho người khác. Mã công khai trên trang khuyến mãi thì có thể dùng theo điều kiện, nhưng mã cá nhân có thể bị giới hạn hoặc vi phạm điều khoản nếu dùng sai. Bảo mật tài khoản vẫn quan trọng hơn việc tiết kiệm vài nghìn.",
    },
    { kind: "h2", text: "Khi nào nên bỏ mã" },
    {
      kind: "p",
      text: "Hãy bỏ mã nếu điều kiện của nó khiến bạn phải mua thêm món không cần, nếu mã chỉ giảm một khoản nhỏ so với thời gian bỏ ra, hoặc nếu mã không còn phù hợp với danh mục bạn đang mua. Một đơn không mã nhưng đúng nhu cầu vẫn tốt hơn một đơn có mã nhưng phát sinh.",
    },
    {
      kind: "tip",
      text: "Nếu thấy mã hết hạn ngay sau khi dán, đừng nhập lại nhiều lần. Hãy kiểm tra xem có chương trình thay thế cùng loại không, hoặc bỏ qua và mua khi thật sự cần.",
    },
    { kind: "h2", text: "Mẫu routine chủ nhật" },
    {
      kind: "p",
      text: "Bạn có thể chia 5 phút thành các mốc: 1 phút xem voucher mới, 1 phút kiểm tra mã sắp hết hạn, 1 phút dọn giỏ hàng, 1 phút ghi chú mã phù hợp và 1 phút lên kế hoạch mua trong tuần. Đặt một khung giờ cố định để biến việc này thành thói quen thay vì phụ thuộc vào trí nhớ.",
    },
    {
      kind: "p",
      text: "Sau vài tuần, bạn sẽ biết nhóm hàng nào thường có mã phù hợp và thời điểm nào dễ mua được. Routine không cần phức tạp; điều quan trọng là đều đặn và biết dừng khi đã đủ thông tin.",
    },
    {
      kind: "p",
      text: "Cuối cùng, hãy nhớ rằng mục tiêu là giảm chi phí cho những món bạn thật sự cần. Nếu routine khiến bạn mua nhiều hơn, hãy rút ngắn nó lại. Một thói quen tốt phải giúp bạn kiểm soát chi tiêu, không phải tạo thêm lý do để mua.",
    },
  ],
};
