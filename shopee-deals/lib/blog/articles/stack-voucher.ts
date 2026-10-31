import { BadgePercent } from "lucide-react";
import type { BlogPost } from "../post-types";

export const stackVoucherPost: BlogPost = {
  slug: "stack-voucher-shopee-3-lop",
  title: "Stack voucher Shopee: cách cộng dồn 3 lớp giảm giá đúng thứ tự",
  excerpt:
    "Một đơn Shopee có thể có mã shop, mã sàn và freeship. Điều quan trọng là biết lớp nào cộng được, lớp nào thay thế nhau và kiểm tra tổng tiền sau mỗi lần áp.",
  date: "2026-10-18",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "Shopee", href: "/san/shopee" },
  icon: BadgePercent,
  gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
  cover: {
    src: "/images/blog/stack-voucher-shopee-3-lop.svg",
    alt: "Minh họa ba lớp voucher Shopee được xếp chồng đúng thứ tự",
    width: 1200,
    height: 630,
    caption:
      "Ba lớp ưu đãi không phải lúc nào cũng cộng dồn; hãy kiểm tra tổng tiền sau từng bước.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Voucher Shopee mới nhất", href: "/san/shopee" },
    { label: "Mã freeship", href: "/danh-muc/freeship" },
    { label: "Voucher đang chạy", href: "/danh-muc/voucher" },
  ],
  faqs: [
    {
      question: "Có phải đơn Shopee nào cũng cộng được 3 lớp?",
      answer:
        "Không. Số lớp phụ thuộc vào chương trình đang chạy và điều kiện của từng mã. Có đơn chỉ áp được một mã shop và một mã freeship, có đơn không cộng được mã sàn. Hệ thống sẽ báo lỗi hoặc tự thay thế nếu các mã loại trừ nhau.",
    },
    {
      question: "Nên áp mã shop hay mã sàn trước?",
      answer:
        "Thứ tự phổ biến là áp mã shop trước, sau đó mã sàn hoặc mã danh mục, cuối cùng là freeship. Tuy nhiên, mỗi chương trình có cách tính khác nhau. Hãy kiểm tra tổng tiền sau mỗi lần áp và so hai phương án nếu hệ thống cho phép.",
    },
    {
      question: "Vì sao áp thêm mã mà tổng tiền không giảm?",
      answer:
        "Có thể mã mới bị lớp ưu đãi khác thay thế, không đủ điều kiện hoặc chỉ giảm một khoản đã được giảm trước đó. Hãy xem dòng giảm giá và tổng tiền cuối cùng; nếu không đổi, mã chưa có tác dụng.",
    },
    {
      question: "Có nên chia đơn để dùng nhiều mã?",
      answer:
        "Chỉ nên chia đơn nếu mỗi đơn đều đạt điều kiện và tổng chi phí sau khi cộng phí ship vẫn thấp hơn. Chia đơn có thể làm mất freeship hoặc tăng phí giao hàng, nên hãy tính tổng trước khi tách.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Shopee có nhiều loại ưu đãi cùng lúc: mã của shop, mã của sàn, mã danh mục, freeship và ưu đãi thanh toán. Người mua thường gọi đó là “stack voucher” vì có thể xếp chồng nhiều lớp giảm giá trong một đơn. Tuy nhiên, không phải lớp nào cũng cộng được, và thứ tự áp có thể ảnh hưởng đến kết quả.",
    },
    {
      kind: "p",
      text: "Bài này giải thích ba lớp phổ biến nhất, cách kiểm tra chúng có tương thích hay không và quy trình áp mã để không bỏ phí. Nội dung mang tính hướng dẫn; điều kiện cụ thể của từng mã vẫn do Shopee và người bán quy định tại thời điểm mua.",
    },
    { kind: "h2", text: "Ba lớp giảm giá thường gặp" },
    {
      kind: "p",
      text: "Lớp thứ nhất là mã của shop. Mã này do người bán phát hành và thường chỉ áp cho sản phẩm của shop đó. Lớp thứ hai là mã của sàn hoặc mã danh mục, áp theo mốc giá trị đơn và có thể bị giới hạn theo tài khoản. Lớp thứ ba là freeship, giảm phí vận chuyển thay vì giảm tiền hàng.",
    },
    {
      kind: "table",
      caption: "Ba lớp ưu đãi và điểm cần kiểm tra",
      headers: ["Lớp", "Nơi áp dụng", "Giảm vào đâu", "Điểm cần kiểm tra"],
      rows: [
        [
          "Mã shop",
          "Trang sản phẩm hoặc trang shop",
          "Tiền hàng của shop",
          "Đơn tối thiểu, sản phẩm loại trừ, hạn dùng",
        ],
        [
          "Mã sàn/danh mục",
          "Giỏ hàng hoặc bước thanh toán",
          "Tiền hàng theo mốc",
          "Mốc đơn, danh mục, tài khoản, số lượt",
        ],
        [
          "Freeship",
          "Bước chọn vận chuyển",
          "Phí giao hàng",
          "Khu vực, đơn vị vận chuyển, cân nặng",
        ],
      ],
    },
    { kind: "h2", text: "Điều kiện để các lớp cộng dồn" },
    {
      kind: "p",
      text: "Hai mã chỉ cộng được khi chương trình không loại trừ nhau. Một số mã ghi rõ “không cộng dồn”, số khác chỉ cho chọn một mã trong cùng nhóm. Ngoài ra, điều kiện đơn tối thiểu có thể được tính trên giá trước hoặc sau khi áp mã, tùy chương trình.",
    },
    {
      kind: "p",
      text: "Phương thức thanh toán cũng là điều kiện thường bị bỏ qua. Một số mã chỉ áp cho ví điện tử, thẻ ngân hàng hoặc đơn hàng thanh toán khi nhận. Nếu bạn đổi phương thức thanh toán ở bước cuối, mã có thể mất tác dụng. Hãy kiểm tra lại trước khi xác nhận.",
    },
    {
      kind: "list",
      items: [
        "Đọc dòng “không cộng dồn” hoặc điều kiện loại trừ trên mã.",
        "Kiểm tra mốc đơn được tính trước hay sau giảm giá.",
        "Xác nhận phương thức thanh toán đúng với điều kiện.",
        "Kiểm tra mã có giới hạn theo tài khoản hoặc số lượt.",
        "Không giả định mọi mã cùng nhóm đều dùng chung được.",
      ],
    },
    { kind: "h2", text: "Thứ tự áp mã nên thử" },
    {
      kind: "p",
      text: "Một trình tự thực dụng là áp mã shop trước, sau đó mã sàn hoặc mã danh mục, cuối cùng là freeship. Lý do là mã shop thường gắn với sản phẩm cụ thể, còn mã sàn có thể yêu cầu mốc đơn cao hơn. Freeship thường được chọn ở bước vận chuyển, sau khi đã biết đơn có đủ điều kiện hay không.",
    },
    {
      kind: "p",
      text: "Sau mỗi lần áp, hãy nhìn tổng tiền cuối cùng. Nếu tổng không đổi, mã vừa nhập chưa được áp hoặc đã bị lớp khác thay thế. Đừng chỉ nhìn dòng “giảm giá” vì con số đó có thể là mức tối đa lý thuyết, không phải số tiền thực tế được trừ.",
    },
    {
      kind: "list",
      items: [
        "Áp mã shop trước để biết giá trị đơn còn lại.",
        "Áp mã sàn hoặc mã danh mục ở giỏ hàng.",
        "Chọn freeship ở bước vận chuyển.",
        "Kiểm tra tổng tiền sau từng lần áp.",
        "Nếu mã mới làm tổng tăng, bỏ mã đó và quay lại phương án trước.",
      ],
    },
    { kind: "h2", text: "Ví dụ một giỏ hàng để dễ hình dung" },
    {
      kind: "p",
      text: "Giả sử giỏ hàng có giá trị 450.000 đồng, mã shop giảm 30.000 đồng, mã sàn giảm 40.000 đồng cho đơn từ 300.000 đồng và freeship giảm 25.000 đồng. Nếu cả ba đều tương thích, tổng phải trả có thể còn khoảng 355.000 đồng trước các khoản phí khác. Đây chỉ là ví dụ minh họa, không phải mức giảm cam kết.",
    },
    {
      kind: "p",
      text: "Nếu mã sàn yêu cầu đơn tối thiểu 500.000 đồng, giỏ hàng 450.000 đồng sẽ không đủ điều kiện. Lúc đó, bạn có thể thêm một món thật sự cần hoặc bỏ mã sàn và dùng freeship. Hãy so tổng tiền của cả hai phương án thay vì cố thêm hàng để đạt mốc.",
    },
    {
      kind: "table",
      caption: "Ví dụ so hai phương án (số liệu minh họa)",
      headers: ["Phương án", "Tiền hàng", "Giảm giá", "Phí ship", "Tổng tham khảo"],
      rows: [
        ["Không thêm hàng", "450.000", "70.000", "25.000", "405.000"],
        ["Thêm món 60.000 để đủ mốc", "510.000", "100.000", "25.000", "435.000"],
      ],
    },
    { kind: "h2", text: "Khi mã bị thay thế hoặc báo lỗi" },
    {
      kind: "p",
      text: "Shopee có thể tự chọn mã có lợi nhất hoặc từ chối mã không tương thích. Nếu bạn thấy một mã biến mất sau khi áp mã khác, hãy kiểm tra lại danh sách mã trong giỏ. Có thể hệ thống đã thay thế bằng một mã khác có giá trị cao hơn hoặc thấp hơn.",
    },
    {
      kind: "p",
      text: "Với lỗi “không đủ điều kiện”, hãy kiểm tra ba thứ: giá trị đơn, danh mục sản phẩm và phương thức thanh toán. Với lỗi “mã không hợp lệ”, kiểm tra hạn dùng và số lượt. Đừng nhập lại cùng một mã nhiều lần; nếu vẫn lỗi, chuyển sang mã khác hoặc bỏ qua.",
    },
    {
      kind: "tip",
      text: "Trước khi bấm đặt, chụp ảnh màn hình tổng tiền và danh sách mã đã áp. Nếu đơn bị tính sai hoặc mã không được ghi nhận, ảnh chụp giúp bạn đối chiếu nhanh hơn với bộ phận hỗ trợ.",
    },
    { kind: "h2", text: "Quy trình 60 giây trước khi đặt" },
    {
      kind: "p",
      text: "Trong 60 giây cuối, hãy kiểm tra theo thứ tự: sản phẩm đúng biến thể, số lượng đúng, mã đã áp, phí ship và tổng tiền. Nếu một mục không đúng, quay lại bước trước thay vì cố thanh toán. Đặt đúng một lần thường nhanh hơn xử lý đơn sai sau đó.",
    },
    {
      kind: "p",
      text: "Cuối cùng, hãy nhớ rằng mục tiêu của stack voucher là giảm chi phí cho món bạn đã định mua, không phải mở rộng giỏ hàng. Nếu tổng tiền sau mã vẫn cao hơn ngân sách, hãy bỏ bớt món không cần thay vì tìm thêm mã.",
    },
  ],
};
