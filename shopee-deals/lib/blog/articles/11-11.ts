import { CalendarDays } from "lucide-react";
import type { BlogPost } from "../post-types";

export const sale1111Post: BlogPost = {
  slug: "chuan-bi-sale-11-11",
  title: "Chuẩn bị sale 11.11: checklist 7 việc trước, trong và sau ngày sale",
  excerpt:
    "11.11 không chỉ là một ngày giảm giá. Đây là checklist từng tuần để chốt đúng món, đúng mã và không mua vì cảm giác khẩn cấp.",
  date: "2026-10-20",
  updated: "2026-10-31",
  minutes: 9,
  tag: { label: "Mã & Voucher", href: "/danh-muc/voucher" },
  icon: CalendarDays,
  gradient: "bg-gradient-to-br from-[#5b3a0e] to-[#352208]",
  cover: {
    src: "/images/blog/chuan-bi-sale-11-11.svg",
    alt: "Minh họa lịch chuẩn bị sale 11.11 với danh sách việc cần làm",
    width: 1200,
    height: 630,
    caption:
      "Chuẩn bị từ trước giúp bạn giảm thời gian thử mã và tránh mua ngoài danh sách.",
  },
  author: {
    name: "Ban biên tập Sansale247",
    title: "Nội dung và kiểm duyệt deal",
    href: "/ve-chung-toi",
  },
  hintedCtas: [
    { label: "Voucher mới nhất", href: "/danh-muc/voucher" },
    { label: "Deal Shopee", href: "/san/shopee" },
    { label: "Deal Lazada", href: "/san/lazada" },
    { label: "Landing 11.11", href: "/su-kien/11-11" },
  ],
  faqs: [
    {
      question: "Có nên chờ đúng 0h ngày 11.11 để mua?",
      answer:
        "Không phải món nào cũng cần chờ 0h. Một số chương trình mở theo khung giờ và số lượng giới hạn, nhưng cũng có món giữ nguyên giá trong ngày. Nếu món bạn cần có nguy cơ hết hàng hoặc bạn đã xác định được mức giá hợp lý, hãy mua khi điều kiện đã đủ thay vì chờ một khung giờ không chắc có giảm thêm.",
    },
    {
      question: "Làm sao biết giá 11.11 có thật sự giảm?",
      answer:
        "Hãy ghi lại giá trước sale vài ngày, sau đó so tổng tiền cuối cùng gồm giá, phí ship và mã đã áp. Mức giảm trên nhãn không phải căn cứ duy nhất. Nếu giá trước sale đã bị đẩy lên rồi hạ xuống, mức giảm thực tế có thể thấp hơn con số hiển thị.",
    },
    {
      question: "Có nên mua nhiều để dùng mã lớn?",
      answer:
        "Chỉ nên gom đơn nếu các món đều thật sự cần và tổng chi phí sau giảm vẫn có lợi. Mua thêm một món không dùng để đạt mốc giảm giá thường làm tổng chi phí tăng, dù nhìn qua có cảm giác tiết kiệm hơn.",
    },
    {
      question: "Sau 11.11 có nên chờ đợt sale tiếp theo?",
      answer:
        "Tùy nhu cầu. Nếu món không gấp và bạn muốn theo dõi thêm, có thể chờ, nhưng đừng để việc chờ sale làm trì hoãn một món cần dùng. Hãy đặt mức giá hợp lý trước, và chỉ chờ khi mức giá hiện tại còn cao hơn mức đó đáng kể.",
    },
  ],
  body: [
    {
      kind: "p",
      text: "11.11 là một trong những đợt sale có mật độ khuyến mãi dày nhất trong năm. Giá thay đổi theo khung giờ, mã mở theo đợt, tồn kho của từng biến thể có thể hết nhanh và thời gian giao hàng dài hơn ngày thường. Vì vậy, chuẩn bị trước không chỉ giúp tiết kiệm tiền mà còn giảm thời gian thao tác trong lúc hệ thống đông người.",
    },
    {
      kind: "p",
      text: "Bài này là một checklist thực dụng, không phải danh sách món nên mua. Mục tiêu là giúp bạn chốt đúng nhu cầu, biết mức giá hợp lý và có sẵn phương án khi mã hoặc tồn kho thay đổi. Mọi chương trình cụ thể vẫn do sàn và người bán quyết định tại thời điểm mua.",
    },
    { kind: "h2", text: "11.11 khác ngày thường ở đâu?" },
    {
      kind: "p",
      text: "Điểm khác biệt lớn nhất không phải là việc mọi sản phẩm đều rẻ hơn, mà là cách các chương trình được xếp lớp. Mã sàn, mã shop, freeship và ưu đãi thanh toán có thể mở ở những thời điểm khác nhau. Một số mã chỉ áp cho danh mục hoặc nhóm người dùng nhất định; một số chương trình giới hạn số lượt trong ngày.",
    },
    {
      kind: "p",
      text: "Tồn kho cũng là yếu tố cần tính. Biến thể phổ biến như size, màu hoặc dung lượng có thể hết trước khi bạn kịp áp mã. Nếu bạn cần đúng một biến thể, hãy kiểm tra trước và có phương án dự phòng. Đừng chờ đến phút cuối rồi mua một biến thể không phù hợp chỉ vì nó còn hàng.",
    },
    {
      kind: "list",
      items: [
        "Khuyến mãi mở theo nhiều đợt, không chỉ một thời điểm.",
        "Mã có thể giới hạn số lượt, danh mục hoặc phương thức thanh toán.",
        "Tồn kho của biến thể phổ biến có thể giảm nhanh.",
        "Thời gian xử lý và giao hàng thường dài hơn ngày thường.",
        "Giá niêm yết có thể thay đổi trước và trong ngày sale.",
      ],
    },
    { kind: "h2", text: "Checklist từ T-7 đến sau ngày sale" },
    {
      kind: "p",
      text: "Bảng dưới đây chia việc cần làm theo mốc thời gian. Bạn không cần làm tất cả cùng lúc; chỉ cần hoàn thành nhóm việc trước ngày sale và kiểm tra lại vào ngày 11.11.",
    },
    {
      kind: "table",
      caption: "Gợi ý phân bổ việc chuẩn bị cho 11.11",
      headers: ["Thời điểm", "Việc cần làm", "Kết quả mong đợi"],
      rows: [
        [
          "Trước 7 ngày",
          "Lập danh sách món cần mua, ghi mức giá tối đa và số lượng",
          "Có danh sách rõ ràng, tránh mua theo quảng cáo",
        ],
        [
          "Trước 3 ngày",
          "Kiểm tra biến thể, người bán, chính sách đổi trả và giá tham chiếu",
          "Biết món nào thực sự phù hợp và mức giá hợp lý",
        ],
        [
          "Trước 1 ngày",
          "Lưu địa chỉ, phương thức thanh toán, mã dự kiến và giỏ hàng",
          "Giảm thao tác trong lúc sale mở",
        ],
        [
          "Ngày 11.11",
          "Áp mã theo thứ tự, kiểm tra tổng tiền và tồn kho trước khi đặt",
          "Chốt đơn đúng nhu cầu, không bỏ sót mã",
        ],
        [
          "Sau ngày sale",
          "Lưu xác nhận đơn, theo dõi giao hàng và kiểm tra hàng khi nhận",
          "Có bằng chứng khi cần hỗ trợ hoặc đổi trả",
        ],
      ],
    },
    { kind: "h2", text: "Lập ngân sách và danh sách mua" },
    {
      kind: "p",
      text: "Hãy bắt đầu bằng ba nhóm: món cần mua trong tháng, món cần thay thế và món chỉ nên mua nếu có mức giá tốt. Nhóm đầu tiên nên được ưu tiên, vì tiết kiệm trên một món bạn chắc chắn dùng vẫn có giá trị hơn mua một món không cần chỉ vì giảm sâu.",
    },
    {
      kind: "p",
      text: "Với mỗi món, ghi mức giá tối đa bạn sẵn sàng trả. Con số này nên dựa trên giá bạn đã theo dõi trước đó, không dựa trên giá niêm yết trong ngày sale. Khi giá xuống dưới mức đó và món vẫn đúng nhu cầu, bạn có thể chốt; nếu không, bỏ qua mà không tiếc.",
    },
    {
      kind: "list",
      items: [
        "Nhóm 1: món cần dùng trong 30 ngày tới.",
        "Nhóm 2: món thay thế khi món cũ đã hỏng hoặc sắp hết.",
        "Nhóm 3: món chỉ mua nếu giá thấp hơn mức hợp lý đã đặt.",
        "Đặt giới hạn tổng ngân sách cho cả đợt sale.",
        "Không dùng tiền dành cho việc khác để mua vì giá đang giảm.",
      ],
    },
    {
      kind: "tip",
      text: "Một mẹo đơn giản: ghi giá và số lượng vào ghi chú điện thoại trước ngày sale. Khi vào app, bạn chỉ cần đối chiếu với danh sách thay vì duyệt toàn bộ trang khuyến mãi.",
    },
    { kind: "h2", text: "Chuẩn bị giỏ hàng và thanh toán" },
    {
      kind: "p",
      text: "Trước ngày sale, hãy thêm đúng sản phẩm và đúng biến thể vào giỏ. Kiểm tra lại size, màu, dung lượng, số lượng và người bán. Nếu sản phẩm có nhiều phiên bản, hãy chắc chắn bạn đang chọn đúng phiên bản muốn mua, vì giá và khuyến mãi có thể khác nhau.",
    },
    {
      kind: "p",
      text: "Lưu địa chỉ giao hàng và phương thức thanh toán trước. Trong lúc cao điểm, việc nhập lại thông tin hoặc xác thực thêm có thể làm bạn mất vài phút, đủ để mã hoặc tồn kho thay đổi. Nếu phương thức thanh toán có ưu đãi riêng, hãy đọc điều kiện trước vì không phải thẻ hay ví nào cũng áp dụng.",
    },
    {
      kind: "list",
      items: [
        "Chọn đúng biến thể và số lượng trước ngày sale.",
        "Lưu địa chỉ nhận hàng chính xác, có ghi chú nếu cần.",
        "Kiểm tra phương thức thanh toán và ưu đãi đi kèm.",
        "Đọc điều kiện của mã sẽ dùng, không chỉ lưu mã.",
        "Chuẩn bị phương án dự phòng nếu biến thể hết hàng.",
      ],
    },
    { kind: "h2", text: "Trong ngày sale: thứ tự thao tác" },
    {
      kind: "p",
      text: "Khi sale mở, hãy làm theo thứ tự: mở đúng sản phẩm, kiểm tra biến thể và giá, thêm vào giỏ, áp mã, rồi kiểm tra tổng tiền cuối cùng. Đừng bấm thanh toán ngay sau khi thấy nhãn giảm giá. Tổng tiền sau khi cộng phí ship và trừ mã mới là con số bạn thực trả.",
    },
    {
      kind: "p",
      text: "Nếu mã báo lỗi, đọc thông báo thay vì nhập lại liên tục. Có thể mã đã hết lượt, không áp cho danh mục đang mua hoặc bị một mã khác thay thế. Hãy thử bỏ mã có giá trị thấp hơn, hoặc so tổng tiền giữa hai phương án để chọn cách có lợi hơn.",
    },
    {
      kind: "list",
      items: [
        "Kiểm tra giá và biến thể trước khi thêm vào giỏ.",
        "Áp mã shop, mã sàn và freeship theo thứ tự phù hợp.",
        "Đọc thông báo lỗi thay vì nhập lại nhiều lần.",
        "So tổng tiền cuối cùng, không chỉ nhìn mức giảm.",
        "Chụp ảnh màn hình đơn hàng sau khi đặt thành công.",
      ],
    },
    { kind: "h2", text: "Sau ngày sale: theo dõi và xử lý" },
    {
      kind: "p",
      text: "Sau khi đặt, hãy lưu xác nhận đơn, mã đã áp và tổng tiền. Nếu đơn bị hủy hoặc giá thay đổi, bạn có bằng chứng để đối chiếu. Theo dõi trạng thái giao hàng và chuẩn bị thời gian nhận hàng, đặc biệt với món dễ hỏng hoặc món cần dùng gấp.",
    },
    {
      kind: "p",
      text: "Khi nhận hàng, kiểm tra ngoại quan, phụ kiện và tình trạng sản phẩm trước khi xác nhận. Với hàng dễ hỏng hoặc giá trị cao, quay video mở gói để có bằng chứng nếu cần hỗ trợ. Đừng chờ quá thời hạn đổi trả mới kiểm tra.",
    },
    {
      kind: "p",
      text: "Cuối cùng, hãy ghi lại món nào đáng mua và món nào không. Kinh nghiệm từ một đợt sale sẽ giúp bạn chuẩn bị tốt hơn cho đợt tiếp theo, thay vì lặp lại cùng một danh sách và cùng một lỗi.",
    },
  ],
};
