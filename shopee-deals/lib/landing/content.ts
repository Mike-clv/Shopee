import type { Merchant } from "@/lib/site";
import {
  MERCHANT_EXTRA_FAQS,
  MERCHANT_SECTIONS,
  type LandingSection,
} from "./merchant-sections";

export type LandingFaq = { question: string; answer: string };

export type MerchantLanding = {
  slug: Merchant;
  title: string;
  description: string;
  intro: string[];
  highlights: string[];
  sections: LandingSection[];
  faqs: LandingFaq[];
};

export type CategoryLanding = {
  title: string;
  description: string;
  intro: string[];
  highlights: string[];
};

/**
 * Landing copy for /san/[merchant]. Kept in one place so metadata, page copy
 * and JSON-LD stay in sync. Claims stay factual: we aggregate public/partner
 * offers, we do not sell or fulfil orders.
 */
const BASE_MERCHANT_LANDING: Record<Merchant, Omit<MerchantLanding, "sections">> = {
  shopee: {
    slug: "shopee",
    title: "Mã giảm giá Shopee hôm nay",
    description:
      "Tổng hợp mã giảm giá, voucher freeship và deal Shopee còn hiệu lực — kèm điều kiện, hạn dùng và link sản phẩm rõ ràng.",
    intro: [
      "Shopee là sàn có lượng mã giảm giá và chương trình freeship thay đổi liên tục. Sansale247 tổng hợp các mã đang hoạt động, ghi rõ điều kiện áp dụng và dẫn đến đúng trang sản phẩm để bạn không mất thời gian thử từng mã.",
      "Danh sách được đồng bộ qua AccessTrade và đối chiếu với trang đích khi có thể. Mã có thể hết lượt, đổi điều kiện hoặc ngừng áp dụng bất cứ lúc nào; hãy kiểm tra lại ở bước thanh toán trước khi dùng.",
    ],
    highlights: [
      "Mã giảm giá, voucher freeship và deal sản phẩm theo danh mục",
      "Ghi chú điều kiện, hạn sử dụng và link đích khi có thông tin",
      "Link affiliate được tiết lộ rõ; hoa hồng không làm tăng giá bạn trả",
      "Dữ liệu chương trình cập nhật tự động qua AccessTrade",
    ],
    faqs: [
      {
        question: "Mã giảm giá Shopee trên Sansale247 có phải do Shopee phát hành?",
        answer:
          "Không. Sansale247 tổng hợp mã và chương trình công khai hoặc từ đối tác tiếp thị. Shopee là bên quyết định hiệu lực, điều kiện và thời hạn của từng mã.",
      },
      {
        question: "Vì sao mã tôi chọn không áp dụng được?",
        answer:
          "Mã có thể đã hết lượt, hết hạn, không đúng danh mục hoặc giá trị đơn tối thiểu, hoặc chỉ áp dụng cho một số tài khoản. Bạn nên đọc điều kiện trên trang sản phẩm và thử lại ở bước thanh toán.",
      },
      {
        question: "Sansale247 có bán hàng hoặc xử lý đơn Shopee không?",
        answer:
          "Không. Website chỉ giới thiệu thông tin khuyến mãi và dẫn link. Mọi giao dịch, thanh toán, vận chuyển, đổi trả và bảo hành do Shopee hoặc người bán xử lý.",
      },
      {
        question: "Mua qua link trên website có đắt hơn không?",
        answer:
          "Không. Giá bạn trả do sàn hoặc người bán quyết định. Khi phát sinh đơn hợp lệ, Sansale247 có thể nhận hoa hồng từ sàn; khoản này không cộng thêm vào giá.",
      },
    ],
  },
  tiki: {
    slug: "tiki",
    title: "Deal Tiki & mã giảm giá mới nhất",
    description:
      "Deal Tiki giá tốt, voucher freeship và sản phẩm chính hãng được tổng hợp, kèm ghi chú điều kiện trước khi bạn mua.",
    intro: [
      "Tiki có thế mạnh ở sách, điện tử và hàng chính hãng, với nhiều chương trình giảm giá theo mùa. Sansale247 tổng hợp deal Tiki đang hoạt động để bạn so sánh nhanh theo danh mục và mức giảm.",
      "Giá và tồn kho trên Tiki có thể thay đổi theo thời điểm. Website ghi chú thông tin có thể kiểm chứng và luôn dẫn về trang đích để bạn xem giá cuối cùng, phí vận chuyển và chính sách đổi trả.",
    ],
    highlights: [
      "Deal sách, điện tử, gia dụng và hàng chính hãng",
      "Voucher freeship và mã giảm giá theo chương trình",
      "Thông tin giá, mức giảm và hạn dùng khi có dữ liệu",
      "Link affiliate minh bạch, không thay đổi giá bạn trả",
    ],
    faqs: [
      {
        question: "Deal Tiki trên Sansale247 có phải giá cuối cùng?",
        answer:
          "Không. Giá có thể thay đổi theo thời điểm, khu vực và chương trình. Hãy kiểm tra giá, phí ship và ưu đãi ở trang Tiki trước khi thanh toán.",
      },
      {
        question: "Tôi có cần tài khoản Tiki để mua không?",
        answer:
          "Việc tạo tài khoản và đặt hàng do Tiki quy định. Sansale247 không yêu cầu tài khoản và không xử lý đơn hàng của bạn.",
      },
      {
        question: "Sản phẩm Tiki có được bảo hành không?",
        answer:
          "Chính sách bảo hành, đổi trả do Tiki hoặc nhà bán quy định. Bạn nên đọc kỹ thông tin sản phẩm và chính sách trên trang đích trước khi mua.",
      },
      {
        question: "Sansale247 nhận hoa hồng từ Tiki như thế nào?",
        answer:
          "Khi bạn mua qua link affiliate, Tiki có thể trả cho Sansale247 một khoản hoa hồng. Khoản này do bên bán chi trả và không làm tăng giá bạn phải trả.",
      },
    ],
  },
  lazada: {
    slug: "lazada",
    title: "Mã giảm giá Lazada & deal đang chạy",
    description:
      "Voucher Lazada, mã freeship và deal flash sale được cập nhật thường xuyên, kèm ghi chú điều kiện áp dụng.",
    intro: [
      "Lazada thường xuyên có voucher, mã freeship và flash sale theo khung giờ. Sansale247 tổng hợp các deal đang chạy để bạn dễ chọn theo danh mục, mức giảm và thời hạn.",
      "Một số chương trình chỉ áp dụng cho người dùng mới, phương thức thanh toán nhất định hoặc số lượng giới hạn. Website ghi chú điều kiện khi có thông tin và dẫn về trang Lazada để bạn kiểm tra lần cuối.",
    ],
    highlights: [
      "Voucher Lazada và mã freeship theo chương trình",
      "Deal flash sale, hàng điện tử, thời trang và gia dụng",
      "Ghi chú điều kiện, hạn dùng và đối tượng áp dụng",
      "Tiết lộ affiliate rõ ràng trên từng trang",
    ],
    faqs: [
      {
        question: "Voucher Lazada trên website có dùng được cho mọi tài khoản?",
        answer:
          "Không hẳn. Một số voucher giới hạn người dùng mới, hạng thành viên, phương thức thanh toán hoặc danh mục. Hãy đọc điều kiện trên trang Lazada trước khi áp dụng.",
      },
      {
        question: "Deal Lazada hết hàng thì sao?",
        answer:
          "Sansale247 không giữ hàng và không thể đặt hàng thay bạn. Nếu sản phẩm hết hàng, bạn có thể xem deal tương tự trên website hoặc tìm trực tiếp trên Lazada.",
      },
      {
        question: "Tôi có thể hoàn hàng Lazada qua Sansale247 không?",
        answer:
          "Không. Yêu cầu đổi trả, hoàn tiền và bảo hành phải gửi đến Lazada hoặc người bán theo quy trình trên trang đơn hàng.",
      },
      {
        question: "Sansale247 có phải website chính thức của Lazada?",
        answer:
          "Không. Sansale247 là website độc lập tổng hợp khuyến mãi, không đại diện và không phát ngôn thay Lazada.",
      },
    ],
  },
  tiktokshop: {
    slug: "tiktokshop",
    title: "Deal TikTok Shop & voucher mới nhất",
    description:
      "Tổng hợp deal TikTok Shop, voucher và sản phẩm đang giảm giá, kèm lưu ý về người bán và chính sách đổi trả.",
    intro: [
      "TikTok Shop có nhiều deal từ livestream, shop nhỏ và thương hiệu, với tốc độ thay đổi nhanh. Sansale247 tổng hợp sản phẩm đang giảm giá để bạn tham khảo trước khi mua.",
      "Vì người bán trên TikTok Shop rất đa dạng, hãy kiểm tra đánh giá shop, chính sách đổi trả và thông tin sản phẩm trên trang đích. Website không xác minh chất lượng của từng người bán.",
    ],
    highlights: [
      "Deal TikTok Shop theo danh mục và mức giảm",
      "Voucher, mã giảm giá và chương trình livestream khi có",
      "Lưu ý kiểm tra người bán, đánh giá và chính sách đổi trả",
      "Link affiliate minh bạch, không làm tăng giá bạn trả",
    ],
    faqs: [
      {
        question: "Sản phẩm TikTok Shop trên website có đáng tin không?",
        answer:
          "Sansale247 không xác minh từng người bán. Bạn nên xem đánh giá shop, số lượng đã bán, chính sách đổi trả và thông tin sản phẩm trên TikTok Shop trước khi mua.",
      },
      {
        question: "Vì sao giá TikTok Shop thay đổi nhanh?",
        answer:
          "Giá có thể thay đổi theo livestream, voucher, tồn kho và chương trình của người bán. Giá trên website chỉ mang tính tham khảo tại thời điểm đăng.",
      },
      {
        question: "Tôi có thể hủy đơn TikTok Shop qua Sansale247 không?",
        answer:
          "Không. Mọi thao tác đơn hàng, hủy đơn, hoàn tiền và khiếu nại phải thực hiện trên TikTok Shop hoặc với người bán.",
      },
      {
        question: "Mua qua link TikTok Shop trên website có lợi gì?",
        answer:
          "Bạn vẫn trả mức giá hiển thị trên TikTok Shop. Nếu đơn hợp lệ, Sansale247 có thể nhận hoa hồng affiliate từ nền tảng để duy trì website.",
      },
    ],
  },
};

/**
 * Landing copy for /danh-muc/[slug]. Each category gets a distinct angle so
 * the pages are not thin duplicates of the search filter.
 */
export const CATEGORY_LANDING: Record<string, CategoryLanding> = {
  freeship: {
    title: "Deal freeship & mã miễn phí vận chuyển",
    description:
      "Tổng hợp mã freeship, voucher miễn phí vận chuyển và deal có ship 0 đồng từ Shopee, Tiki, Lazada, TikTok Shop.",
    intro: [
      "Freeship là một trong những yếu tố quyết định khi mua online, nhất là với đơn giá trị nhỏ. Trang này tổng hợp các mã và deal có ưu đãi vận chuyển đang được ghi nhận.",
      "Điều kiện freeship thường phụ thuộc giá trị đơn tối thiểu, khu vực giao hàng, đơn vị vận chuyển và hạn mức của từng tài khoản. Hãy kiểm tra ở bước thanh toán vì chương trình có thể kết thúc trước thời hạn ghi trên website.",
    ],
    highlights: [
      "Mã freeship và voucher miễn phí vận chuyển",
      "Deal có ship 0 đồng hoặc giảm phí giao hàng",
      "Ghi chú đơn tối thiểu và khu vực áp dụng khi có",
      "Tổng hợp từ nhiều sàn, cập nhật thường xuyên",
    ],
  },
  food: {
    title: "Deal bách hóa & ăn vặt giá tốt",
    description:
      "Deal bánh kẹo, đồ ăn vặt, thực phẩm khô và bách hóa từ các sàn, kèm lưu ý hạn dùng và phí vận chuyển.",
    intro: [
      "Bách hóa và ăn vặt là nhóm hàng mua lặp lại, nên giá trị đơn và phí ship ảnh hưởng lớn đến tổng chi phí. Trang này gom các deal đang giảm giá để bạn dễ so sánh.",
      "Với thực phẩm, hãy kiểm tra hạn sử dụng, điều kiện bảo quản và nguồn gốc trên trang đích. Website chỉ tổng hợp thông tin khuyến mãi, không bán hoặc vận chuyển hàng.",
    ],
    highlights: [
      "Bánh kẹo, đồ ăn vặt, thực phẩm khô",
      "Deal mua số lượng lớn và combo tiết kiệm",
      "Lưu ý hạn dùng, bảo quản và phí ship",
      "So sánh deal giữa Shopee, Tiki, Lazada, TikTok Shop",
    ],
  },
  beauty: {
    title: "Deal làm đẹp & chăm sóc da",
    description:
      "Deal mỹ phẩm, skincare, nước hoa và sản phẩm chăm sóc cá nhân đang giảm giá, kèm lưu ý chọn hàng chính hãng.",
    intro: [
      "Mỹ phẩm và skincare là nhóm hàng dễ gặp giá ảo hoặc hàng không rõ nguồn gốc. Trang này tổng hợp deal đang giảm giá, nhưng bạn vẫn nên kiểm tra thương hiệu, date và người bán.",
      "Giá tốt chỉ có ý nghĩa khi sản phẩm phù hợp với da và đúng nhu cầu. Hãy đọc thành phần, hướng dẫn sử dụng và chính sách đổi trả trên trang đích trước khi mua.",
    ],
    highlights: [
      "Skincare, makeup, nước hoa và chăm sóc cá nhân",
      "Deal từ shop chính hãng và nhà bán uy tín",
      "Lưu ý date, thành phần và xuất xứ",
      "Tổng hợp nhiều sàn, dễ so sánh giá",
    ],
  },
  health: {
    title: "Deal sức khỏe & thực phẩm bổ sung",
    description:
      "Deal vitamin, thực phẩm bổ sung và sản phẩm chăm sóc sức khỏe đang giảm giá, kèm lưu ý trước khi sử dụng.",
    intro: [
      "Thực phẩm bổ sung và sản phẩm sức khỏe cần được chọn cẩn thận hơn hàng tiêu dùng thông thường. Trang này tổng hợp deal để bạn tham khảo, không thay thế tư vấn y tế.",
      "Hãy kiểm tra thành phần, liều dùng, hạn sử dụng và giấy công bố trên trang đích. Nếu đang điều trị bệnh hoặc dùng thuốc, bạn nên hỏi ý kiến bác sĩ trước khi dùng sản phẩm mới.",
    ],
    highlights: [
      "Vitamin, thực phẩm bổ sung, đồ chăm sóc sức khỏe",
      "Deal từ nhà bán có thông tin sản phẩm rõ ràng",
      "Lưu ý thành phần, hạn dùng và liều dùng",
      "Không thay thế tư vấn của chuyên gia y tế",
    ],
  },
  book: {
    title: "Deal sách & văn phòng phẩm",
    description:
      "Deal sách, giáo trình, truyện và văn phòng phẩm đang giảm giá từ các sàn, phù hợp học tập và làm việc.",
    intro: [
      "Sách và văn phòng phẩm thường có mức giảm ổn định hơn hàng thời trang hay điện tử. Trang này gom các đầu sách, giáo trình và đồ dùng học tập đang được giảm giá.",
      "Với sách, bạn nên kiểm tra tên tác giả, nhà xuất bản, phiên bản và tình trạng sản phẩm. Với văn phòng phẩm, hãy chú ý số lượng và thời gian giao hàng nếu cần gấp.",
    ],
    highlights: [
      "Sách, truyện, giáo trình luyện thi",
      "Văn phòng phẩm, sổ tay, dụng cụ học tập",
      "Deal theo bộ và combo tiết kiệm",
      "So sánh giá giữa các sàn trước khi mua",
    ],
  },
  electronics: {
    title: "Deal điện tử & công nghệ",
    description:
      "Deal điện thoại, tai nghe, laptop, phụ kiện công nghệ đang giảm giá, kèm lưu ý bảo hành và cấu hình.",
    intro: [
      "Điện tử là nhóm hàng có giá trị cao, nên cần kiểm tra kỹ trước khi mua. Trang này tổng hợp deal điện thoại, tai nghe, laptop và phụ kiện đang được giảm giá.",
      "Hãy đối chiếu cấu hình, phiên bản, tình trạng hàng và chính sách bảo hành trên trang đích. Giá rẻ bất thường có thể đi kèm hàng cũ, hàng refub hoặc bảo hành ngắn.",
    ],
    highlights: [
      "Điện thoại, tablet, laptop, tai nghe",
      "Phụ kiện công nghệ và thiết bị thông minh",
      "Lưu ý cấu hình, phiên bản và bảo hành",
      "Deal từ nhiều sàn, dễ so sánh giá",
    ],
  },
  fashion: {
    title: "Deal thời trang & giày dép",
    description:
      "Deal quần áo, giày dép, túi xách và phụ kiện thời trang đang giảm giá, kèm lưu ý size và đổi trả.",
    intro: [
      "Thời trang là nhóm hàng có nhiều biến thể size và mẫu mã, nên tỷ lệ đổi trả cao hơn. Trang này tổng hợp deal quần áo, giày dép và phụ kiện đang giảm giá.",
      "Trước khi mua, hãy xem bảng size, chất liệu, màu thực tế và chính sách đổi trả. Website không giữ hàng và không xử lý đổi size hoặc hoàn tiền.",
    ],
    highlights: [
      "Quần áo, giày dép, túi xách, phụ kiện",
      "Deal theo mùa và chương trình xả hàng",
      "Lưu ý bảng size, chất liệu và đổi trả",
      "Tổng hợp từ Shopee, Tiki, Lazada, TikTok Shop",
    ],
  },
  home: {
    title: "Deal nhà cửa & đời sống",
    description:
      "Deal đồ bếp, chăn gối, nội thất nhỏ và đồ dùng gia đình đang giảm giá, giúp tiết kiệm chi phí sinh hoạt.",
    intro: [
      "Đồ nhà cửa thường được mua theo nhu cầu từng phòng hoặc từng mùa. Trang này gom các deal đồ bếp, chăn gối, lưu trữ và nội thất nhỏ đang giảm giá.",
      "Hãy kiểm tra kích thước, chất liệu, cách lắp đặt và phí vận chuyển trước khi mua. Với đồ cồng kềnh, phí ship có thể làm mất lợi thế của giá giảm.",
    ],
    highlights: [
      "Đồ bếp, chăn gối, lưu trữ, nội thất nhỏ",
      "Deal theo bộ và đồ dùng thiết yếu",
      "Lưu ý kích thước, chất liệu, lắp đặt",
      "So sánh giá và phí ship giữa các sàn",
    ],
  },
  baby: {
    title: "Deal mẹ & bé",
    description:
      "Deal tã, sữa, đồ ăn dặm và đồ dùng cho bé đang giảm giá, kèm lưu ý chọn hàng chính hãng và hạn dùng.",
    intro: [
      "Đồ dùng cho bé cần ưu tiên an toàn và nguồn gốc rõ ràng hơn giá rẻ. Trang này tổng hợp deal tã, sữa, đồ ăn dặm và phụ kiện cho bé.",
      "Hãy kiểm tra độ tuổi phù hợp, thành phần, hạn sử dụng và chứng nhận trên trang đích. Với sữa và đồ ăn dặm, nên mua từ nhà bán uy tín và kiểm tra kỹ bao bì.",
    ],
    highlights: [
      "Tã, sữa, đồ ăn dặm, đồ dùng cho bé",
      "Deal theo combo và mua số lượng lớn",
      "Lưu ý độ tuổi, thành phần, hạn dùng",
      "Ưu tiên nhà bán có thông tin rõ ràng",
    ],
  },
  sports: {
    title: "Deal thể thao & fitness",
    description:
      "Deal quần áo thể thao, dụng cụ tập luyện và phụ kiện fitness đang giảm giá, phù hợp tập tại nhà hoặc phòng gym.",
    intro: [
      "Dụng cụ thể thao có thể dùng lâu dài nếu chọn đúng nhu cầu. Trang này tổng hợp deal quần áo, giày tập, thảm yoga và dụng cụ tập luyện đang giảm giá.",
      "Hãy kiểm tra chất liệu, kích thước, tải trọng và chính sách bảo hành trước khi mua. Với thiết bị tập nặng, nên chọn nhà bán có đánh giá tốt và thông tin sản phẩm rõ ràng.",
    ],
    highlights: [
      "Quần áo, giày thể thao, thảm yoga",
      "Dụng cụ tập gym và fitness tại nhà",
      "Lưu ý chất liệu, kích thước, tải trọng",
      "Deal từ nhiều sàn, dễ so sánh",
    ],
  },
  auto: {
    title: "Deal ô tô & xe máy",
    description:
      "Deal phụ kiện ô tô, xe máy, mũ bảo hiểm và đồ chăm xe đang giảm giá, kèm lưu ý tương thích và bảo hành.",
    intro: [
      "Phụ kiện xe cần tương thích với dòng xe và đúng nhu cầu sử dụng. Trang này tổng hợp deal mũ bảo hiểm, phụ kiện nội thất, đồ chăm xe và dụng cụ sửa chữa.",
      "Hãy kiểm tra kích thước, model xe, chất liệu và chính sách bảo hành trên trang đích. Website không lắp đặt và không chịu trách nhiệm về việc sử dụng phụ kiện sai cách.",
    ],
    highlights: [
      "Mũ bảo hiểm, phụ kiện ô tô và xe máy",
      "Đồ chăm xe, dụng cụ sửa chữa",
      "Lưu ý model xe, kích thước, tương thích",
      "So sánh giá và bảo hành giữa các sàn",
    ],
  },
  pet: {
    title: "Deal thú cưng",
    description:
      "Deal thức ăn, đồ chơi, phụ kiện và đồ dùng cho chó mèo đang giảm giá, kèm lưu ý thành phần và hạn dùng.",
    intro: [
      "Đồ dùng cho thú cưng cần phù hợp với độ tuổi, cân nặng và sức khỏe của vật nuôi. Trang này tổng hợp deal thức ăn, pate, đồ chơi và phụ kiện cho chó mèo.",
      "Hãy kiểm tra thành phần, hạn sử dụng, kích cỡ và nguồn gốc trên trang đích. Nếu thú cưng có bệnh lý, nên hỏi bác sĩ thú y trước khi đổi thức ăn.",
    ],
    highlights: [
      "Thức ăn, pate, snack cho chó mèo",
      "Đồ chơi, phụ kiện, đồ vệ sinh",
      "Lưu ý thành phần, hạn dùng, kích cỡ",
      "Deal từ nhiều sàn, dễ so sánh",
    ],
  },
  toys: {
    title: "Deal đồ chơi & game",
    description:
      "Deal đồ chơi trẻ em, lego, game và phụ kiện giải trí đang giảm giá, kèm lưu ý độ tuổi và an toàn.",
    intro: [
      "Đồ chơi cần phù hợp độ tuổi và tiêu chuẩn an toàn, nhất là với trẻ nhỏ. Trang này tổng hợp deal đồ chơi, lego, game và phụ kiện giải trí đang giảm giá.",
      "Hãy kiểm tra độ tuổi khuyến nghị, chất liệu, kích thước chi tiết và cảnh báo an toàn trên trang đích. Website không bán trực tiếp và không xử lý đổi trả.",
    ],
    highlights: [
      "Đồ chơi trẻ em, lego, mô hình",
      "Game, phụ kiện giải trí",
      "Lưu ý độ tuổi và tiêu chuẩn an toàn",
      "Deal theo bộ và combo tiết kiệm",
    ],
  },
  jewelry: {
    title: "Deal trang sức & đồng hồ",
    description:
      "Deal trang sức, đồng hồ và phụ kiện đang giảm giá, kèm lưu ý chất liệu, bảo hành và kích cỡ.",
    intro: [
      "Trang sức và đồng hồ là nhóm hàng cần kiểm tra chất liệu và bảo hành kỹ hơn. Trang này tổng hợp deal trang sức, đồng hồ và phụ kiện đang giảm giá.",
      "Hãy xem chất liệu, kích cỡ, giấy bảo hành và chính sách đổi trả trên trang đích. Giá rẻ bất thường có thể đi kèm chất liệu không đúng hoặc hàng không rõ nguồn gốc.",
    ],
    highlights: [
      "Trang sức, đồng hồ, phụ kiện",
      "Deal từ nhà bán có thông tin rõ ràng",
      "Lưu ý chất liệu, kích cỡ, bảo hành",
      "So sánh giá giữa các sàn",
    ],
  },
  tools: {
    title: "Deal dụng cụ & đồ nghề",
    description:
      "Deal dụng cụ cầm tay, máy khoan, đồ nghề sửa chữa đang giảm giá, kèm lưu ý bảo hành và phụ kiện đi kèm.",
    intro: [
      "Dụng cụ và đồ nghề cần đủ lực, đúng chuẩn và an toàn khi sử dụng. Trang này tổng hợp deal dụng cụ cầm tay, máy khoan và đồ nghề sửa chữa đang giảm giá.",
      "Hãy kiểm tra công suất, chất liệu, phụ kiện đi kèm và chính sách bảo hành trên trang đích. Với thiết bị điện, nên chọn nhà bán có thông tin sản phẩm và tem bảo hành rõ ràng.",
    ],
    highlights: [
      "Dụng cụ cầm tay, máy khoan, đồ nghề",
      "Phụ kiện sửa chữa và thiết bị điện",
      "Lưu ý công suất, chất liệu, bảo hành",
      "Deal từ nhiều sàn, dễ so sánh",
    ],
  },
  voucher: {
    title: "Mã giảm giá & voucher mới nhất",
    description:
      "Tổng hợp mã giảm giá, voucher freeship và khuyến mãi mới nhất từ Shopee, Tiki, Lazada, TikTok Shop.",
    intro: [
      "Voucher và mã giảm giá thay đổi liên tục theo chương trình của từng sàn. Trang này tổng hợp các mã đang được ghi nhận, kèm điều kiện và hạn sử dụng khi có thông tin.",
      "Không phải mã nào cũng áp dụng cho mọi tài khoản hoặc mọi đơn hàng. Hãy đọc kỹ điều kiện và kiểm tra ở bước thanh toán; website không bảo đảm mọi mã còn hiệu lực tại thời điểm bạn mua.",
    ],
    highlights: [
      "Mã giảm giá và voucher theo sàn",
      "Voucher freeship, giảm giá đơn hàng",
      "Ghi chú điều kiện và hạn sử dụng",
      "Cập nhật tự động qua AccessTrade",
    ],
  },
};

/**
 * Merchant landing pages combine the hand-written base copy with the long-form
 * sections and extra FAQs kept in merchant-sections.ts.
 */
export const MERCHANT_LANDING = Object.fromEntries(
  (Object.keys(BASE_MERCHANT_LANDING) as Merchant[]).map((slug) => [
    slug,
    {
      ...BASE_MERCHANT_LANDING[slug],
      sections: MERCHANT_SECTIONS[slug],
      faqs: [...BASE_MERCHANT_LANDING[slug].faqs, ...MERCHANT_EXTRA_FAQS[slug]],
    },
  ]),
) as Record<Merchant, MerchantLanding>;

export function getMerchantLanding(slug: string): MerchantLanding | undefined {
  return (MERCHANT_LANDING as Record<string, MerchantLanding>)[slug];
}

export function getCategoryLanding(slug: string): CategoryLanding | undefined {
  return CATEGORY_LANDING[slug];
}

/** Shared FAQ for category pages; category name keeps each answer specific. */
export function categoryFaqs(label: string): LandingFaq[] {
  return [
    {
      question: `Deal ${label} trên Sansale247 đến từ đâu?`,
      answer:
        "Website tổng hợp chương trình công khai, datafeed của sàn và link tiếp thị liên kết. Thông tin được đối chiếu khi có thể, nhưng giá và điều kiện có thể thay đổi theo thời điểm.",
    },
    {
      question: `Mã hoặc deal ${label} hết hạn thì sao?`,
      answer:
        "Bạn có thể bỏ qua deal đó và xem các deal mới hơn trên trang. Nếu thấy link lỗi hoặc nội dung chưa đúng, hãy gửi URL qua trang liên hệ để website kiểm tra.",
    },
    {
      question: "Sansale247 có bán trực tiếp không?",
      answer:
        "Không. Website chỉ giới thiệu thông tin khuyến mãi và dẫn link đến sàn hoặc người bán. Mọi giao dịch, thanh toán, vận chuyển và đổi trả do bên bán xử lý.",
    },
    {
      question: "Mua qua link trên website có đắt hơn không?",
      answer:
        "Không. Giá bạn trả do sàn hoặc người bán quyết định. Khi phát sinh đơn hợp lệ, Sansale247 có thể nhận hoa hồng affiliate; khoản này không cộng thêm vào giá.",
    },
  ];
}
