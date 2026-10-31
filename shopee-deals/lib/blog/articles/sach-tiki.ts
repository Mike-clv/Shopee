import { BookOpen } from "lucide-react";
import type { BlogPost } from "../post-types";

export const sachTikiPost: BlogPost = {
  slug: "mua-sach-tiki-gia-tot",
  title: "Mua sách Tiki giá tốt: so giá và chồng mã trong 3 bước",
  excerpt:
    "Sách cùng tựa có thể lệch giá giữa bản bìa mềm, bìa cứng và nhà bán. Cách chọn đúng bản, đủ điều kiện freeship và không mua trùng.",
  date: "2026-10-26",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "Sách & VPP", href: "/danh-muc/book" },
  icon: BookOpen,
  gradient: "bg-gradient-to-br from-[#26364d] to-[#151f2d]",
  cover: {
    src: "/images/blog/mua-sach-tiki-gia-tot.svg",
    alt: "Minh họa sách và các bước so giá, chồng mã khi mua sách Tiki",
    width: 1200,
    height: 630,
    caption:
      "So đúng phiên bản trước khi so giá; một cuốn sách rẻ hơn có thể chỉ là bản khác.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Deal sách đang giảm", href: "/danh-muc/book" },
    { label: "Deal Tiki", href: "/san/tiki" },
    { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
  ],
  faqs: [
    {
      question: "Sách cùng tựa nhưng khác giá có phải hàng giả không?",
      answer:
        "Không hẳn. Giá có thể khác vì bìa mềm và bìa cứng, năm tái bản, nhà xuất bản, tình trạng sách cũ hoặc nguồn nhập khác nhau. Hãy so cùng một phiên bản trước khi kết luận. Nếu giá thấp bất thường, nên kiểm tra thêm tem, bìa và mô tả.",
    },
    {
      question: "Mua sách Tiki có được freeship không?",
      answer:
        "Tùy chương trình và giá trị đơn. Sách thường có phí ship riêng nếu đơn nhỏ; mã freeship có thể yêu cầu mốc tối thiểu hoặc áp cho một số nhà bán. Hãy kiểm tra phí ở bước thanh toán với đúng địa chỉ nhận.",
    },
    {
      question: "Nên mua combo hay mua từng cuốn?",
      answer:
        "Combo có thể rẻ hơn theo đầu sách nhưng chỉ có lợi nếu bạn dùng hết. Hãy so giá từng cuốn, cộng phí ship và cân nhắc nhu cầu thực tế. Đừng mua cả bộ chỉ vì mức giảm hiển thị cao.",
    },
    {
      question: "Sách cũ trên Tiki có đáng mua không?",
      answer:
        "Có thể, nếu mô tả tình trạng rõ và người bán có phản hồi tốt. Hãy hỏi về bìa, gáy, ghi chú và phụ lục đi kèm. Với sách học hoặc sách làm quà, nên ưu tiên bản còn tốt và đúng phiên bản.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Sách là nhóm hàng dễ mua nhầm bản nhất: cùng tên nhưng khác nhà xuất bản, khác năm tái bản, khác bìa hoặc khác bộ. Giá rẻ chỉ có ý nghĩa khi bạn mua đúng cuốn mình cần.",
    },
    {
      kind: "p",
      text: "Ba bước dưới đây giúp bạn chốt đúng phiên bản, so đúng giá và kiểm tra điều kiện freeship trước khi thanh toán. Quy trình này áp dụng cho sách tiếng Việt, sách ngoại văn và cả sách luyện thi.",
    },
    { kind: "h2", text: "Bước 1 — chốt đúng bản sách" },
    {
      kind: "p",
      text: "Trước khi so giá, hãy xác định chính xác phiên bản. Với sách văn học, khác biệt có thể nằm ở người dịch, nhà xuất bản và bìa. Với sách chuyên môn, khác biệt có thể nằm ở năm tái bản và nội dung cập nhật. Với sách luyện thi, bản có đáp án hoặc audio đi kèm là một phiên bản khác.",
    },
    {
      kind: "p",
      text: "Mã ISBN là công cụ hữu ích để đối chiếu, nhưng không phải mọi trang sản phẩm đều ghi đầy đủ. Nếu thiếu, hãy hỏi người bán hoặc so ảnh bìa, số trang và nhà xuất bản. Đừng chỉ dựa vào tiêu đề vì tiêu đề có thể bị rút gọn hoặc thêm phụ đề.",
    },
    {
      kind: "list",
      items: [
        "Kiểm tra tên tác giả, nhà xuất bản và năm in.",
        "Đối chiếu ISBN nếu trang sản phẩm có ghi.",
        "Phân biệt bìa mềm, bìa cứng và bản tái bản.",
        "Xác nhận sách có đủ bộ, đĩa hoặc phụ lục đi kèm.",
        "Đọc kỹ mô tả tình trạng nếu là sách cũ.",
      ],
    },
    { kind: "h2", text: "Bước 2 — so giá đúng cách" },
    {
      kind: "p",
      text: "Giá niêm yết chưa phải tổng chi phí. Hãy cộng phí vận chuyển, trừ mã nếu có và so theo cùng một phiên bản. Một cuốn bìa mềm giá thấp hơn bìa cứng là chuyện bình thường; so sánh hai bản khác nhau sẽ dẫn đến kết luận sai.",
    },
    {
      kind: "p",
      text: "Với sách mỏng, phí ship có thể chiếm tỷ trọng lớn trong tổng giá. Nếu mua nhiều cuốn cùng một nhà bán, gom đơn có thể tiết kiệm hơn. Tuy nhiên, đừng thêm sách không cần chỉ để đạt mức miễn phí vận chuyển.",
    },
    {
      kind: "table",
      caption: "Các khoản cần cộng khi so giá sách",
      headers: ["Khoản", "Cách kiểm tra", "Ảnh hưởng"],
      rows: [
        ["Giá sách", "So cùng ISBN hoặc cùng phiên bản", "Chênh lệch giữa các nhà bán"],
        ["Phí vận chuyển", "Nhập đúng địa chỉ nhận", "Có thể cao với đơn nhỏ"],
        ["Mã giảm giá", "Đọc mốc đơn và danh mục", "Không phải mã nào cũng áp"],
        ["Thời gian giao", "Xem ngày dự kiến", "Quan trọng với sách học"],
        ["Đổi trả", "Đọc chính sách của shop", "Rủi ro khi sách hư hoặc sai bản"],
      ],
    },
    {
      kind: "p",
      text: "Nếu bạn mua sách để học theo kế hoạch, hãy đặt mốc thời gian trước kỳ thi ít nhất hai tuần. Thời gian giao hàng trong mùa sale có thể dài hơn bình thường; chậm một tuần có thể làm giảm giá trị của món sách rẻ.",
    },
    { kind: "h2", text: "Bước 3 — chồng mã và freeship" },
    {
      kind: "p",
      text: "Sách thường không phải nhóm hàng có mức giảm sâu nhất, nhưng có thể tiết kiệm đáng kể nếu bạn kết hợp đúng mã. Hãy thử mã của nhà bán trước, sau đó đến mã danh mục sách và cuối cùng là freeship. Mỗi lần áp mã, xem tổng tiền thay vì chỉ nhìn số tiền giảm.",
    },
    {
      kind: "list",
      items: [
        "Áp mã shop hoặc mã nhà bán nếu có.",
        "Thử mã danh mục sách hoặc mã sàn đang chạy.",
        "Chọn freeship sau cùng và kiểm tra phí còn lại.",
        "So tổng tiền với phương án mua từng cuốn.",
      ],
    },
    {
      kind: "tip",
      text: "Với sách luyện thi, đừng mua bản quá cũ chỉ vì rẻ. Cấu trúc đề và nội dung có thể đã thay đổi; hãy kiểm tra kỹ năm tái bản so với kỳ thi của bạn.",
    },
    { kind: "h2", text: "Sách ngoại văn và sách nhập khẩu" },
    {
      kind: "p",
      text: "Sách ngoại văn thường có giá cao hơn và ít chương trình giảm sâu hơn sách trong nước. Hãy kiểm tra ngôn ngữ, phiên bản bìa và nhà xuất bản trước khi so giá. Một cuốn sách tiếng Anh bản quốc tế có thể khác bản nội địa về nội dung phụ lục, chất lượng giấy và thời gian giao.",
    },
    {
      kind: "p",
      text: "Với sách nhập khẩu, thời gian giao có thể dài hơn và phí vận chuyển cao hơn. Nếu bạn cần sách cho kỳ thi hoặc khóa học, hãy đặt trước và xác nhận ngày giao với người bán. Đừng chọn bản không rõ nguồn chỉ vì giá thấp hơn vài chục nghìn.",
    },
    {
      kind: "list",
      items: [
        "Xác nhận ngôn ngữ và phiên bản bìa trước khi mua.",
        "Kiểm tra nhà xuất bản và năm in của bản nhập khẩu.",
        "Hỏi thời gian giao nếu sách cần cho kỳ thi.",
        "So tổng tiền gồm phí ship, không chỉ giá sách.",
        "Ưu tiên nơi có mô tả rõ nguồn hàng.",
      ],
    },
    { kind: "h2", text: "Sách cũ, sách tồn và bản in lậu" },
    {
      kind: "p",
      text: "Sách cũ có thể là lựa chọn tiết kiệm nếu tình trạng còn tốt. Tuy nhiên, mô tả “còn tốt” có thể bao gồm ghi chú, gạch chân hoặc thiếu phụ lục. Hãy hỏi người bán về bìa, gáy, trang và các phụ kiện đi kèm trước khi đặt.",
    },
    {
      kind: "p",
      text: "Sách mới giá rẻ bất thường có thể là bản in lậu hoặc hàng tồn kho lâu năm. Chất lượng giấy và keo gáy ảnh hưởng đến việc sử dụng lâu dài. Nếu mua để học hoặc làm quà, nên ưu tiên bản in rõ ràng và có nguồn gốc.",
    },
    { kind: "h2", text: "Kiểm tra khi nhận hàng" },
    {
      kind: "p",
      text: "Sách dễ bị cong góc, ẩm hoặc rách bìa trong quá trình vận chuyển. Khi nhận, hãy kiểm tra bìa và gáy trước khi bấm xác nhận. Nếu sách bị hư do đóng gói kém, hãy chụp ảnh và liên hệ ngay.",
    },
    {
      kind: "p",
      text: "Với sách giá trị cao hoặc bộ nhiều cuốn, nên chọn shop có đóng gói cẩn thận và đọc đánh giá về khâu giao hàng. Sau khi nhận, bảo quản sách nơi khô ráo, tránh ánh nắng trực tiếp.",
    },
  ],
};
