import { Zap } from "lucide-react";
import type { BlogPost } from "../post-types";

export const tiktokSellerPost: BlogPost = {
  slug: "tiktok-shop-nha-ban-uu-tien",
  title: "TikTok Shop: mua gì từ nhà bán hàng ưu tiên?",
  excerpt:
    "Nhãn nhà bán ưu tiên giúp thu hẹp lựa chọn, nhưng không thay thế việc kiểm tra sản phẩm. Ba nhóm tín hiệu và cách mua an toàn hơn.",
  date: "2026-10-06",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "TikTok Shop", href: "/san/tiktokshop" },
  icon: Zap,
  gradient: "bg-gradient-to-br from-[#242820] to-[#111310]",
  cover: {
    src: "/images/blog/tiktok-shop-nha-ban-uu-tien.svg",
    alt: "Minh họa nhà bán hàng ưu tiên trên TikTok Shop và các bước kiểm tra",
    width: 1200,
    height: 630,
    caption:
      "Nhãn ưu tiên là điểm tham khảo; đánh giá thực tế và chính sách sau bán mới là căn cứ.",
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
      question: "Nhà bán hàng ưu tiên có phải hàng chính hãng không?",
      answer:
        "Không thể kết luận chỉ dựa vào nhãn. Nhãn ưu tiên thường phản ánh hiệu quả vận hành, số đơn hoặc mức độ hoạt động của nhà bán, không đồng nghĩa mọi sản phẩm đều là hàng chính hãng. Hãy kiểm tra thêm thông tin sản phẩm, thương hiệu và đánh giá.",
    },
    {
      question: "Có nên mua hàng giá rẻ bất thường trên TikTok Shop?",
      answer:
        "Cần kiểm tra kỹ. Giá quá thấp có thể đi kèm hàng gần hạn, bản mini, hàng trưng bày hoặc không rõ nguồn gốc. Hãy đọc mô tả, hỏi người bán và so với giá thị trường trước khi quyết định.",
    },
    {
      question: "Mua qua livestream có được đổi trả không?",
      answer:
        "Thường có chính sách đổi trả theo sàn và người bán, nhưng điều kiện có thể khác nhau. Hãy đọc chính sách trước khi mua, giữ lại xác nhận đơn và kiểm tra hàng khi nhận. Không phải mọi sản phẩm đều được đổi vì lý do đã mở bao bì.",
    },
    {
      question: "Làm sao theo dõi deal mà không bị cuốn vào livestream?",
      answer:
        "Hãy theo dõi shop hoặc danh mục thay vì ngồi chờ livestream. Ghi danh sách món cần mua và mức giá hợp lý trước, sau đó chỉ mở livestream khi đã có mục tiêu rõ ràng. Cách này giúp giảm quyết định theo cảm xúc.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "TikTok Shop thường gắn việc mua sắm với livestream và nội dung ngắn. Nhãn “nhà bán hàng ưu tiên” xuất hiện như một tín hiệu giúp người mua thu hẹp lựa chọn, nhưng nó không phải bảo đảm tuyệt đối về chất lượng từng sản phẩm. Hiểu nhãn này đúng cách sẽ giúp bạn mua an toàn hơn.",
    },
    {
      kind: "p",
      text: "Bài này giải thích nhãn ưu tiên có thể phản ánh điều gì, ba nhóm tín hiệu nên kiểm tra và cách mua theo từng nhóm hàng. Nội dung không thay thế đánh giá của bạn về sản phẩm cụ thể; quyết định cuối cùng vẫn dựa trên thông tin tại thời điểm mua.",
    },
    { kind: "h2", text: "Nhãn nhà bán ưu tiên nghĩa là gì?" },
    {
      kind: "p",
      text: "Nhãn này thường liên quan đến mức độ hoạt động và hiệu quả bán hàng của shop, ví dụ số đơn, tốc độ xử lý, tỷ lệ hoàn thành hoặc phản hồi khách. Nó không có nghĩa mọi sản phẩm trong shop đều chính hãng, còn bảo hành dài hay phù hợp với nhu cầu của bạn.",
    },
    {
      kind: "p",
      text: "Vì vậy, hãy dùng nhãn như một bộ lọc ban đầu. Sau đó, kiểm tra sản phẩm cụ thể: thương hiệu, thành phần, dung tích, hạn dùng, bảo hành và chính sách đổi trả. Một shop tốt vẫn có thể bán một sản phẩm không phù hợp với bạn.",
    },
    { kind: "h2", text: "Ba nhóm tín hiệu nên kiểm tra" },
    {
      kind: "p",
      text: "Nhóm tín hiệu thứ nhất là thông tin shop: thời gian hoạt động, số lượng sản phẩm, phản hồi gần đây và cách xử lý câu hỏi. Nhóm thứ hai là thông tin sản phẩm: mô tả có rõ nguồn gốc, thành phần, kích thước và hạn dùng hay không. Nhóm thứ ba là chính sách sau bán: đổi trả, bảo hành và thời gian giao.",
    },
    {
      kind: "table",
      caption: "Ưu tiên kiểm tra theo nhóm hàng",
      headers: ["Nhóm hàng", "Ưu tiên", "Kiểm tra thêm"],
      rows: [
        [
          "Mỹ phẩm",
          "Nguồn gốc, hạn dùng, seal",
          "Thành phần, phản hồi về kích ứng, chính sách đổi trả",
        ],
        [
          "Thực phẩm",
          "Hạn dùng, bao bì, vận chuyển",
          "Điều kiện bảo quản, đánh giá về mùi và độ tươi",
        ],
        [
          "Điện tử",
          "Model, bảo hành, phụ kiện",
          "Serial, tình trạng hàng, nơi bảo hành",
        ],
        [
          "Thời trang",
          "Bảng size, chất liệu",
          "Ảnh thực tế, chính sách đổi size, phí đổi trả",
        ],
      ],
    },
    { kind: "h2", text: "Vì sao không nên chỉ nhìn nhãn" },
    {
      kind: "p",
      text: "Nhãn ưu tiên có thể đạt được nhờ khối lượng đơn lớn, nhưng không phản ánh toàn bộ trải nghiệm của từng người mua. Một shop có nhiều đơn vẫn có thể có tỷ lệ hoàn hàng nhất định hoặc một lô sản phẩm lỗi. Hãy đọc đánh giá có nội dung cụ thể, đặc biệt là đánh giá trung bình và tiêu cực.",
    },
    {
      kind: "p",
      text: "Ngoài ra, nhãn không thay thế việc kiểm tra giá. Một món có nhãn ưu tiên nhưng giá cao hơn nơi khác vẫn có thể không phải lựa chọn tốt. Hãy so tổng tiền sau mã và phí ship với các shop khác hoặc sàn khác cho cùng sản phẩm.",
    },
    {
      kind: "list",
      items: [
        "Đọc đánh giá có ảnh và nội dung cụ thể, không chỉ số sao.",
        "Kiểm tra thời gian hoạt động và phản hồi gần đây của shop.",
        "So giá với shop khác cho cùng model hoặc dung tích.",
        "Xem chính sách đổi trả trước khi mua.",
        "Không mua chỉ vì nhãn hoặc vì đang có livestream.",
      ],
    },
    { kind: "h2", text: "Livestream và tab sản phẩm: nên xem cái nào?" },
    {
      kind: "p",
      text: "Livestream thường tạo cảm giác khẩn cấp bằng số lượng giới hạn, quà tặng hoặc mã chỉ trong vài phút. Tab sản phẩm lại cho bạn thời gian đọc mô tả, so giá và kiểm tra chính sách. Cách an toàn là xem livestream để biết món, sau đó mở tab sản phẩm để xác nhận thông tin trước khi mua.",
    },
    {
      kind: "p",
      text: "Nếu giá trong livestream thấp hơn tab sản phẩm, hãy kiểm tra xem có điều kiện kèm theo không: số lượng, thời gian, quà tặng hay phiên bản. Đừng giả định mức giá trên màn hình là giá cuối cùng; phí ship và mã có thể thay đổi ở bước thanh toán.",
    },
    { kind: "h2", text: "Sau khi mua: giữ bằng chứng" },
    {
      kind: "p",
      text: "Khi nhận hàng, hãy quay video mở gói và kiểm tra ngoại quan trước khi dùng. Với mỹ phẩm hoặc thực phẩm, kiểm tra seal, hạn dùng và màu sắc. Với điện tử, kiểm tra serial, phụ kiện và bật thử các chức năng cơ bản trong thời hạn đổi trả.",
    },
    {
      kind: "p",
      text: "Nếu sản phẩm không đúng mô tả, hãy liên hệ người bán hoặc sàn ngay, kèm ảnh và video. Đừng chờ quá thời hạn hỗ trợ. Giữ lại bao bì và xác nhận đơn để việc đối chiếu nhanh hơn.",
    },
    { kind: "h2", text: "Cách theo dõi deal mà không bị cuốn" },
    {
      kind: "p",
      text: "Hãy theo dõi shop hoặc danh mục bạn quan tâm thay vì mở livestream ngẫu nhiên. Ghi danh sách món cần mua và mức giá hợp lý trước, sau đó chỉ kiểm tra khi có thông báo liên quan. Cách này giúp bạn giữ quyết định dựa trên nhu cầu thay vì cảm xúc.",
    },
    {
      kind: "tip",
      text: "Nếu bạn không chắc một món có thật sự cần, hãy thoát livestream và quay lại sau 10 phút. Cảm giác khẩn cấp thường giảm rất nhiều khi bạn không còn nghe thông báo liên tục.",
    },
    {
      kind: "p",
      text: "Một điểm dễ bỏ qua là thời gian xử lý khiếu nại. Shop phản hồi chậm có thể khiến bạn trễ hạn đổi trả, dù sản phẩm lỗi rõ ràng. Trước khi mua món giá trị cao, hãy thử gửi một câu hỏi và xem tốc độ phản hồi. Đây là tín hiệu thực tế hơn nhãn ưu tiên trên trang shop.",
    },
    {
      kind: "p",
      text: "TikTok Shop có thể là nơi có deal tốt, nhưng chỉ khi sản phẩm phù hợp và người bán đáng tin. Đừng đổi chất lượng hoặc quyền lợi sau bán lấy mức giảm vài chục nghìn đồng.",
    },
  ],
};
