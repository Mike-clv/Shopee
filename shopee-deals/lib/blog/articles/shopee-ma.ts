import { BadgePercent } from "lucide-react";
import type { BlogPost } from "../post-types";

export const shopeeMaPost: BlogPost = {
  slug: "ma-giam-gia-shopee-hom-nay",
  title:
    "Mã giảm giá Shopee hôm nay: cách kiểm tra mã còn sống trước khi mua",
  excerpt:
    "Mã được đăng công khai không có nghĩa vẫn dùng được. Bốn bước kiểm tra trước khi thanh toán giúp bạn không mất thời gian thử từng mã.",
  date: "2026-10-29",
  updated: "2026-10-31",
  minutes: 8,
  tag: { label: "Shopee", href: "/san/shopee" },
  icon: BadgePercent,
  gradient: "bg-gradient-to-br from-[#b23a1d] to-[#6f2110]",
  cover: {
    src: "/images/blog/ma-giam-gia-shopee-hom-nay.svg",
    alt: "Minh họa mã giảm giá Shopee và các bước kiểm tra trước khi thanh toán",
    width: 1200,
    height: 630,
    caption:
      "Mã công khai chỉ là điểm bắt đầu; điều kiện ở bước thanh toán mới là căn cứ cuối cùng.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Mã Shopee đang chạy", href: "/san/shopee" },
    { label: "Voucher mới nhất", href: "/danh-muc/voucher" },
    { label: "Mã freeship", href: "/danh-muc/freeship" },
  ],
  faqs: [
    {
      question: "Mã Shopee báo hết lượt có phải mã giả không?",
      answer:
        "Thường không. Mã có thể đã được phát hết, hết hạn hoặc chỉ dành cho một nhóm tài khoản. Trang tổng hợp có thể cập nhật chậm hơn quỹ mã của sàn, nên hãy thử mã khác thay vì nhập lại cùng một mã nhiều lần.",
    },
    {
      question: "Mã shop và mã sàn khác nhau ở đâu?",
      answer:
        "Mã shop do người bán phát hành và thường chỉ áp cho sản phẩm của shop đó. Mã sàn do Shopee phát hành, áp theo danh mục hoặc toàn sàn và thường có mốc đơn cao hơn. Hai loại có thể dùng chung nếu chương trình không loại trừ nhau.",
    },
    {
      question: "Có nên mua thêm để đạt mức giảm?",
      answer:
        "Chỉ nên mua thêm nếu món đó thực sự cần. Hãy so số tiền phát sinh với phần được giảm; nếu mua thêm 50.000 đồng để giảm 30.000 đồng thì tổng chi phí vẫn tăng. Mục tiêu là giảm chi phí cho giỏ hàng đã định, không phải làm giỏ hàng lớn hơn.",
    },
    {
      question: "Kiểm tra mã đã áp dụng ở đâu?",
      answer:
        "Ở bước thanh toán, xem dòng giảm giá và tổng tiền cuối cùng. Nếu tổng tiền không đổi sau khi dán mã, mã chưa được áp hoặc đã bị lớp ưu đãi khác thay thế. Quay lại giỏ hàng để kiểm tra trước khi bấm đặt.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "Một mã giảm giá Shopee có thể hết lượt trong vài phút, đổi điều kiện giữa chừng hoặc chỉ áp dụng cho một nhóm tài khoản. Vì vậy, việc nhìn thấy mã trên một trang tổng hợp chưa đủ để kết luận mã còn dùng được hôm nay.",
    },
    {
      kind: "p",
      text: "Bài này không hứa hẹn một mức giảm cố định. Mục tiêu là giúp bạn kiểm tra đúng thứ tự, nhận ra mã nào đang thực sự có tác dụng với giỏ hàng của mình và bỏ qua những mã chỉ làm mất thời gian.",
    },
    { kind: "h2", text: "Vì sao mã công khai vẫn có thể không dùng được?" },
    {
      kind: "p",
      text: "Trang khuyến mãi của Shopee thường hiển thị mã kèm điều kiện và hạn sử dụng. Tuy nhiên, quỹ mã được cấp theo từng đợt, từng tài khoản và từng phương thức thanh toán. Một mã vẫn nằm trên trang nhưng số lượt phát đã hết là chuyện bình thường, nhất là trong các đợt sale lớn.",
    },
    {
      kind: "p",
      text: "Ngoài ra, cùng một mã có thể bị loại trừ bởi chương trình khác đang áp trong giỏ. Hệ thống chỉ hiển thị một mã có lợi nhất hoặc báo lỗi khi hai mã không đi cùng nhau. Đây là lý do nhiều người thấy mã “không hợp lệ” dù đơn đã đủ giá trị tối thiểu.",
    },
    {
      kind: "list",
      items: [
        "Mã đã hết lượt phát dù hạn sử dụng vẫn còn.",
        "Tài khoản chưa đăng nhập đúng hoặc không thuộc nhóm được áp mã.",
        "Sản phẩm trong giỏ thuộc danh mục hoặc shop bị loại trừ.",
        "Phương thức thanh toán chưa đúng với điều kiện của mã.",
        "Mã không cộng dồn với voucher khác đang áp trong giỏ.",
      ],
    },
    { kind: "h2", text: "Bốn bước kiểm tra trước khi thanh toán" },
    {
      kind: "p",
      text: "Cách kiểm tra hiệu quả nhất là đi từ điều kiện chung đến tổng tiền cuối cùng, thay vì dán thử ngẫu nhiên. Bạn chỉ cần làm bốn bước dưới đây một lần cho mỗi đơn hàng.",
    },
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
      kind: "p",
      text: "Sau mỗi lần đổi mã, hãy nhìn tổng tiền cuối cùng thay vì số tiền giảm trên nhãn. Một mã giảm hàng lớn nhưng làm mất freeship có thể khiến tổng tiền cao hơn phương án ngược lại. Đây là lỗi phổ biến khi người mua chỉ so phần trăm giảm.",
    },
    { kind: "h2", text: "Bảng lỗi thường gặp và cách xử lý" },
    {
      kind: "p",
      text: "Bảng dưới đây tóm tắt các tình huống hay gặp nhất. Cách xử lý chỉ mang tính tham khảo; điều kiện hiển thị trên Shopee tại thời điểm mua vẫn là căn cứ cuối cùng.",
    },
    {
      kind: "table",
      caption: "Lỗi áp mã Shopee thường gặp",
      headers: ["Tình huống", "Nguyên nhân có thể", "Cách xử lý"],
      rows: [
        [
          "Mã báo đã hết lượt",
          "Quỹ mã đã phát hết dù vẫn hiển thị",
          "Chọn mã khác cùng mức giảm; không nhập lại liên tục",
        ],
        [
          "Mã không áp cho sản phẩm",
          "Danh mục hoặc shop không tham gia",
          "Kiểm tra mục “Điều kiện” và thử sản phẩm khác",
        ],
        [
          "Đơn đủ tiền nhưng mã không giảm",
          "Điều kiện tính trên giá sau giảm hoặc loại trừ nhau",
          "Bỏ mã khác rồi thử lại; so tổng tiền từng phương án",
        ],
        [
          "Mã freeship không hiện",
          "Địa chỉ, đơn vị giao hoặc hạn mức tài khoản",
          "Đổi địa chỉ nhận hàng và kiểm tra phí ship thực tế",
        ],
        [
          "Tổng tiền không đổi sau khi dán",
          "Mã bị lớp ưu đãi khác thay thế",
          "Bỏ mã rẻ hơn, giữ mã có lợi hơn",
        ],
      ],
    },
    { kind: "h2", text: "Đọc điều kiện trên trang voucher thế nào?" },
    {
      kind: "p",
      text: "Trang voucher thường có phần mô tả ngắn và phần điều kiện chi tiết. Đừng chỉ đọc tiêu đề “giảm 50.000 đồng” mà bỏ qua mốc đơn tối thiểu, danh mục áp dụng và số lần sử dụng. Ba thông tin này quyết định mã có dùng được cho giỏ hàng của bạn hay không.",
    },
    {
      kind: "p",
      text: "Với mã của shop, hãy mở trang shop để xem mã đó có áp cho tất cả sản phẩm hay chỉ một nhóm. Với mã sàn, kiểm tra xem mã có loại trừ hàng đang giảm sẵn, hàng flash sale hoặc một số ngành hàng nhất định. Nếu điều kiện quá dài, ưu tiên đọc phần loại trừ trước.",
    },
    {
      kind: "list",
      items: [
        "Hạn sử dụng thực tế có thể ngắn hơn hạn ghi trên trang nếu mã hết lượt.",
        "Mốc đơn tối thiểu có thể tính trên giá trước hoặc sau giảm.",
        "Mã chỉ dành cho người dùng mới hoặc hạng thành viên cụ thể.",
        "Một số mã không áp cho hàng flash sale hoặc hàng đang giảm sâu.",
      ],
    },
    { kind: "h2", text: "Khi nào nên bỏ mã và mua luôn?" },
    {
      kind: "p",
      text: "Nếu món hàng cần dùng trong vài ngày tới, thời gian chờ mã cũng là một chi phí. Mức tiết kiệm vài chục nghìn không đáng để bạn lỡ kế hoạch hoặc phải mua lại với giá cao hơn. Hãy đặt ngưỡng giá hợp lý trước khi vào sale và mua khi giá đã chạm ngưỡng đó.",
    },
    {
      kind: "p",
      text: "Với đơn nhỏ, phí vận chuyển có thể chiếm tỷ trọng lớn hơn phần giảm giá. Trong trường hợp đó, một mã freeship nhỏ có thể có lợi hơn mã giảm hàng vài phần trăm. Hãy so tổng tiền cuối cùng, không so riêng từng mã.",
    },
    { kind: "h2", text: "Quy trình 5 phút mỗi tuần" },
    {
      kind: "p",
      text: "Thay vì kiểm tra mã mỗi khi mua, bạn có thể dành 5 phút cuối tuần để rà lại các mã sắp hết hạn và lưu lại những mã có điều kiện phù hợp. Cách này giúp giảm thời gian thử mã trong lúc cần mua gấp.",
    },
    {
      kind: "list",
      items: [
        "Mở trang voucher và lọc theo hạn sử dụng gần nhất.",
        "Ghi lại 2–3 mã phù hợp với nhóm hàng bạn hay mua.",
        "Kiểm tra lại điều kiện của mã trước khi lưu vào ghi chú.",
        "Xóa các mã đã hết hạn để không nhầm khi thanh toán.",
      ],
    },
    {
      kind: "tip",
      text: "Đừng mua thêm món không cần chỉ để đạt mức giảm. Hãy so số tiền tiết kiệm thực tế với phần phát sinh; nếu mua thêm 50.000 đồng để giảm 30.000 đồng thì bạn đang lỗ.",
    },
    {
      kind: "p",
      text: "Cách nhanh nhất là bắt đầu từ trang sàn hoặc danh mục đang có deal, sau đó kiểm tra lại mã ở bước thanh toán. Danh sách chỉ giúp bạn thu hẹp lựa chọn; quyết định cuối cùng vẫn là điều kiện hiển thị trên Shopee tại thời điểm mua.",
    },
  ],
};
