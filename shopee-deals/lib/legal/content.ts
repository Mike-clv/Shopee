import { SITE } from "@/lib/site";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalPageContent = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const UPDATED = "2026-10-30";

export const LEGAL_PAGES: LegalPageContent[] = [
  {
    slug: "tiet-lo-affiliate",
    title: "Tiết lộ affiliate",
    description:
      "Sansale247 có thể nhận hoa hồng khi bạn mua hàng qua một số link trên website. Khoản hoa hồng này không làm tăng giá bạn phải trả.",
    updated: UPDATED,
    sections: [
      {
        heading: "Website có sử dụng link affiliate",
        paragraphs: [
          "Sansale247 là website tổng hợp mã giảm giá, voucher và deal từ Shopee, Tiki, Lazada, TikTok Shop và một số thương hiệu khác. Một số link ra sàn hoặc link sản phẩm trên website là link tiếp thị liên kết (affiliate link).",
          "Khi bạn bấm vào link affiliate và phát sinh giao dịch hợp lệ, Sansale247 có thể nhận một khoản hoa hồng từ sàn hoặc mạng tiếp thị. Khoản này do bên bán chi trả, không cộng thêm vào giá bạn thanh toán.",
        ],
      },
      {
        heading: "Các đối tác tiếp thị",
        paragraphs: [
          "Website hiện tham gia các chương trình tiếp thị liên kết, bao gồm AccessTrade và chương trình affiliate của từng sàn. Link có thể đi qua các tên miền như go.isclix.com, click.accesstrade.vn hoặc shorten.asia trước khi đến trang đích.",
          "Khi bạn rời Sansale247, chính sách bảo mật và điều khoản của sàn hoặc đối tác affiliate sẽ áp dụng cho giao dịch của bạn.",
        ],
      },
      {
        heading: "Ảnh hưởng đến nội dung",
        paragraphs: [
          "Hoa hồng affiliate không quyết định việc một deal có được đăng hay không. Deal được chọn dựa trên mức giảm thực tế, độ tin cậy của người bán, thời hạn và mức độ hữu ích với người đọc.",
          "Sansale247 không bán vị trí hiển thị, không nhận tiền để đẩy một deal lên đầu và không che giấu quan hệ affiliate. Nếu có nội dung được tài trợ trong tương lai, website sẽ ghi rõ ngay tại nội dung đó.",
        ],
      },
      {
        heading: "Cách nhận biết",
        paragraphs: [
          "Các link affiliate thường có tham số theo dõi của AccessTrade hoặc sàn. Ngoài ra, website ghi chú ngắn ở chân trang: “Mua qua link affiliate giúp duy trì website miễn phí.”",
          "Nếu bạn không muốn sử dụng link affiliate, bạn có thể tự mở trang chính thức của sàn và tìm sản phẩm tương ứng. Giá và ưu đãi có thể giống hoặc khác tùy chương trình tại thời điểm mua.",
        ],
      },
      {
        heading: "Câu hỏi về tiết lộ affiliate",
        paragraphs: [
          `Nếu cần làm rõ một link hoặc muốn báo lỗi nội dung, vui lòng gửi email đến ${SITE.contactEmail}. Website sẽ phản hồi trong thời gian sớm nhất.`,
        ],
      },
    ],
  },
  {
    slug: "chinh-sach-bien-tap",
    title: "Chính sách biên tập",
    description:
      "Cách Sansale247 thu thập, kiểm tra và cập nhật mã giảm giá, deal và nội dung trên website.",
    updated: UPDATED,
    sections: [
      {
        heading: "Mục tiêu biên tập",
        paragraphs: [
          "Sansale247 hướng đến việc giúp người đọc tìm được mã giảm giá còn hiệu lực, hiểu điều kiện sử dụng và ra quyết định mua hàng có lợi hơn. Nội dung ưu tiên tính hữu ích, rõ ràng và có thể kiểm chứng.",
          "Website không đăng deal chỉ để lấp đầy trang, không tạo cảm giác khẩn cấp giả và không hứa hẹn mức giảm nếu chưa kiểm tra.",
        ],
      },
      {
        heading: "Nguồn dữ liệu",
        bullets: [
          "Dữ liệu chương trình và deal từ AccessTrade, datafeed của các sàn và trang công khai của thương hiệu.",
          "Thông tin điều kiện, thời hạn và giá được đối chiếu với trang đích khi có thể.",
          "Phản hồi của người đọc về mã hết hạn, link lỗi hoặc nội dung chưa chính xác.",
        ],
      },
      {
        heading: "Quy trình kiểm tra",
        paragraphs: [
          "Phần lớn deal được đồng bộ tự động qua AccessTrade theo lịch. Hệ thống kiểm tra trạng thái, thời hạn và một số trường dữ liệu bắt buộc trước khi hiển thị.",
          "Các nội dung quan trọng như bài hướng dẫn, chính sách và thông tin thương hiệu được biên tập thủ công. Với deal có dấu hiệu bất thường, website có thể tạm ẩn để kiểm tra lại.",
        ],
      },
      {
        heading: "Tiêu chí chọn deal",
        bullets: [
          "Mã hoặc deal còn thời hạn và có trang đích rõ ràng.",
          "Mức giảm có thể kiểm chứng, không phải giá “gốc” bị đẩy lên trước khuyến mãi.",
          "Người bán hoặc thương hiệu có chính sách mua hàng, đổi trả và bảo hành minh bạch.",
          "Thông tin điều kiện, đối tượng áp dụng và hạn chế được ghi chú khi cần.",
        ],
      },
      {
        heading: "Tính độc lập",
        paragraphs: [
          "Sansale247 có thể nhận hoa hồng affiliate, nhưng không bán thứ hạng và không để hoa hồng quyết định nội dung. Thứ tự hiển thị dựa trên mức độ liên quan, mức giảm, thời hạn và trải nghiệm người dùng.",
          "Các ý kiến, đánh giá và khuyến nghị trong bài viết là quan điểm biên tập, không phải cam kết của sàn hoặc nhãn hàng.",
        ],
      },
      {
        heading: "Cập nhật và sửa lỗi",
        paragraphs: [
          "Deal hết hạn hoặc link lỗi được gỡ khỏi danh sách khi phát hiện. Khi có sai sót về giá, điều kiện hoặc thời hạn, website sẽ cập nhật hoặc ghi chú rõ.",
          `Nếu bạn thấy nội dung chưa đúng, vui lòng gửi email đến ${SITE.contactEmail} kèm URL và mô tả ngắn. Việc báo lỗi giúp website cập nhật nhanh hơn.`,
        ],
      },
    ],
  },
  {
    slug: "chinh-sach-bao-mat",
    title: "Chính sách bảo mật",
    description:
      "Sansale247 thu thập những dữ liệu gì, dùng để làm gì, lưu trong bao lâu và bạn có những quyền gì.",
    updated: UPDATED,
    sections: [
      {
        heading: "Phạm vi áp dụng",
        paragraphs: [
          "Chính sách này áp dụng cho website sansale247.io.vn. Website là trang tổng hợp thông tin khuyến mãi và link affiliate; hiện không yêu cầu tạo tài khoản, không có giỏ hàng và không trực tiếp xử lý thanh toán.",
          "Khi bạn bấm link sang sàn hoặc đối tác, dữ liệu của bạn sẽ được xử lý theo chính sách của bên đó. Vui lòng đọc chính sách bảo mật của sàn trước khi giao dịch.",
        ],
      },
      {
        heading: "Dữ liệu được thu thập",
        bullets: [
          "Dữ liệu kỹ thuật khi truy cập: địa chỉ IP, loại trình duyệt, thiết bị, trang đã xem, thời gian và mã lỗi.",
          "Cookie phiên dành cho quản trị viên khi đăng nhập khu vực admin; không dùng cho người đọc thông thường.",
          "Thông tin bạn tự gửi qua email: địa chỉ email, nội dung và tệp đính kèm nếu có.",
          "Mã theo dõi affiliate khi bạn bấm link ra sàn, do AccessTrade hoặc sàn ghi nhận trên tên miền của họ.",
        ],
      },
      {
        heading: "Mục đích sử dụng",
        bullets: [
          "Vận hành, bảo mật và khắc phục lỗi website.",
          "Thống kê mức độ sử dụng để cải thiện nội dung và trải nghiệm.",
          "Trả lời câu hỏi, báo lỗi, yêu cầu về dữ liệu hoặc hợp tác.",
          "Tuân thủ nghĩa vụ pháp lý và xử lý hành vi lạm dụng khi cần.",
        ],
      },
      {
        heading: "Cơ sở và phạm vi xử lý",
        paragraphs: [
          "Dữ liệu được xử lý để vận hành website, bảo vệ hệ thống và cải thiện dịch vụ. Khi pháp luật yêu cầu sự đồng ý, website sẽ xin ý kiến trước khi dùng dữ liệu cho mục đích đó.",
          "Website không bán dữ liệu cá nhân và không dùng email của bạn để gửi quảng cáo nếu chưa có sự đồng ý.",
        ],
      },
      {
        heading: "Chia sẻ với bên thứ ba",
        paragraphs: [
          "Dữ liệu có thể được xử lý bởi nhà cung cấp hạ tầng (Vercel), mạng affiliate (AccessTrade), sàn thương mại khi bạn bấm link, và cơ quan có thẩm quyền khi pháp luật yêu cầu.",
          "Các bên này chỉ nhận dữ liệu cần thiết cho mục đích tương ứng và có chính sách bảo mật riêng.",
        ],
      },
      {
        heading: "Thời gian lưu trữ",
        paragraphs: [
          "Log vận hành và dữ liệu kỹ thuật được lưu trong thời gian cần thiết cho bảo mật, thống kê và khắc phục sự cố, sau đó xóa hoặc ẩn danh hóa theo chính sách của nhà cung cấp hạ tầng.",
          "Email trao đổi được lưu đến khi vấn đề được giải quyết, trừ khi pháp luật yêu cầu lưu lâu hơn hoặc bạn yêu cầu xóa.",
        ],
      },
      {
        heading: "Quyền của bạn",
        bullets: [
          "Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân mà website đang lưu.",
          "Rút lại sự đồng ý hoặc phản đối việc xử lý trong phạm vi pháp luật cho phép.",
          "Yêu cầu hạn chế xử lý hoặc khiếu nại về cách website xử lý dữ liệu.",
          "Yêu cầu giải thích về dữ liệu được thu thập và mục đích sử dụng.",
        ],
      },
      {
        heading: "Cách gửi yêu cầu",
        paragraphs: [
          `Gửi email đến ${SITE.contactEmail} với tiêu đề “Yêu cầu dữ liệu cá nhân”. Website sẽ xác minh yêu cầu và phản hồi trong thời hạn pháp luật quy định, thường không quá 30 ngày.`,
          "Nếu bạn không hài lòng với cách xử lý, bạn có quyền khiếu nại đến cơ quan có thẩm quyền về bảo vệ dữ liệu cá nhân.",
        ],
      },
      {
        heading: "Bảo mật",
        paragraphs: [
          "Website dùng HTTPS, kiểm soát quyền truy cập khu vực quản trị và các biện pháp kỹ thuật phù hợp để bảo vệ dữ liệu. Tuy nhiên, không hệ thống nào an toàn tuyệt đối; website không thể bảo đảm 100% trước mọi rủi ro.",
        ],
      },
      {
        heading: "Trẻ em và chuyển dữ liệu",
        paragraphs: [
          "Website không hướng đến trẻ em dưới 16 tuổi và không cố ý thu thập dữ liệu của trẻ em. Nếu phát hiện dữ liệu như vậy, website sẽ xóa khi có yêu cầu hợp lệ.",
          "Nhà cung cấp hạ tầng hoặc mạng affiliate có thể xử lý dữ liệu ngoài Việt Nam. Website áp dụng các biện pháp phù hợp theo quy định hiện hành khi chuyển dữ liệu.",
        ],
      },
      {
        heading: "Thay đổi chính sách",
        paragraphs: [
          "Chính sách có thể được cập nhật khi website thay đổi tính năng, đối tác hoặc quy định pháp luật. Ngày cập nhật được ghi ở đầu trang. Bản mới có hiệu lực từ thời điểm đăng tải.",
        ],
      },
    ],
  },
  {
    slug: "dieu-khoan-su-dung",
    title: "Điều khoản sử dụng",
    description:
      "Các quy định khi truy cập và sử dụng website Sansale247, quyền và giới hạn trách nhiệm của các bên.",
    updated: UPDATED,
    sections: [
      {
        heading: "Chấp nhận điều khoản",
        paragraphs: [
          "Khi truy cập hoặc sử dụng sansale247.io.vn, bạn đồng ý với các điều khoản này và chính sách bảo mật của website. Nếu không đồng ý, vui lòng không tiếp tục sử dụng.",
        ],
      },
      {
        heading: "Mô tả dịch vụ",
        paragraphs: [
          "Sansale247 cung cấp thông tin về mã giảm giá, voucher, deal và link đến sàn thương mại điện tử. Website không phải sàn giao dịch, không bán hàng trực tiếp, không xử lý đơn hàng, thanh toán, vận chuyển hay đổi trả.",
          "Mọi giao dịch được thực hiện trên website của sàn hoặc người bán. Hợp đồng mua bán là giữa bạn và bên bán, không phải với Sansale247.",
        ],
      },
      {
        heading: "Link và nội dung bên thứ ba",
        paragraphs: [
          "Website có thể chứa link affiliate hoặc link đến trang bên thứ ba. Website không kiểm soát và không chịu trách nhiệm về nội dung, chính sách, giá, tồn kho hoặc chất lượng sản phẩm của bên thứ ba.",
          "Bạn nên kiểm tra thông tin sản phẩm, điều kiện khuyến mãi và chính sách đổi trả trên trang đích trước khi mua.",
        ],
      },
      {
        heading: "Sở hữu trí tuệ",
        paragraphs: [
          "Nội dung do Sansale247 tạo ra, bao gồm bài viết, cách trình bày và thiết kế, được bảo hộ theo pháp luật. Bạn không được sao chép, sửa đổi hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản.",
          "Tên, logo và nhãn hiệu của Shopee, Tiki, Lazada, TikTok Shop và các thương hiệu khác thuộc chủ sở hữu tương ứng. Website không tuyên bố là đại diện chính thức của các bên này.",
        ],
      },
      {
        heading: "Hành vi bị cấm",
        bullets: [
          "Thu thập dữ liệu tự động quy mô lớn, scraping hoặc gây quá tải hệ thống.",
          "Đăng tải mã độc, tấn công, dò quét hoặc cố gắng truy cập trái phép.",
          "Mạo danh Sansale247, nhân viên hoặc đối tác để lừa đảo.",
          "Sử dụng website để vi phạm pháp luật hoặc xâm phạm quyền của người khác.",
        ],
      },
      {
        heading: "Không bảo đảm",
        paragraphs: [
          "Thông tin trên website được cung cấp “nguyên trạng” và có thể thay đổi mà không báo trước. Website nỗ lực cập nhật nhưng không bảo đảm mọi mã, giá hoặc điều kiện luôn chính xác, đầy đủ hoặc còn hiệu lực tại thời điểm bạn mua.",
        ],
      },
      {
        heading: "Giới hạn trách nhiệm",
        paragraphs: [
          "Trong phạm vi pháp luật cho phép, Sansale247 không chịu trách nhiệm cho thiệt hại gián tiếp, mất lợi nhuận hoặc thiệt hại phát sinh từ việc bạn dựa vào thông tin trên website hoặc giao dịch với bên thứ ba.",
          "Điều khoản này không loại trừ các quyền bắt buộc mà pháp luật dành cho người tiêu dùng.",
        ],
      },
      {
        heading: "Thay đổi và luật áp dụng",
        paragraphs: [
          "Website có thể sửa điều khoản khi cần thiết; bản mới được đăng tại trang này và có hiệu lực từ ngày ghi ở đầu trang. Việc tiếp tục sử dụng sau khi cập nhật được hiểu là bạn chấp nhận bản mới.",
          "Điều khoản được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp được ưu tiên giải quyết thương lượng; nếu không thành, cơ quan có thẩm quyền tại Việt Nam sẽ giải quyết.",
        ],
      },
      {
        heading: "Liên hệ",
        paragraphs: [
          `Câu hỏi về điều khoản vui lòng gửi đến ${SITE.contactEmail}.`,
        ],
      },
    ],
  },
  {
    slug: "mien-tru-trach-nhiem",
    title: "Miễn trừ trách nhiệm",
    description:
      "Các giới hạn và lưu ý khi sử dụng thông tin mã giảm giá, deal và link affiliate trên Sansale247.",
    updated: UPDATED,
    sections: [
      {
        heading: "Không phải website chính thức",
        paragraphs: [
          "Sansale247 là website độc lập, không phải trang chính thức của Shopee, Tiki, Lazada, TikTok Shop hoặc bất kỳ thương hiệu nào được nhắc đến. Website không đại diện, không phát ngôn và không cam kết thay cho các bên đó.",
        ],
      },
      {
        heading: "Thông tin có thể thay đổi",
        paragraphs: [
          "Giá, tồn kho, mã giảm giá, điều kiện áp dụng và thời hạn có thể thay đổi bất cứ lúc nào theo chính sách của sàn hoặc người bán. Thông tin trên website chỉ mang tính tham khảo tại thời điểm đăng.",
          "Bạn cần kiểm tra lại trên trang đích trước khi thanh toán. Website không chịu trách nhiệm nếu mã đã hết hạn, sản phẩm hết hàng hoặc chương trình kết thúc sớm.",
        ],
      },
      {
        heading: "Link affiliate",
        paragraphs: [
          "Một số link trên website là link affiliate. Sansale247 có thể nhận hoa hồng khi bạn mua hàng qua link, nhưng khoản này không làm tăng giá bạn trả. Chi tiết xem trang Tiết lộ affiliate.",
        ],
      },
      {
        heading: "Không phải tư vấn chuyên môn",
        paragraphs: [
          "Nội dung về sản phẩm, sức khỏe, tài chính hoặc pháp lý (nếu có) chỉ là thông tin tham khảo, không thay thế tư vấn của chuyên gia. Bạn tự chịu trách nhiệm về quyết định mua hàng và sử dụng sản phẩm.",
        ],
      },
      {
        heading: "Rủi ro giao dịch",
        paragraphs: [
          "Mọi giao dịch diễn ra trên nền tảng của bên thứ ba. Bạn tự kiểm tra uy tín người bán, chính sách đổi trả, bảo hành và bảo mật thanh toán. Khiếu nại về đơn hàng cần gửi đến sàn hoặc người bán theo quy trình của họ.",
        ],
      },
      {
        heading: "Nội dung bên thứ ba",
        paragraphs: [
          "Website có thể dẫn đến nội dung, hình ảnh hoặc dịch vụ của bên thứ ba. Website không kiểm soát và không chịu trách nhiệm về tính chính xác, hợp pháp hoặc an toàn của nội dung đó.",
        ],
      },
      {
        heading: "Liên hệ",
        paragraphs: [
          `Nếu bạn cho rằng nội dung trên website gây hiểu nhầm hoặc xâm phạm quyền lợi, vui lòng gửi email đến ${SITE.contactEmail} kèm URL và thông tin liên quan để website kiểm tra.`,
        ],
      },
    ],
  },
  {
    slug: "cookie",
    title: "Chính sách cookie",
    description:
      "Sansale247 dùng cookie như thế nào, cookie của bên thứ ba nào có thể xuất hiện và cách bạn kiểm soát.",
    updated: UPDATED,
    sections: [
      {
        heading: "Cookie là gì",
        paragraphs: [
          "Cookie là tệp nhỏ được lưu trên trình duyệt khi bạn truy cập website. Cookie giúp website ghi nhớ phiên đăng nhập, bảo mật hoặc đo lường hiệu quả nội dung.",
        ],
      },
      {
        heading: "Cookie website sử dụng",
        paragraphs: [
          "Hiện tại, website dùng cookie phiên cần thiết cho quản trị viên khi đăng nhập khu vực admin. Người đọc thông thường không cần đăng nhập.",
          "Khi bạn đồng ý đo lường, website dùng Google Analytics 4 để ghi nhận lượt xem trang, từ khóa tìm kiếm và lượt bấm link affiliate. Dữ liệu được dùng để cải thiện nội dung; chúng tôi không bán dữ liệu cá nhân. Nếu bạn chọn \"Chỉ cookie cần thiết\", GA4 không được tải và không có dữ liệu đo lường nào được gửi.",
          "Lựa chọn của bạn được lưu trong localStorage của trình duyệt. Bạn có thể đổi lại bất cứ lúc nào bằng cách xóa dữ liệu trang hoặc dùng cài đặt trình duyệt.",
        ],
      },
      {
        heading: "Cookie bên thứ ba",
        paragraphs: [
          "Khi bạn bấm link affiliate hoặc link ra sàn, AccessTrade, sàn hoặc đối tác có thể đặt cookie trên tên miền của họ để ghi nhận lượt mua. Website không kiểm soát các cookie này.",
          "Loại cookie, thời hạn và cách tắt phụ thuộc vào chính sách của từng bên. Bạn nên đọc chính sách cookie của sàn hoặc mạng affiliate trước khi giao dịch.",
        ],
      },
      {
        heading: "Cách quản lý cookie",
        paragraphs: [
          "Bạn có thể chặn hoặc xóa cookie trong phần cài đặt trình duyệt. Việc chặn cookie có thể ảnh hưởng đến chức năng đăng nhập quản trị hoặc khiến link affiliate không ghi nhận được lượt mua.",
          "Một số trình duyệt có chế độ chặn theo dõi; hãy kiểm tra cài đặt nếu bạn không muốn cookie tiếp thị được lưu.",
        ],
      },
      {
        heading: "Thay đổi chính sách",
        paragraphs: [
          "Chính sách cookie có thể được cập nhật khi website thay đổi công cụ hoặc quy định pháp luật. Ngày cập nhật được ghi ở đầu trang.",
        ],
      },
      {
        heading: "Liên hệ",
        paragraphs: [
          `Câu hỏi về cookie vui lòng gửi đến ${SITE.contactEmail}.`,
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPageContent | undefined {
  return LEGAL_PAGES.find((page) => page.slug === slug);
}

export const TRUST_LINKS = [
  { href: "/ve-chung-toi", label: "Về Sansale247" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/faq", label: "Câu hỏi thường gặp" },
  ...LEGAL_PAGES.map((page) => ({
    href: `/chinh-sach/${page.slug}`,
    label: page.title,
  })),
];
