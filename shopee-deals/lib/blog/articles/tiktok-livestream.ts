import { Zap } from "lucide-react";
import type { BlogPost } from "../post-types";

export const tiktokLivestreamPost: BlogPost = {
  slug: "tiktok-shop-livestream-gia-that",
  title: "TikTok Shop livestream: khi nào giá giảm thật?",
  excerpt:
    "Giá livestream có thể thấp hơn nhưng cũng dễ bị đẩy bởi quà tặng và combo. Cách kiểm tra giá thật, người bán và chính sách đổi trả.",
  date: "2026-10-22",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "TikTok Shop", href: "/san/tiktokshop" },
  icon: Zap,
  gradient: "bg-gradient-to-br from-[#242820] to-[#111310]",
  cover: {
    src: "/images/blog/tiktok-shop-livestream-gia-that.svg",
    alt: "Minh họa livestream TikTok Shop và các bước kiểm tra giá thật",
    width: 1200,
    height: 630,
    caption:
      "Giá trong livestream chỉ đáng tin khi bạn đã so với giá ngoài livestream và tổng tiền sau phí.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Deal TikTok Shop", href: "/san/tiktokshop" },
    { label: "Làm đẹp & Chăm sóc", href: "/danh-muc/beauty" },
    { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
  ],
  faqs: [
    {
      question: "Giá livestream có luôn rẻ hơn giá thường không?",
      answer:
        "Không. Một số deal livestream có giá thấp hơn trong thời gian phát sóng, nhưng cũng có món dùng quà tặng hoặc combo để tạo cảm giác hời. Hãy so giá ngoài livestream và tổng tiền sau phí trước khi mua.",
    },
    {
      question: "Mã livestream có dùng lại được không?",
      answer:
        "Thường không. Mã livestream có thể chỉ tồn tại trong phiên hoặc số lượng rất ít. Nếu bạn bỏ lỡ, hãy xem lại trang sản phẩm và voucher công khai thay vì chờ mã cũ.",
    },
    {
      question: "Làm sao biết người bán livestream đáng tin?",
      answer:
        "Xem lịch sử bán, đánh giá gần đây, chính sách đổi trả và thông tin sản phẩm. Với mỹ phẩm hoặc thực phẩm, cần kiểm tra thêm thành phần, hạn dùng và nguồn gốc. Đừng chỉ dựa vào số người xem.",
    },
    {
      question: "Có nên mua theo cảm xúc trong livestream?",
      answer:
        "Không nên. Cảm giác khẩn cấp có thể khiến bạn mua món không cần. Hãy thoát livestream vài phút, kiểm tra lại danh sách cần mua và ngân sách. Nếu vẫn thấy cần, quay lại mua sau.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Livestream TikTok Shop tạo cảm giác khẩn cấp: mã chỉ trong vài phút, quà tặng giới hạn, số lượng còn ít. Nhưng giá hiển thị trong livestream không phải lúc nào cũng là giá tốt nhất nếu bạn không so đúng cách.",
    },
    {
      kind: "p",
      text: "Bài này giúp bạn tách giá thật khỏi các yếu tố gây nhiễu như quà tặng, combo và đồng hồ đếm ngược. Mục tiêu không phải mua bằng mọi giá mà là mua đúng món với tổng chi phí hợp lý.",
    },
    { kind: "h2", text: "Ba con số cần so trước khi chốt" },
    {
      kind: "p",
      text: "Trước khi bấm mua, hãy mở song song trang sản phẩm ngoài livestream và trang thanh toán. Ba con số dưới đây giúp bạn biết mức giảm có thật hay chỉ là cách trình bày.",
    },
    {
      kind: "list",
      items: [
        "Giá trên trang sản phẩm ngoài livestream — đây là mốc so sánh cơ bản nhất.",
        "Tổng tiền sau khi cộng phí ship và trừ voucher, không chỉ giá hiển thị trên màn hình.",
        "Giá trên sàn khác cho cùng sản phẩm, cùng dung tích hoặc cùng bộ phụ kiện.",
      ],
    },
    {
      kind: "p",
      text: "Nếu livestream tặng kèm quà, hãy định giá món quà theo nhu cầu của bạn. Một món quà không dùng đến không làm cho deal tốt hơn. Tương tự, combo nhiều món chỉ có lợi nếu bạn dùng hết trước hạn.",
    },
    { kind: "h2", text: "Giá livestream và giá trang sản phẩm" },
    {
      kind: "p",
      text: "Trang sản phẩm thường ổn định hơn giá trong livestream. Giá livestream có thể thay đổi theo từng phiên, từng khung giờ và số lượng suất. Hãy dùng giá trang sản phẩm làm mốc, sau đó xem livestream có giảm thêm hay không.",
    },
    {
      kind: "table",
      caption: "So sánh giá trong và ngoài livestream",
      headers: ["Tiêu chí", "Giá livestream", "Giá trang sản phẩm"],
      rows: [
        ["Thời gian áp dụng", "Trong phiên hoặc vài phút", "Thường ổn định hơn"],
        ["Số lượng", "Có thể giới hạn theo suất", "Theo tồn kho"],
        ["Quà tặng", "Có thể kèm quà hoặc combo", "Ít thay đổi"],
        ["Mã áp dụng", "Mã riêng của phiên", "Voucher công khai"],
        ["Rủi ro", "Mua theo cảm xúc", "Dễ so sánh hơn"],
      ],
    },
    {
      kind: "p",
      text: "Nếu giá livestream thấp hơn nhưng thời gian giao lâu hơn đáng kể, hãy cân nhắc nhu cầu. Với món cần dùng trong vài ngày, thời gian giao có thể quan trọng hơn khoản tiết kiệm nhỏ.",
    },
    { kind: "h2", text: "Dấu hiệu deal livestream đáng mua" },
    {
      kind: "p",
      text: "Một deal livestream đáng mua thường có thông tin rõ ràng, người bán có lịch sử ổn định và chính sách sau mua minh bạch. Đừng chỉ nhìn mức giảm hoặc số lượng người xem.",
    },
    {
      kind: "list",
      items: [
        "Sản phẩm có thông tin dung tích, thành phần, bảo hành rõ ràng.",
        "Người bán có đánh giá gần đây và phản hồi về chất lượng.",
        "Giá sau phí thấp hơn mức bạn đã ghi trước đó.",
        "Chính sách đổi trả đọc được trong trang sản phẩm.",
        "Không yêu cầu chuyển khoản riêng hoặc cung cấp OTP.",
      ],
    },
    { kind: "h2", text: "Đừng để livestream ép mua" },
    {
      kind: "p",
      text: "Trước khi mua, kiểm tra đánh giá người bán, số lượng đã bán, chính sách đổi trả và thông tin sản phẩm. Với mỹ phẩm, thực phẩm bổ sung hoặc đồ cho bé, hãy xem thành phần, hạn dùng và nguồn gốc kỹ hơn giá.",
    },
    {
      kind: "p",
      text: "Nếu bạn không chắc món đó có thật sự cần, hãy thoát livestream và quay lại sau 10 phút. Cảm giác khẩn cấp thường giảm đi rất nhiều khi bạn không còn nghe thông báo liên tục. Ghi lại tên sản phẩm để kiểm tra sau nếu vẫn cần.",
    },
    {
      kind: "tip",
      text: "Trước khi vào phiên, hãy ghi ra tối đa hai món bạn được phép mua và tổng ngân sách. Khi phiên kết thúc, đối chiếu với danh sách; món ngoài danh sách mặc định bỏ qua, kể cả khi giá trông rất hấp dẫn.",
    },
    { kind: "h2", text: "Quy trình 3 phút trước khi chốt" },
    {
      kind: "p",
      text: "Khi đã chọn được món, đừng bấm mua ngay. Mở tab sản phẩm, kiểm tra đúng phiên bản và đọc mô tả trong một phút. Sau đó quay lại giỏ hàng, áp mã và xem tổng tiền. Bước cuối là so tổng tiền với ngưỡng bạn đã đặt trước khi vào phiên.",
    },
    {
      kind: "p",
      text: "Nếu người bán chỉ cung cấp thông tin qua livestream mà không có mô tả trên tab sản phẩm, hãy cân nhắc bỏ qua. Một deal tốt cần đủ thông tin để kiểm tra sau khi nhận hàng, không chỉ một mức giá đẹp trên màn hình.",
    },
    {
      kind: "list",
      items: [
        "Mở tab sản phẩm và đọc mô tả, dung tích, bảo hành.",
        "Kiểm tra đúng biến thể và số lượng.",
        "Áp mã, xem tổng tiền gồm phí ship.",
        "So với ngưỡng giá đã đặt trước khi vào phiên.",
        "Lưu ảnh giá và mã để đối chiếu nếu đơn sai.",
      ],
    },
    { kind: "h2", text: "Kiểm tra người bán và sau mua" },
    {
      kind: "p",
      text: "Người bán có nhãn ưu tiên hoặc lịch sử giao dịch tốt không thay thế việc kiểm tra sản phẩm. Hãy đọc mô tả, xem ảnh thực tế và hỏi rõ nếu thiếu thông tin. Khi nhận hàng, quay video mở gói và kiểm tra ngoại quan trước khi dùng.",
    },
    {
      kind: "p",
      text: "Nếu sản phẩm không đúng mô tả, hãy liên hệ người bán hoặc sàn trong thời hạn đổi trả. Giữ lại bao bì, tem và ảnh chụp để làm bằng chứng. Không cung cấp mật khẩu, mã OTP hoặc thông tin thẻ cho bất kỳ ai trong livestream.",
    },
    { kind: "h2", text: "Cách theo dõi deal không bỏ lỡ" },
    {
      kind: "p",
      text: "Thay vì theo dõi mọi phiên, hãy lập danh sách món cần mua và theo dõi những người bán có sản phẩm đó. Bật thông báo cho phiên bạn quan tâm, nhưng đặt giới hạn ngân sách trước. Cách này giúp bạn không bị cuốn vào các deal ngoài kế hoạch.",
    },
    {
      kind: "p",
      text: "Một cách khác là lưu lại link sản phẩm và quay lại sau khi phiên kết thúc. Nếu giá vẫn tốt và món vẫn cần, bạn mua mà không phải chịu áp lực đếm ngược. Nếu giá tăng lại, bạn đã tránh được một quyết định vội vàng.",
    },
    {
      kind: "p",
      text: "Deal livestream có thể rất tốt, nhưng chỉ khi sản phẩm phù hợp và người bán đáng tin. Đừng đổi chất lượng lấy mức giảm vài chục nghìn.",
    },
  ],
};
