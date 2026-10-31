import { BookOpen } from "lucide-react";
import type { BlogPost } from "../post-types";

export const toeicIeltsPost: BlogPost = {
  slug: "chon-sach-thi-toeic-ielts",
  title: "Chọn sách thi TOEIC/IELTS: so giá 3 sàn trong 2 phút",
  excerpt:
    "Cùng một bộ sách luyện thi có thể lệch giá cả trăm nghìn giữa các sàn. Quy trình bốn bước để mua đúng bản, đúng giá và không thiếu audio.",
  date: "2026-10-12",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "Sách & VPP", href: "/danh-muc/book" },
  icon: BookOpen,
  gradient: "bg-gradient-to-br from-[#26364d] to-[#151f2d]",
  cover: {
    src: "/images/blog/chon-sach-thi-toeic-ielts.svg",
    alt: "Minh họa sách luyện thi TOEIC và IELTS được so giá trên ba sàn",
    width: 1200,
    height: 630,
    caption:
      "So đúng bản sách trước khi so giá; bìa giống nhau chưa chắc nội dung giống nhau.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Deal sách đang giảm", href: "/danh-muc/book" },
    { label: "Deal Tiki", href: "/san/tiki" },
    { label: "Deal Shopee", href: "/san/shopee" },
  ],
  faqs: [
    {
      question: "Sách luyện thi cũ có dùng được không?",
      answer:
        "Có, nếu nội dung vẫn phù hợp với format kỳ thi hiện tại và sách còn đủ phụ lục. Hãy kiểm tra năm tái bản, tình trạng đáp án, audio và các trang ghi chú. Với sách có mã kích hoạt hoặc audio online, cần xác nhận mã còn dùng được.",
    },
    {
      question: "Vì sao cùng một tựa sách lại có nhiều mức giá?",
      answer:
        "Giá khác nhau do phiên bản, nhà xuất bản, năm in, người bán và nguồn hàng. Bìa mềm khác bìa cứng, bản có audio khác bản không có audio, bản in lậu có thể rẻ hơn nhưng chất lượng thấp. Hãy so cùng một phiên bản thay vì chỉ so tên sách.",
    },
    {
      question: "Nên mua combo hay mua từng cuốn?",
      answer:
        "Combo thường rẻ hơn theo đầu sách nhưng chỉ có lợi nếu bạn dùng hết. Nếu bạn chỉ cần một kỹ năng hoặc đã có một cuốn trong bộ, mua lẻ có thể hợp lý hơn. Hãy so giá từng cuốn và tính cả phí ship.",
    },
    {
      question: "Mua sách trước kỳ thi bao lâu là hợp lý?",
      answer:
        "Nên mua trước 2–4 tuần để có thời gian nhận hàng, kiểm tra và đổi trả nếu sai bản. Nếu bạn cần audio hoặc mã kích hoạt, hãy kiểm tra ngay khi nhận thay vì đợi đến sát ngày thi.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Sách luyện thi TOEIC và IELTS là nhóm hàng dễ mua nhầm bản nhất. Cùng một tựa đề có thể có bản gốc, bản dịch, bản rút gọn, bản có hoặc không có audio, bản in lại và bản bán kèm đáp án. Giá rẻ chỉ có ý nghĩa khi bạn mua đúng cuốn mình cần.",
    },
    {
      kind: "p",
      text: "Bài này hướng dẫn cách chốt đúng bản trước, sau đó so giá trên ba sàn trong khoảng hai phút. Mục tiêu không phải tìm mức giá thấp nhất bằng mọi cách, mà là tránh trả tiền cho một cuốn không dùng được cho kỳ thi của bạn.",
    },
    { kind: "h2", text: "Chốt đúng bộ trước khi so giá" },
    {
      kind: "p",
      text: "Bắt đầu bằng việc xác định format kỳ thi bạn đang chuẩn bị. TOEIC và IELTS có nhiều dạng bài, nhiều phiên bản và nhiều bộ sách khác nhau. Nếu bạn mua theo yêu cầu của giáo viên hoặc khóa học, hãy đối chiếu đúng tên sách, mã ISBN và số tập.",
    },
    {
      kind: "p",
      text: "Với sách có audio, hãy kiểm tra cách truy cập. Một số bộ kèm CD, số khác dùng mã QR hoặc tài khoản online. Nếu mua sách cũ, mã kích hoạt có thể đã được dùng. Đây là lỗi rất khó xử lý sau khi mua, nên hãy hỏi người bán trước.",
    },
    {
      kind: "table",
      caption: "Loại sách và điểm cần kiểm tra",
      headers: ["Loại sách", "Cần kiểm tra", "Rủi ro thường gặp"],
      rows: [
        [
          "Sách mới chính hãng",
          "Nhà xuất bản, năm in, ISBN, phụ kiện",
          "Mua nhầm bản rút gọn hoặc thiếu audio",
        ],
        [
          "Sách có audio/mã online",
          "Cách truy cập, mã còn hiệu lực",
          "Mã đã dùng hoặc không tương thích thiết bị",
        ],
        [
          "Sách cũ",
          "Tình trạng trang, đáp án, ghi chú",
          "Thiếu trang, viết tay nhiều, bìa hư",
        ],
        [
          "Combo nhiều cuốn",
          "Danh sách đầu sách, số tập",
          "Thiếu tập hoặc trùng cuốn đã có",
        ],
      ],
    },
    { kind: "h2", text: "So giá ba sàn trong hai phút" },
    {
      kind: "p",
      text: "Khi đã có đúng tên và phiên bản, hãy so giá trên Tiki, Shopee và Lazada. Cách nhanh nhất là tìm theo ISBN hoặc tên đầy đủ, sau đó mở ba trang sản phẩm và so cùng một phiên bản. Đừng so bìa mềm với bìa cứng hoặc bản có audio với bản không có audio.",
    },
    {
      kind: "p",
      text: "Con số cần so là tổng tiền sau khi cộng phí ship và trừ mã. Một sàn có giá niêm yết thấp hơn nhưng phí ship cao hoặc thời gian giao dài có thể không phải lựa chọn tốt hơn. Với sách mỏng, phí ship có thể chiếm tỷ trọng lớn trong tổng giá.",
    },
    {
      kind: "list",
      items: [
        "Tìm đúng ISBN hoặc tên đầy đủ của bộ sách.",
        "So cùng phiên bản, cùng số tập và cùng phụ kiện.",
        "Cộng phí ship vào tổng tiền trước khi so.",
        "Kiểm tra người bán là sàn hay shop bên thứ ba.",
        "Xem thời gian giao so với ngày bạn cần sách.",
      ],
    },
    { kind: "h2", text: "Chồng mã và freeship cho sách" },
    {
      kind: "p",
      text: "Sách thường có giá trị đơn không quá lớn, nên mã sàn theo mốc 100.000 hoặc 200.000 đồng có thể khó áp nếu bạn chỉ mua một cuốn. Thay vì thêm sách không cần, hãy kiểm tra xem shop có mã riêng, combo hoặc freeship cho đơn sách hay không.",
    },
    {
      kind: "p",
      text: "Nếu bạn mua nhiều cuốn cùng một shop, gom đơn có thể tiết kiệm phí ship. Tuy nhiên, chỉ nên gom những cuốn bạn chắc chắn dùng. Mua thêm một cuốn không cần để đạt mức miễn phí vận chuyển thường làm tổng chi phí tăng, không giảm.",
    },
    {
      kind: "tip",
      text: "Với sách luyện thi, đừng mua bản quá cũ chỉ vì rẻ. Cấu trúc đề và nội dung có thể đã thay đổi; hãy kiểm tra năm tái bản so với kỳ thi của bạn trước khi chốt.",
    },
    { kind: "h2", text: "Sách cũ, sách photo và hàng nhập" },
    {
      kind: "p",
      text: "Sách cũ có thể là lựa chọn tiết kiệm nếu tình trạng còn tốt. Hãy hỏi người bán về bìa, gáy, trang, ghi chú và phụ lục. Sách photo hoặc bản in không rõ nguồn gốc có thể rẻ hơn nhưng chất lượng giấy, độ rõ và quyền sử dụng là vấn đề cần cân nhắc.",
    },
    {
      kind: "p",
      text: "Với hàng nhập khẩu, hãy kiểm tra ngôn ngữ, đơn vị tiền tệ và phiên bản. Một số sách quốc tế có nội dung tương tự nhưng khác format đề. Nếu bạn mua để luyện theo đúng kỳ thi tại Việt Nam, hãy xác nhận lại với giáo viên hoặc trung tâm.",
    },
    { kind: "h2", text: "Thời điểm mua theo kỳ thi" },
    {
      kind: "p",
      text: "Nên mua trước kỳ thi ít nhất 2–4 tuần. Khoảng thời gian này đủ để nhận hàng, kiểm tra audio, đổi trả nếu sai bản và bắt đầu luyện tập. Nếu bạn mua sát ngày thi, rủi ro giao hàng chậm hoặc thiếu phụ kiện sẽ khó xử lý hơn.",
    },
    {
      kind: "p",
      text: "Trong các đợt sale lớn, thời gian xử lý đơn có thể dài hơn. Hãy đặt mốc nhận sách trước ngày bắt đầu luyện ít nhất vài ngày. Đừng chờ đến khi có đề mới rồi mới mua, vì bạn sẽ mất thời gian luyện tập.",
    },
    { kind: "h2", text: "Khi nhận sách, kiểm tra gì?" },
    {
      kind: "p",
      text: "Khi nhận, hãy kiểm tra bìa, gáy, số trang và phụ kiện. Với sách có audio hoặc mã online, hãy thử truy cập ngay trong thời hạn đổi trả. Nếu sách bị hư do vận chuyển hoặc thiếu phụ kiện, chụp ảnh và liên hệ người bán trước khi dùng.",
    },
    {
      kind: "p",
      text: "Sau khi mở, bảo quản sách nơi khô ráo, tránh nước và ánh nắng trực tiếp. Với sách bài tập có thể viết vào, hãy dùng bút chì hoặc giấy riêng nếu bạn muốn làm lại lần hai. Một cuốn sách được giữ tốt có thể dùng cho nhiều giai đoạn ôn thi.",
    },
  ],
};
