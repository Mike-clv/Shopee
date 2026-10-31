import { Truck } from "lucide-react";
import type { BlogPost } from "../post-types";

export const freeshipPost: BlogPost = {
  slug: "voucher-freeship-shopee-khong-ap-duoc",
  title:
    "Voucher freeship Shopee không áp dụng được: 6 nguyên nhân và cách xử lý",
  excerpt:
    "Đủ điều kiện hay không phụ thuộc đơn tối thiểu, khu vực, đơn vị vận chuyển và hạn mức tài khoản. Kiểm tra đúng thứ tự để không bỏ phí mã.",
  date: "2026-10-28",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "Freeship", href: "/danh-muc/freeship" },
  icon: Truck,
  gradient: "bg-gradient-to-br from-[#0e5b4a] to-[#08352a]",
  cover: {
    src: "/images/blog/voucher-freeship-shopee-khong-ap-duoc.svg",
    alt: "Minh họa voucher freeship và các điều kiện vận chuyển cần kiểm tra",
    width: 1200,
    height: 630,
    caption:
      "Freeship thường chỉ giảm phí ship cơ bản; phụ thu cân nặng và khu vực có thể vẫn được tính.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Deal freeship", href: "/danh-muc/freeship" },
    { label: "Deal Shopee", href: "/san/shopee" },
    { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
  ],
  faqs: [
    {
      question: "Freeship có áp dụng cho mọi đơn hàng không?",
      answer:
        "Không. Mã thường yêu cầu giá trị đơn tối thiểu, đúng khu vực giao hàng và đúng đơn vị vận chuyển. Một số mã chỉ dành cho tài khoản mới hoặc phương thức thanh toán cụ thể. Hãy kiểm tra điều kiện trước khi thêm sản phẩm.",
    },
    {
      question: "Vì sao mã freeship chỉ giảm một phần phí ship?",
      answer:
        "Mã thường chỉ giảm phí vận chuyển cơ bản. Phụ thu cân nặng, kích thước, khu vực xa hoặc phí của đơn vị giao có thể vẫn được tính riêng. Số tiền được giảm không nhất thiết bằng toàn bộ phí hiển thị.",
    },
    {
      question: "Có nên gom thêm món để đạt mốc freeship?",
      answer:
        "Chỉ nên gom nếu món thêm thực sự cần và tổng chi phí vẫn có lợi. Nếu món thêm không dùng đến, số tiền bỏ ra có thể lớn hơn phần phí ship được giảm. Hãy so tổng tiền sau giảm thay vì chỉ nhìn nhãn freeship.",
    },
    {
      question: "Đổi địa chỉ nhận hàng có làm mất freeship không?",
      answer:
        "Có thể. Phí vận chuyển được tính lại theo địa chỉ mới và đơn vị giao phù hợp. Nếu địa chỉ mới ở xa hơn hoặc khó giao, phụ thu có thể tăng. Hãy kiểm tra lại phí trước khi xác nhận đơn.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Voucher freeship là loại mã dễ bị từ chối nhất khi thanh toán, vì điều kiện của nó thay đổi theo đơn hàng, khu vực và đơn vị giao. Sáu nguyên nhân dưới đây giải thích phần lớn các trường hợp mã không áp dụng được.",
    },
    {
      kind: "p",
      text: "Điểm cần nhớ: freeship không có nghĩa là toàn bộ chi phí vận chuyển về 0. Mã thường giảm một phần phí cơ bản, còn phụ thu cân nặng, kích thước hoặc khu vực xa vẫn có thể được cộng vào. Vì vậy, hãy kiểm tra tổng tiền cuối cùng thay vì chỉ nhìn dòng “miễn phí vận chuyển”.",
    },
    { kind: "h2", text: "Điều kiện freeship được tính thế nào?" },
    {
      kind: "p",
      text: "Mỗi chương trình có một mốc đơn tối thiểu riêng. Mốc này có thể tính trên tiền hàng trước khi áp mã, sau khi áp mã shop hoặc chỉ tính một số danh mục. Nếu đơn của bạn vừa đủ mốc nhưng lại có sản phẩm bị loại trừ, hệ thống có thể tính lại và từ chối mã.",
    },
    {
      kind: "p",
      text: "Phí vận chuyển còn phụ thuộc vào địa chỉ nhận, khối lượng và đơn vị giao. Cùng một đơn hàng gửi đến hai địa chỉ khác nhau có thể cho hai mức phí khác nhau. Vì vậy, đừng kết luận mã lỗi khi bạn mới kiểm tra với một địa chỉ hoặc một phương thức giao.",
    },
    {
      kind: "list",
      items: [
        "Mốc đơn tối thiểu có thể tính trước hoặc sau giảm giá.",
        "Danh mục và shop không tham gia chương trình sẽ bị loại.",
        "Địa chỉ xa, đảo hoặc khu vực khó giao có thể phát sinh phụ thu.",
        "Đơn vị vận chuyển khác nhau có bảng phí và hạn mức khác nhau.",
        "Hạn mức freeship của tài khoản có thể đã dùng hết trong tháng.",
      ],
    },
    { kind: "h2", text: "Sáu nguyên nhân thường gặp" },
    {
      kind: "p",
      text: "Dưới đây là sáu nhóm nguyên nhân phổ biến, xếp theo thứ tự bạn nên kiểm tra. Nếu đã loại trừ cả sáu mà mã vẫn không áp được, nhiều khả năng quỹ mã đã hết hoặc chương trình đã kết thúc trước hạn hiển thị.",
    },
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
      kind: "p",
      text: "Thứ tự kiểm tra nên bắt đầu từ giỏ hàng, sau đó đến địa chỉ và cuối cùng là tài khoản. Làm ngược lại dễ khiến bạn đổi tài khoản hoặc đổi địa chỉ trong khi lỗi thực ra nằm ở sản phẩm trong giỏ.",
    },
    { kind: "h2", text: "Bảng triệu chứng và cách xử lý" },
    {
      kind: "table",
      caption: "Các tình huống freeship không áp dụng",
      headers: ["Triệu chứng", "Nguyên nhân thường gặp", "Việc nên làm"],
      rows: [
        [
          "Mã không hiện trong giỏ",
          "Đơn chưa đạt mốc hoặc sản phẩm bị loại",
          "Kiểm tra mốc đơn và danh mục áp dụng",
        ],
        [
          "Mã hiện nhưng báo không hợp lệ",
          "Sai phương thức thanh toán hoặc hết lượt",
          "Đổi phương thức thanh toán, thử mã khác",
        ],
        [
          "Phí ship chỉ giảm một phần",
          "Phụ thu cân nặng, kích thước hoặc khu vực",
          "Xem chi tiết phí trước khi xác nhận",
        ],
        [
          "Đổi địa chỉ thì mất mã",
          "Phí được tính lại theo địa chỉ mới",
          "Kiểm tra phí và mã với địa chỉ cuối cùng",
        ],
        [
          "Tài khoản khác áp được, bạn thì không",
          "Hạn mức hoặc nhóm tài khoản khác nhau",
          "Đọc điều kiện đối tượng áp dụng",
        ],
      ],
    },
    { kind: "h2", text: "Thứ tự áp mã nên thử" },
    {
      kind: "p",
      text: "Khi có nhiều mã, hãy thử theo thứ tự từ mã có phạm vi hẹp đến mã có phạm vi rộng. Mã shop thường áp trước, sau đó đến mã sàn hoặc mã danh mục, cuối cùng là freeship. Tuy nhiên, mỗi chương trình có quy ước riêng; điều quan trọng là xem tổng tiền sau mỗi lần áp.",
    },
    {
      kind: "list",
      items: [
        "Áp mã của shop trước để biết giá trị đơn còn lại.",
        "Áp mã sàn hoặc mã danh mục ở giỏ hàng.",
        "Chọn freeship sau cùng và kiểm tra lại phí giao hàng ở bước thanh toán.",
        "Nếu tổng tiền tăng, bỏ mã vừa áp và thử phương án khác.",
      ],
    },
    {
      kind: "p",
      text: "Mỗi lần đổi mã, hãy nhìn tổng tiền cuối cùng thay vì số tiền giảm trên nhãn. Một mã freeship nhỏ vẫn có thể tốt hơn mã giảm hàng lớn nhưng bị tính phí ship cao.",
    },
    { kind: "h2", text: "Khu vực giao hàng và đơn vị vận chuyển" },
    {
      kind: "p",
      text: "Khu vực trung tâm thường có nhiều lựa chọn giao hàng và mức phí thấp hơn. Huyện xa, đảo hoặc địa chỉ khó tìm có thể bị giới hạn đơn vị vận chuyển và phát sinh phụ thu. Nếu bạn ở chung cư nhiều tòa, hãy ghi rõ tòa nhà, tầng và giờ nhận hàng để tránh giao lại.",
    },
    {
      kind: "p",
      text: "Đơn cồng kềnh hoặc nặng thường không được miễn toàn bộ phí. Với các món này, hãy đọc bảng phí theo cân nặng và kích thước trước khi mua. Nếu mức phí còn lại quá cao, có thể cân nhắc mua từ shop gần hơn hoặc chờ chương trình khác.",
    },
    { kind: "h2", text: "Khi nào nên dừng thử mã?" },
    {
      kind: "p",
      text: "Nếu đã kiểm tra đủ sáu nguyên nhân và thử hai mã cùng loại mà vẫn không được, hãy dừng lại. Nhập đi nhập lại một mã không hoạt động không làm tăng khả năng thành công; đôi khi còn khiến bạn bỏ lỡ khung giờ mua tốt.",
    },
    {
      kind: "p",
      text: "Với món cần dùng gấp, hãy đặt ngưỡng tiết kiệm tối thiểu. Nếu phần phí ship được giảm thấp hơn ngưỡng đó, mua luôn có thể hợp lý hơn. Freeship là công cụ giảm chi phí, không phải điều kiện bắt buộc để mua hàng.",
    },
    {
      kind: "tip",
      text: "Nếu thiếu vài nghìn để đạt mốc freeship, hãy thêm một món nhỏ thật sự cần dùng. Đừng thêm món chỉ để đủ điều kiện nếu phí ship tiết kiệm được thấp hơn giá món đó.",
    },
  ],
};
