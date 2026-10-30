import type { LandingFaq } from "@/lib/landing/content";

/**
 * Editorial copy for seasonal sale landing pages. Keep claims factual and
 * time-bound: we aggregate public/partner offers, we do not sell or fulfil
 * orders, and discounts change by account, region and time slot.
 */
export type SaleEventLanding = {
  slug: string;
  badge: string;
  title: string;
  description: string;
  startISO: string;
  endISO: string;
  intro: string[];
  highlights: string[];
  checklist: Array<{ title: string; intro: string; items: string[] }>;
  guide: Array<{ title: string; paragraphs: string[] }>;
  faqs: LandingFaq[];
};

export const SALE_EVENT_LANDINGS: SaleEventLanding[] = [
  {
    slug: "11-11",
    badge: "Sự kiện · 11.11",
    title: "Săn sale 11.11: mã giảm giá, lịch sale và checklist trước giờ G",
    description:
      "Tổng hợp deal đang chạy, cách xếp mã và checklist chuẩn bị cho ngày 11.11 — cập nhật từ Shopee, Tiki, Lazada và TikTok Shop.",
    startISO: "2026-11-11T00:00:00+07:00",
    endISO: "2026-11-12T00:00:00+07:00",
    intro: [
      "11.11 là một trong những ngày sale lớn nhất năm của các sàn thương mại điện tử tại Việt Nam. Trong ngày này, các sàn thường mở nhiều đợt mã, freeship và deal theo khung giờ; mức giảm và điều kiện có thể khác nhau theo tài khoản, khu vực và ngành hàng. Vì vậy, chuẩn bị trước vài ngày thường hiệu quả hơn việc mở app đúng 0h rồi thử từng mã.",
      "Trang này tổng hợp các deal đang hoạt động từ dữ liệu công khai và đối tác của Sansale247, kèm hướng dẫn kiểm tra giá, xếp mã và xử lý sau khi mua. Chúng tôi không bán hàng, không giữ hàng và không xử lý đơn; mọi giao dịch diễn ra trên sàn hoặc với người bán.",
      "Mục tiêu của trang không phải là liệt kê thật nhiều mã, mà giúp bạn chọn đúng món, đúng mức giá và tránh mua vì cảm giác sợ bỏ lỡ. Hãy dùng danh sách bên dưới như một checklist, không phải lời hứa về mức giảm cụ thể.",
    ],
    highlights: [
      "Deal đang chạy được cập nhật từ nguồn affiliate của các sàn",
      "Checklist trước, trong và sau ngày sale",
      "Cách xếp mã shop, mã sàn và freeship đúng thứ tự",
      "Ghi chú rõ điều kiện và rủi ro giá ảo",
      "Link affiliate minh bạch, không làm tăng giá bạn trả",
      "FAQ về thời gian, hoàn tiền và bảo hành",
    ],
    checklist: [
      {
        title: "Trước 11.11 (01–10/11)",
        intro:
          "Mục tiêu: chốt danh sách và ngân sách trước khi giá và mã thay đổi.",
        items: [
          "Lập danh sách món thật sự cần, kèm mức giá tối đa bạn sẵn sàng trả cho từng món.",
          "Chụp lại giá trước sale để so sánh, tránh trường hợp giá bị đẩy lên rồi hạ xuống.",
          "Thêm sản phẩm vào giỏ, chọn đúng biến thể, kích thước và màu sắc.",
          "Lưu địa chỉ giao hàng và phương thức thanh toán trước ngày sale.",
          "Ghi lại điều kiện của các mã đang quan tâm: đơn tối thiểu, ngành hàng, hạn dùng.",
          "Đặt giới hạn tổng chi tiêu và tách ngân sách cho từng sàn nếu mua nhiều nơi.",
        ],
      },
      {
        title: "Trong ngày 11.11",
        intro:
          "Mục tiêu: mua đúng thứ đã chọn, không bị cuốn theo thông báo và livestream.",
        items: [
          "Mở sàn sớm để kiểm tra giá, tồn kho và mã trước khi vào khung giờ cao điểm.",
          "Áp mã theo thứ tự: mã shop → mã sàn ở giỏ hàng → freeship; kiểm tra tổng tiền sau mỗi lần.",
          "So sánh cùng một món giữa các sàn thay vì chỉ nhìn nhãn giảm giá.",
          "Kiểm tra phí vận chuyển và thời gian giao trước khi bấm thanh toán.",
          "Không mua thêm món không có trong danh sách chỉ để đạt mốc freeship.",
          "Lưu ảnh chụp màn hình giá, mã đã áp và tổng thanh toán.",
        ],
      },
      {
        title: "Sau khi đặt hàng",
        intro:
          "Mục tiêu: giữ bằng chứng và xử lý kịp nếu đơn sai hoặc giao chậm.",
        items: [
          "Kiểm tra email hoặc ứng dụng để xác nhận đơn đã được tạo.",
          "Theo dõi trạng thái giao hàng; liên hệ người bán nếu đơn quá hạn xử lý.",
          "Đối chiếu món nhận được với mô tả, số lượng và biến thể đã đặt.",
          "Giữ lại mã vận đơn và ảnh chụp để làm bằng chứng khi cần hoàn tiền.",
          "Đánh giá trung thực sau khi nhận hàng để giúp người mua sau.",
        ],
      },
    ],
    guide: [
      {
        title: "Vì sao nên chuẩn bị trước?",
        paragraphs: [
          "Trong các đợt sale lớn, giá, tồn kho và điều kiện mã thay đổi rất nhanh. Nếu đợi đến đúng ngày mới chọn món, bạn dễ bị cuốn vào thông báo giảm giá và mua những thứ không nằm trong kế hoạch. Chuẩn bị danh sách trước giúp bạn so sánh giá dễ hơn, biết món nào thật sự cần và giữ được ngân sách.",
          "Một danh sách tốt không cần dài. Năm đến mười món, mỗi món có mức giá mục tiêu và lý do mua, thường hữu ích hơn một giỏ hàng đầy sản phẩm chưa được cân nhắc. Với món giá trị lớn, hãy kiểm tra thêm chính sách bảo hành và đổi trả trước khi chốt.",
        ],
      },
      {
        title: "Cách xếp ba lớp ưu đãi",
        paragraphs: [
          "Một đơn hàng có thể có nhiều lớp giảm: mã của shop, mã của sàn áp ở giỏ hàng và ưu đãi vận chuyển. Thứ tự và khả năng cộng dồn phụ thuộc vào quy định của từng sàn, từng chương trình và từng tài khoản. Cách an toàn là áp từng lớp một, kiểm tra tổng tiền sau mỗi lần và bỏ lớp có giá trị thấp hơn nếu hai mã không được dùng cùng lúc.",
          "Đừng giả định mọi mã đều cộng dồn. Một số mã loại trừ nhau, một số chỉ áp cho ngành hàng hoặc phương thức thanh toán nhất định. Nếu tổng giảm không thay đổi sau khi nhập mã, rất có thể mã đó không được áp dụng; hãy đọc thông báo lỗi thay vì tiếp tục thử.",
        ],
      },
      {
        title: "Khung giờ nào đáng chú ý?",
        paragraphs: [
          "Nhiều sàn thường mở các đợt mã vào những khung giờ cố định như 0h, 9h, 12h và 20h, nhưng lịch thực tế do từng sàn công bố và có thể thay đổi. Thay vì canh tất cả khung giờ, hãy chọn một đến hai khung phù hợp với lịch sinh hoạt và tập trung vào món đã có trong danh sách.",
          "Các khung giờ cao điểm cũng là lúc lượng người truy cập tăng, trang có thể chậm và mã dễ hết lượt. Nếu không mua gấp, bạn có thể chờ qua đợt cao điểm để thao tác ổn định hơn; ưu đãi có thể còn hoặc không, nhưng ít nhất bạn tránh được quyết định vội.",
        ],
      },
      {
        title: "Cách nhận biết giá tốt thật",
        paragraphs: [
          "Giá tốt là giá thấp hơn mức bạn đã ghi lại trước sale, không phải giá có nhãn giảm sâu nhất. Hãy so sánh giá sau giảm, phí vận chuyển và tổng tiền phải trả. Với sản phẩm cùng loại, so sánh thêm cấu hình, dung lượng, số lượng và chính sách bảo hành để tránh mua phải bản rút gọn.",
          "Đánh giá người bán cũng quan trọng: điểm đánh giá, số lượng đã bán, thời gian hoạt động và phản hồi với người mua trước. Một mức giảm vài chục nghìn không đáng nếu sản phẩm không rõ nguồn gốc hoặc không được bảo hành.",
        ],
      },
      {
        title: "Sai lầm thường gặp",
        paragraphs: [
          "Sai lầm phổ biến nhất là mua vì sợ bỏ lỡ. Thông báo “còn 1 giờ”, “sắp hết mã” có thể tạo cảm giác khẩn cấp, nhưng không thay đổi việc bạn có cần món đó hay không. Một món không cần thì giảm 50% vẫn là khoản chi không cần thiết.",
          "Sai lầm thứ hai là bỏ qua điều kiện hoàn tiền và đổi trả. Trước khi mua, hãy đọc chính sách của sàn và người bán, đặc biệt với hàng điện tử, mỹ phẩm và thực phẩm. Nếu cần xuất hoá đơn hoặc bảo hành, hãy kiểm tra trước khi thanh toán.",
        ],
      },
    ],
    faqs: [
      {
        question: "11.11 năm nay rơi vào ngày nào?",
        answer:
          "Ngày 11.11.2026 rơi vào thứ Tư. Các sàn có thể mở sale từ trước đó và kéo dài sang ngày 12.11; lịch cụ thể do từng sàn công bố.",
      },
      {
        question: "Sansale247 có bán hàng hoặc xử lý đơn không?",
        answer:
          "Không. Website chỉ tổng hợp thông tin khuyến mãi và dẫn link đến sàn hoặc người bán. Mọi giao dịch, thanh toán, vận chuyển, đổi trả và bảo hành do sàn hoặc người bán xử lý.",
      },
      {
        question: "Mã trên trang có dùng được cho mọi tài khoản không?",
        answer:
          "Không hẳn. Nhiều mã giới hạn người dùng mới, hạng thành viên, phương thức thanh toán, ngành hàng hoặc số lượng. Hãy đọc điều kiện trên trang đích và kiểm tra ở bước thanh toán.",
      },
      {
        question: "Có nên chờ đúng 0h ngày 11.11 để mua?",
        answer:
          "Chỉ nên chờ nếu món đó thật sự cần và bạn đã chuẩn bị sẵn giỏ hàng, địa chỉ, phương thức thanh toán. Nếu không, việc chờ đúng giờ có thể dẫn đến mua vội. Hãy ưu tiên món trong danh sách và mức giá mục tiêu.",
      },
      {
        question: "Freeship có cộng được với mã giảm giá không?",
        answer:
          "Tuỳ chương trình. Một số ưu đãi vận chuyển áp dụng song song với mã hàng hoá, một số thì loại trừ nhau. Hãy thử từng lớp và kiểm tra tổng tiền trước khi thanh toán.",
      },
      {
        question: "Mua qua link affiliate có đắt hơn không?",
        answer:
          "Không. Giá bạn trả do sàn hoặc người bán quyết định. Khi đơn hợp lệ, Sansale247 có thể nhận hoa hồng từ sàn; khoản này không cộng thêm vào giá.",
      },
      {
        question: "Hàng mua ngày 11.11 có được đổi trả không?",
        answer:
          "Chính sách đổi trả do sàn hoặc người bán quy định và có thể khác ngày thường. Hãy đọc kỹ trước khi mua, đặc biệt với hàng điện tử, mỹ phẩm và thực phẩm.",
      },
      {
        question: "Làm sao biết deal còn hiệu lực?",
        answer:
          "Trang chi tiết luôn dẫn đến trang đích của sàn; hãy kiểm tra giá, tồn kho và điều kiện ở đó. Dữ liệu trên Sansale247 được cập nhật tự động nhưng có thể chậm hơn thay đổi thực tế của sàn.",
      },
    ],
  },
];

export function getSaleEventLanding(slug: string) {
  return SALE_EVENT_LANDINGS.find((event) => event.slug === slug);
}
