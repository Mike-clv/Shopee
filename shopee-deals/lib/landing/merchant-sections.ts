import type { Merchant } from "@/lib/site";

export type LandingSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LandingFaqItem = { question: string; answer: string };

/**
 * Long-form sections for the four merchant hubs. Each marketplace gets a
 * different angle so the pages are not near-duplicates of one another:
 * Shopee = voucher layers, Tiki = authentic catalog, Lazada = campaign
 * timing, TikTok Shop = seller vetting. Claims stay factual and avoid
 * promising discounts or current programme details.
 */
export const MERCHANT_SECTIONS: Record<Merchant, LandingSection[]> = {
  shopee: [
    {
      title: "Shopee có những loại ưu đãi nào?",
      paragraphs: [
        "Shopee thường kết hợp nhiều lớp ưu đãi trong cùng một đơn hàng: mã giảm giá của sàn, voucher của shop, mã freeship và ưu đãi thanh toán. Mỗi lớp có điều kiện riêng về giá trị đơn tối thiểu, danh mục, phương thức thanh toán hoặc số lượt sử dụng. Vì vậy, một mã hiển thị công khai chưa chắc áp dụng được cho mọi tài khoản.",
        "Ngoài mã giảm giá trực tiếp, Shopee còn có flash sale theo khung giờ, deal từ livestream, hoàn xu và các chương trình theo mùa như 11.11, 12.12 hoặc Tết. Các chương trình này thay đổi rất nhanh, có thể mở thêm hoặc dừng trước thời hạn. Trang này tổng hợp các deal đang được ghi nhận tại thời điểm cập nhật, kèm link đến trang đích để bạn kiểm tra lại lần cuối.",
        "Nếu bạn đang tìm bằng tiếng Anh với cụm \"Shopee promo code\" hoặc \"Shopee voucher code\", cách đọc bảng deal cũng tương tự: ưu tiên mã còn hạn, đúng danh mục và có điều kiện phù hợp với giỏ hàng. Đừng chỉ nhìn mức giảm trên tiêu đề; hãy mở trang sản phẩm để xem giá sau giảm, phí vận chuyển và điều kiện áp dụng thực tế.",
      ],
      bullets: [
        "Mã giảm giá của sàn: giảm theo số tiền hoặc phần trăm, thường có đơn tối thiểu.",
        "Voucher shop: do từng người bán phát hành, hạn dùng và danh mục có thể khác nhau.",
        "Mã freeship: giảm hoặc miễn phí vận chuyển, phụ thuộc khu vực và đơn vị giao hàng.",
        "Flash sale và livestream: giá thay đổi theo khung giờ, số lượng có hạn.",
        "Hoàn xu và ưu đãi thanh toán: giá trị nhận được tùy chương trình và tài khoản.",
      ],
    },
    {
      title: "Cách săn voucher Shopee hiệu quả",
      paragraphs: [
        "Bước đầu tiên là chuẩn bị tài khoản và giỏ hàng trước giờ sale. Đăng nhập sẵn, lưu sản phẩm quan tâm và kiểm tra địa chỉ nhận hàng giúp bạn không bỏ lỡ khung giờ mở bán vì thao tác chậm. Nếu định mua nhiều món, hãy thử gom đơn để đạt điều kiện freeship hoặc đơn tối thiểu của mã, nhưng vẫn cân nhắc nhu cầu thật thay vì mua thêm chỉ để dùng mã.",
        "Khi đã có giỏ hàng, hãy mở trang voucher và lọc theo danh mục, phương thức thanh toán và hạn dùng. Ưu tiên mã có thời hạn gần nhất nhưng vẫn phù hợp với đơn hàng; đừng áp dụng tất cả mã cùng lúc vì nhiều chương trình loại trừ nhau. Ở bước thanh toán, kiểm tra lại số tiền giảm, phí ship và tổng thanh toán trước khi xác nhận.",
        "Một sai lầm phổ biến là tin vào ảnh chụp màn hình hoặc bài đăng cũ. Mã có thể đã hết lượt dù nút \"Sao chép\" vẫn hiển thị. Hãy ưu tiên các mã có liên kết đến trang sản phẩm hoặc trang chương trình còn hoạt động, và bỏ qua deal có dấu hiệu bất thường như giá quá thấp, yêu cầu chuyển khoản riêng hoặc đòi thông tin tài khoản ngoài sàn.",
      ],
      bullets: [
        "Đăng nhập và lưu sản phẩm trước khung giờ sale ít nhất vài phút.",
        "Đọc kỹ đơn tối thiểu, danh mục, phương thức thanh toán và hạn dùng.",
        "Thử mã theo thứ tự: mã sàn, voucher shop, freeship, ưu đãi thanh toán.",
        "Kiểm tra tổng tiền ở bước xác nhận, không chỉ nhìn mức giảm quảng cáo.",
        "Không chuyển khoản ngoài sàn hoặc chia sẻ mã OTP cho người khác.",
        "Lưu lại link sản phẩm để đối chiếu nếu cần hỗ trợ sau khi mua.",
      ],
    },
    {
      title: "Chọn deal Shopee theo danh mục",
      paragraphs: [
        "Với thời trang, giá tốt chưa đủ — hãy xem bảng size, chất liệu, màu thực tế và chính sách đổi trả. Ảnh quảng cáo có thể khác sản phẩm nhận được, nhất là với hàng giá rẻ. Nếu mua để mặc trong dịp cụ thể, nên đặt sớm để còn thời gian đổi size hoặc xử lý giao hàng chậm.",
        "Với điện tử và gia dụng, hãy đối chiếu cấu hình, phiên bản, tình trạng hàng và bảo hành. Một mức giảm sâu bất thường có thể đi kèm hàng cũ, hàng trưng bày hoặc bảo hành ngắn. Với mỹ phẩm và thực phẩm, ưu tiên shop có thông tin rõ ràng, hạn sử dụng còn dài và phản hồi thực tế từ người mua.",
        "Nhóm mẹ & bé, sức khỏe và đồ dùng cá nhân cần kiểm tra kỹ hơn về nguồn gốc, thành phần và hạn dùng. Đừng dùng giá làm tiêu chí duy nhất; hãy xem cả phí ship, thời gian giao, chính sách đổi trả và đánh giá của người đã mua. Nếu sản phẩm ảnh hưởng trực tiếp đến sức khỏe, nên tham khảo tư vấn chuyên môn trước khi dùng.",
      ],
      bullets: [
        "Thời trang: kiểm tra size, chất liệu, đổi trả và thời gian giao.",
        "Điện tử: đối chiếu cấu hình, phiên bản, bảo hành và tình trạng hàng.",
        "Gia dụng: xem kích thước, điện áp, phụ kiện và phí vận chuyển.",
        "Mỹ phẩm: ưu tiên shop rõ nguồn gốc, date dài, đánh giá thực tế.",
        "Mẹ & bé: kiểm tra độ tuổi, thành phần, hạn dùng và chứng nhận.",
        "Đồ ăn vặt: chú ý hạn dùng, cách bảo quản và phí ship.",
      ],
    },
    {
      title: "Lưu ý trước khi thanh toán đơn Shopee",
      paragraphs: [
        "Giá hiển thị trên trang tổng hợp chỉ là tham khảo tại thời điểm đăng. Shopee có thể thay đổi giá theo chương trình, khu vực, phương thức thanh toán hoặc tồn kho. Trước khi bấm đặt hàng, hãy mở trang sản phẩm, chọn đúng phân loại và kiểm tra giá cuối cùng cùng phí vận chuyển. Đừng so sánh một deal đã hết hạn với giá hiện tại của sản phẩm khác.",
        "Hãy xem thông tin người bán: thời gian hoạt động, đánh giá, tỷ lệ phản hồi và chính sách đổi trả. Với đơn có giá trị lớn, nên quay video khi mở hàng và giữ lại hóa đơn, ảnh chụp đơn để thuận tiện khi cần khiếu nại. Nếu sản phẩm có dấu hiệu sai mô tả, hãy liên hệ người bán hoặc bộ phận hỗ trợ của sàn thay vì tự thỏa thuận ngoài hệ thống.",
        "Cuối cùng, hãy nhớ rằng Sansale247 không bán hàng và không xử lý đơn Shopee. Website chỉ tổng hợp thông tin khuyến mãi và dẫn link. Mọi giao dịch, thanh toán, vận chuyển, đổi trả và bảo hành do Shopee hoặc người bán quyết định. Nếu bạn mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Kiểm tra giá cuối cùng, phí ship và mã đã áp dụng ở bước xác nhận.",
        "Xem đánh giá người bán và chính sách đổi trả trước khi mua.",
        "Quay video mở hàng với đơn giá trị lớn.",
        "Không chuyển khoản riêng hoặc cung cấp OTP cho người bán.",
        "Dùng link trên website để được ghi nhận đúng chương trình.",
        "Đọc tiết lộ affiliate nếu bạn quan tâm cách website vận hành.",
      ],
    },
    {
      title: "Mua Shopee theo mùa sale: chuẩn bị gì?",
      paragraphs: [
        "Các đợt sale lớn của Shopee thường không chỉ diễn ra trong một ngày. Có giai đoạn mở voucher trước, giai đoạn flash sale theo khung giờ và giai đoạn thanh toán ưu đãi. Nếu chỉ vào đúng ngày cao điểm, bạn có thể bỏ lỡ mã đã phát hết hoặc phải chọn giữa nhiều sản phẩm đã tăng giá trước đó.",
        "Cách chuẩn bị hiệu quả là lập danh sách nhu cầu thật, ghi mức giá bạn chấp nhận được và theo dõi sản phẩm trong vài ngày. So sánh giá trước sale với giá sau giảm, thay vì tin vào nhãn \"giảm sâu\". Với món không cần gấp, hãy chờ thêm một đợt để đối chiếu; với món cần dùng, đừng vì chờ sale mà ảnh hưởng công việc.",
        "Sau khi đặt, hãy kiểm tra lại đơn, mã đã áp dụng và thời gian giao. Mùa sale có thể làm vận chuyển chậm hơn bình thường. Nếu món hàng không còn cần thiết, hãy kiểm tra chính sách hủy trước khi shop giao; đừng chờ đến khi nhận rồi mới xử lý.",
      ],
      bullets: [
        "Lập danh sách nhu cầu và ngân sách trước mỗi đợt sale.",
        "Theo dõi giá vài ngày để phân biệt giảm thật với giá neo.",
        "Thu thập voucher trước ngày cao điểm.",
        "Kiểm tra thời gian giao dự kiến trong mùa cao điểm.",
        "Không mua thêm chỉ để đạt freeship hoặc dùng mã.",
      ],
    },
  ],
  tiki: [
    {
      title: "Vì sao nhiều người tìm deal Tiki?",
      paragraphs: [
        "Tiki được nhiều người chọn khi mua sách, điện tử, gia dụng và hàng chính hãng vì danh mục sản phẩm rõ ràng và thông tin bảo hành thường được ghi cụ thể. Các chương trình giảm giá của Tiki có thể đến từ voucher của sàn, ưu đãi từ nhà bán, mã thanh toán hoặc các đợt sale theo mùa. Mức giảm và điều kiện thay đổi theo từng sản phẩm.",
        "Điểm mạnh của Tiki là trải nghiệm đọc thông tin sản phẩm: mô tả, thông số, đánh giá và chính sách đổi trả thường được trình bày chi tiết. Tuy nhiên, không phải sản phẩm nào cũng do Tiki trực tiếp bán; có thể có nhà bán khác tham gia. Vì vậy, hãy kiểm tra người bán, bảo hành và thời gian giao hàng thay vì chỉ nhìn giá.",
        "Nếu bạn tìm bằng tiếng Anh với cụm \"Tiki promo codes\" hoặc \"Tiki coupon\", hãy đối chiếu lại điều kiện bằng tiếng Việt trên trang thanh toán. Một số mã chỉ áp dụng cho người dùng mới, một số giới hạn danh mục hoặc phương thức thanh toán. Trang này tổng hợp deal đang hoạt động và dẫn về trang đích để bạn kiểm tra trước khi mua.",
      ],
      bullets: [
        "Sách, giáo trình, truyện và văn phòng phẩm.",
        "Điện tử, điện thoại, laptop, phụ kiện công nghệ.",
        "Gia dụng, đồ bếp và đồ dùng gia đình.",
        "Hàng chính hãng, sản phẩm có bảo hành rõ ràng.",
        "Voucher theo chương trình và ưu đãi thanh toán.",
      ],
    },
    {
      title: "Các loại voucher và ưu đãi trên Tiki",
      paragraphs: [
        "Tiki thường có voucher giảm giá trực tiếp, mã miễn phí hoặc giảm phí vận chuyển, ưu đãi theo phương thức thanh toán và các chương trình dành cho thành viên. Mỗi loại có điều kiện riêng: giá trị đơn tối thiểu, danh mục áp dụng, số lần sử dụng hoặc thời gian hiệu lực. Không phải voucher nào cũng cộng dồn được với nhau.",
        "Trước khi mua, hãy mở trang sản phẩm và xem khu vực khuyến mãi hoặc voucher. Nếu mã không hiển thị, có thể sản phẩm không thuộc danh mục áp dụng hoặc chương trình đã kết thúc. Với đơn hàng lớn, nên thử nhiều phương án: dùng voucher sàn, voucher nhà bán, mã vận chuyển và ưu đãi thanh toán, sau đó so sánh tổng tiền cuối cùng.",
        "Đừng quên kiểm tra hạn dùng và điều kiện hoàn hủy. Một số chương trình yêu cầu đơn không hoàn, không đổi hoặc chỉ áp dụng cho đơn đầu tiên. Nếu bạn cần xuất hóa đơn hoặc bảo hành, hãy xác nhận thông tin trước khi đặt vì việc thay đổi sau đó có thể phức tạp hơn.",
      ],
      bullets: [
        "Voucher giảm giá theo đơn hoặc theo danh mục.",
        "Mã freeship và ưu đãi vận chuyển theo khu vực.",
        "Ưu đãi thanh toán qua ngân hàng hoặc ví điện tử.",
        "Chương trình thành viên và điểm thưởng khi có.",
        "Kiểm tra điều kiện hoàn hủy trước khi xác nhận.",
      ],
    },
    {
      title: "Cách dùng mã Tiki không bị lỗi",
      paragraphs: [
        "Hãy đăng nhập tài khoản trước khi áp mã để hệ thống ghi nhận đúng hạng thành viên và lịch sử đơn hàng. Thêm sản phẩm vào giỏ, chọn đúng phân loại và số lượng, sau đó mới nhập mã. Nếu mã báo lỗi, kiểm tra lại giá trị đơn, danh mục, phương thức thanh toán và thời hạn; đôi khi chỉ cần thay đổi một điều kiện nhỏ là mã sẽ hoạt động.",
        "Không nên sao chép mã từ nguồn không rõ ràng rồi nhập liên tục. Nếu hệ thống yêu cầu xác minh hoặc thông báo mã không tồn tại, hãy dừng lại và kiểm tra trên trang chính thức. Mã có thể đã hết lượt hoặc bị giới hạn theo tài khoản. Việc thử quá nhiều mã trong thời gian ngắn có thể khiến bạn bỏ lỡ khung giờ sale.",
        "Khi thanh toán, hãy xem lại số tiền giảm và phí ship. Nếu tổng tiền không thay đổi như mong đợi, quay lại bước trước để kiểm tra mã đã được áp dụng chưa. Sau khi đặt hàng, lưu lại xác nhận đơn và thông tin bảo hành để tiện đối chiếu nếu cần hỗ trợ.",
      ],
      bullets: [
        "Đăng nhập trước khi áp mã để đúng tài khoản và hạng thành viên.",
        "Chọn đúng phân loại, số lượng và địa chỉ giao hàng.",
        "Kiểm tra đơn tối thiểu, danh mục và phương thức thanh toán.",
        "Chỉ dùng mã từ nguồn có link sản phẩm hoặc chương trình rõ ràng.",
        "Xem lại tổng tiền ở bước xác nhận cuối cùng.",
      ],
    },
    {
      title: "Chọn sản phẩm Tiki theo nhu cầu",
      paragraphs: [
        "Với sách và giáo trình, hãy kiểm tra tên tác giả, nhà xuất bản, phiên bản và tình trạng sản phẩm. Giá rẻ có thể là sách cũ hoặc bản in đặc biệt; nếu bạn cần bản mới, hãy đọc kỹ mô tả. Với văn phòng phẩm, chú ý số lượng và thời gian giao nếu cần dùng gấp.",
        "Với điện tử và gia dụng, hãy đối chiếu model, cấu hình, phụ kiện đi kèm và chính sách bảo hành. Nên chọn sản phẩm có thông tin nhà sản xuất rõ ràng và đánh giá thực tế từ người mua. Với hàng chính hãng, tem bảo hành và hóa đơn là những thông tin cần kiểm tra khi nhận hàng.",
        "Với mỹ phẩm, thực phẩm bổ sung và đồ cho mẹ & bé, ưu tiên nguồn gốc, hạn dùng và điều kiện bảo quản. Nếu sản phẩm có ảnh hưởng đến sức khỏe, hãy tham khảo ý kiến chuyên gia trước khi dùng. Đừng mua chỉ vì mức giảm lớn; hãy đánh giá tổng chi phí bao gồm phí ship và giá trị sử dụng thực tế.",
      ],
      bullets: [
        "Sách: tác giả, nhà xuất bản, phiên bản, tình trạng sách.",
        "Điện tử: model, cấu hình, phụ kiện, bảo hành.",
        "Gia dụng: kích thước, điện áp, lắp đặt và phí ship.",
        "Mỹ phẩm: hạn dùng, thành phần, nguồn gốc.",
        "Mẹ & bé: độ tuổi, chứng nhận, hạn dùng.",
      ],
    },
    {
      title: "Lưu ý trước khi mua hàng Tiki",
      paragraphs: [
        "Giá và tồn kho trên Tiki có thể thay đổi theo thời điểm và khu vực. Trước khi thanh toán, hãy kiểm tra giá cuối cùng, phí vận chuyển, thời gian giao dự kiến và chính sách đổi trả. Với sản phẩm do nhà bán khác cung cấp, các điều kiện này có thể khác so với hàng do Tiki bán trực tiếp.",
        "Nếu bạn cần bảo hành, hãy lưu lại hóa đơn, phiếu bảo hành và thông tin đơn hàng. Khi nhận hàng, kiểm tra ngoại quan và quay video mở kiện với đơn giá trị lớn. Nếu sản phẩm sai mô tả hoặc hư hỏng, hãy liên hệ Tiki hoặc nhà bán theo quy trình trên trang đơn hàng thay vì tự thỏa thuận bên ngoài.",
        "Sansale247 là website tổng hợp khuyến mãi, không phải đại lý hay đơn vị bán hàng của Tiki. Mọi giao dịch, thanh toán, vận chuyển, đổi trả và bảo hành do Tiki hoặc nhà bán xử lý. Link tiếp thị liên kết có thể giúp website nhận hoa hồng nhưng không làm tăng giá bạn trả.",
      ],
      bullets: [
        "Kiểm tra giá cuối cùng, phí ship và thời gian giao.",
        "Xác nhận người bán và chính sách bảo hành.",
        "Lưu hóa đơn, phiếu bảo hành và xác nhận đơn.",
        "Quay video mở hàng với đơn giá trị lớn.",
        "Liên hệ Tiki hoặc nhà bán nếu sản phẩm có vấn đề.",
      ],
    },
    {
      title: "Cách so sánh giá và tổng chi phí trên Tiki",
      paragraphs: [
        "Giá niêm yết chưa phản ánh toàn bộ chi phí. Hãy cộng thêm phí vận chuyển, phí bảo hiểm (nếu có), chênh lệch giá giữa các phân loại và chi phí đổi trả tiềm năng. Một sản phẩm rẻ hơn vài chục nghìn nhưng giao chậm hoặc không có bảo hành có thể không phải lựa chọn tốt hơn.",
        "Với các sản phẩm có nhiều biến thể, hãy so sánh theo đơn vị sử dụng thay vì tổng giá. Ví dụ, một combo lớn có thể rẻ hơn theo gram hoặc theo lít, nhưng chỉ có lợi nếu bạn dùng hết trước hạn. Đừng mua số lượng lớn chỉ vì đơn giá thấp nếu nhu cầu không tương xứng.",
        "Giá trên Tiki có thể thay đổi theo thời điểm, khu vực và chương trình. Hãy dùng mức giá bạn đã ghi lại làm mốc tham chiếu, thay vì so sánh với ảnh chụp cũ. Nếu mức giá hiện tại cao hơn đáng kể, có thể chờ đợt khác; nếu sát nhu cầu và chênh lệch nhỏ, đừng để việc chờ đợi làm mất thời gian.",
      ],
      bullets: [
        "Cộng phí ship, bảo hiểm và chi phí đổi trả vào tổng chi phí.",
        "So sánh theo đơn vị sử dụng với combo lớn.",
        "Kiểm tra giá theo đúng phân loại và khu vực giao hàng.",
        "Ghi mốc giá tham chiếu trước khi chờ sale.",
        "Cân nhắc thời gian giao nếu cần dùng sớm.",
      ],
    },
  ],
  lazada: [
    {
      title: "Lazada có gì trong ngày sale?",
      paragraphs: [
        "Lazada thường tổ chức sale theo khung giờ với flash sale, voucher của sàn, voucher LazMall, mã freeship và ưu đãi thanh toán. Các chương trình lớn như 11.11, 12.12 hoặc Black Friday có thể kéo dài nhiều ngày, nhưng giá tốt nhất thường tập trung vào một số khung giờ nhất định. Số lượng sản phẩm trong flash sale có hạn và có thể hết rất nhanh.",
        "Bên cạnh giá giảm, Lazada còn có các gian hàng LazMall với cam kết chính hãng và chính sách đổi trả riêng. Không phải mọi sản phẩm trên Lazada đều đến từ LazMall; có cả nhà bán thông thường. Vì vậy, hãy kiểm tra nhãn gian hàng, đánh giá và chính sách bảo hành trước khi quyết định.",
        "Nếu bạn tìm bằng tiếng Anh với cụm \"Lazada promo codes\" hoặc \"Lazada voucher\", hãy đọc kỹ điều kiện bằng tiếng Việt trên trang thanh toán. Một số mã chỉ dành cho người dùng mới, một số yêu cầu phương thức thanh toán cụ thể hoặc giá trị đơn tối thiểu. Trang này tổng hợp deal đang chạy và dẫn về trang đích để bạn kiểm tra.",
      ],
      bullets: [
        "Flash sale theo khung giờ, số lượng có hạn.",
        "Voucher sàn và voucher LazMall theo chương trình.",
        "Mã freeship và ưu đãi vận chuyển theo khu vực.",
        "Ưu đãi thanh toán qua ngân hàng hoặc ví điện tử.",
        "Deal theo mùa: 11.11, 12.12, Black Friday, Tết.",
      ],
    },
    {
      title: "Cách săn voucher Lazada hiệu quả",
      paragraphs: [
        "Hãy chuẩn bị trước danh sách sản phẩm và ngân sách. Trong ngày sale, việc chuyển qua lại giữa nhiều trang có thể khiến bạn bỏ lỡ khung giờ mở bán. Lưu sản phẩm vào giỏ, kiểm tra địa chỉ giao hàng và đăng nhập sẵn để rút ngắn thao tác khi voucher mở.",
        "Voucher Lazada thường xuất hiện ở trang chủ, trang sản phẩm, mục voucher và thông báo trong ứng dụng. Hãy thu thập mã trước, sau đó áp dụng theo thứ tự phù hợp. Không phải mã nào cũng cộng dồn; một số chương trình loại trừ nhau hoặc chỉ áp dụng cho một sản phẩm trong giỏ.",
        "Trước khi xác nhận, hãy kiểm tra lại tổng tiền, phí ship và số tiền giảm thực tế. Nếu mã không áp dụng, đọc thông báo lỗi thay vì thử lại liên tục. Có thể bạn chưa đạt đơn tối thiểu, chọn sai danh mục hoặc mã đã hết lượt. Ghi lại mã và thời điểm thử để dễ đối chiếu nếu cần hỗ trợ.",
        "Mỗi tài khoản có thể có hạn mức voucher khác nhau, nhất là trong các đợt sale lớn. Nếu mua giúp nhiều người, hãy kiểm tra điều kiện về số lượng sản phẩm và địa chỉ giao hàng trước khi thanh toán. Đừng dùng nhiều tài khoản để lách giới hạn; việc này có thể vi phạm điều khoản của sàn và khiến đơn bị hủy.",
      ],
      bullets: [
        "Lưu sản phẩm và đăng nhập trước khung giờ sale.",
        "Thu thập voucher từ trang chủ, trang sản phẩm và ứng dụng.",
        "Đọc điều kiện: đơn tối thiểu, danh mục, thanh toán, hạn dùng.",
        "Thử áp mã theo thứ tự và kiểm tra tổng tiền sau mỗi lần.",
        "Không thử quá nhiều mã trong thời gian ngắn.",
      ],
    },
    {
      title: "Chọn deal Lazada theo danh mục",
      paragraphs: [
        "Với điện tử, hãy đối chiếu cấu hình, model, bảo hành và tình trạng hàng. Giá rẻ bất thường có thể đi kèm hàng cũ, hàng refub hoặc bảo hành ngắn. Với thời trang, kiểm tra bảng size, chất liệu và chính sách đổi trả; ảnh sản phẩm có thể khác thực tế.",
        "Với đồ gia dụng và nội thất nhỏ, chú ý kích thước, điện áp, phụ kiện và phí vận chuyển. Món đồ cồng kềnh có thể có phí ship cao, làm mất lợi thế giá giảm. Với mỹ phẩm và đồ cho mẹ & bé, ưu tiên gian hàng LazMall hoặc nhà bán có thông tin rõ ràng, hạn dùng còn dài và đánh giá thực tế.",
        "Với hàng thể thao, đồ chơi và phụ kiện xe, hãy kiểm tra độ tương thích, chất liệu và bảo hành. Đừng mua theo giá nếu sản phẩm không đúng nhu cầu; chi phí đổi trả hoặc mua lại có thể lớn hơn khoản tiết kiệm ban đầu. So sánh tổng chi phí, không chỉ giá niêm yết.",
      ],
      bullets: [
        "Điện tử: model, cấu hình, bảo hành, tình trạng hàng.",
        "Thời trang: size, chất liệu, đổi trả.",
        "Gia dụng: kích thước, điện áp, phí ship.",
        "Mỹ phẩm: LazMall, hạn dùng, nguồn gốc.",
        "Phụ kiện xe: tương thích, chất liệu, bảo hành.",
      ],
    },
    {
      title: "Kiểm tra trước khi chốt đơn Lazada",
      paragraphs: [
        "Hãy xem kỹ thông tin nhà bán, đánh giá và chính sách đổi trả. Với sản phẩm giá trị lớn, nên chọn gian hàng có bảo hành rõ ràng và phản hồi tốt. Kiểm tra thời gian giao dự kiến để không ảnh hưởng kế hoạch sử dụng, nhất là trong mùa sale cao điểm.",
        "Khi nhận hàng, kiểm tra ngoại quan, phụ kiện và tem bảo hành. Quay video mở kiện nếu đơn có giá trị cao. Nếu sản phẩm sai mô tả hoặc hư hỏng, hãy mở yêu cầu đổi trả trên Lazada trong thời hạn quy định và cung cấp ảnh, video làm bằng chứng.",
        "Sansale247 không bán hàng và không xử lý đơn Lazada. Website chỉ tổng hợp thông tin khuyến mãi và dẫn link. Mọi giao dịch, thanh toán, vận chuyển, đổi trả và bảo hành do Lazada hoặc nhà bán xử lý. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Kiểm tra nhà bán, đánh giá và chính sách đổi trả.",
        "Xem thời gian giao dự kiến trong mùa sale.",
        "Kiểm tra ngoại quan và phụ kiện khi nhận hàng.",
        "Quay video mở kiện với đơn giá trị lớn.",
        "Mở yêu cầu đổi trả trong thời hạn của Lazada.",
      ],
    },
    {
      title: "Mẹo giảm chi phí khi mua Lazada",
      paragraphs: [
        "Chi phí thực tế của một đơn Lazada gồm giá sản phẩm, phí vận chuyển, phụ phí (nếu có) và khoản tiền bạn có thể mất nếu phải đổi trả. Trước khi chốt, hãy cộng tất cả các khoản này thay vì chỉ so sánh giá hiển thị. Một mức giảm vài chục nghìn có thể bị phí ship hoặc chi phí đổi trả làm mất lợi thế.",
        "Hãy tận dụng các nguồn voucher khác nhau: voucher sàn, voucher LazMall, mã freeship và ưu đãi thanh toán. Thu thập trước, sau đó thử kết hợp theo thứ tự và kiểm tra tổng tiền sau mỗi lần áp dụng. Đừng giả định mọi mã cộng dồn được; hệ thống sẽ loại trừ những chương trình không tương thích.",
        "Với đơn hàng lớn, nên chia thành nhiều đơn nhỏ nếu mỗi đơn đều đạt điều kiện freeship hoặc voucher, nhưng cân nhắc phí ship phát sinh. Chia đơn cũng giúp bạn xử lý đổi trả từng phần dễ hơn. Tuy nhiên, đừng chia nhỏ quá mức khiến bạn khó theo dõi hoặc phát sinh nhiều lần giao.",
        "Cuối cùng, hãy theo dõi giá trong vài ngày trước khi mua. Giá có thể tăng trước đợt sale rồi giảm về mức cũ, khiến mức giảm trông lớn hơn thực tế. Ghi lại mức giá bạn thấy hợp lý và chỉ mua khi tổng chi phí nằm trong ngưỡng đó.",
      ],
      bullets: [
        "Cộng giá, phí ship, phụ phí và chi phí đổi trả trước khi quyết định.",
        "Thu thập voucher sàn, LazMall, freeship và ưu đãi thanh toán.",
        "Thử kết hợp mã và kiểm tra tổng tiền sau mỗi lần áp dụng.",
        "Cân nhắc chia đơn lớn nếu tiết kiệm hơn và dễ đổi trả.",
        "Theo dõi giá vài ngày để tránh giá neo trước sale.",
        "Chỉ mua khi tổng chi phí nằm trong ngưỡng bạn chấp nhận.",
      ],
    },
  ],
  tiktokshop: [
    {
      title: "TikTok Shop khác gì sàn truyền thống?",
      paragraphs: [
        "TikTok Shop gắn liền với video ngắn và livestream, nên nhiều deal được giới thiệu trực tiếp bởi nhà sáng tạo nội dung hoặc người bán. Điều này giúp bạn thấy sản phẩm trong ngữ cảnh sử dụng, nhưng cũng có thể khiến quyết định mua bị ảnh hưởng bởi cảm xúc và tính cấp bách của phiên live. Hãy tách nhu cầu thật khỏi áp lực \"chỉ còn vài phút\".",
        "Người bán trên TikTok Shop rất đa dạng, từ thương hiệu lớn đến shop nhỏ. Không phải shop nào cũng có cùng chính sách đổi trả, thời gian giao hàng hoặc chất lượng đóng gói. Vì vậy, kiểm tra thông tin người bán quan trọng hơn việc chỉ xem giá và số lượt thích.",
        "Nếu bạn tìm bằng tiếng Anh với cụm \"TikTok Shop deals\" hoặc \"TikTok Shop voucher\", hãy đọc kỹ điều kiện hiển thị trên ứng dụng. Mã có thể giới hạn theo tài khoản, phương thức thanh toán hoặc khung giờ livestream. Trang này tổng hợp deal đang ghi nhận và dẫn về trang đích để bạn kiểm tra trước khi mua.",
      ],
      bullets: [
        "Deal từ livestream và video ngắn.",
        "Voucher của shop, voucher nền tảng và ưu đãi thanh toán.",
        "Nhiều mức giá và chính sách khác nhau giữa các shop.",
        "Sản phẩm thời trang, làm đẹp, gia dụng và phụ kiện.",
        "Cần kiểm tra kỹ người bán trước khi đặt.",
      ],
    },
    {
      title: "Cách tìm voucher và deal TikTok Shop",
      paragraphs: [
        "Hãy theo dõi shop hoặc nhà sáng tạo bạn quan tâm để nhận thông báo khi có livestream. Trong phiên live, voucher và giá có thể thay đổi theo từng khung giờ; không phải sản phẩm nào cũng giữ nguyên mức giá đến cuối phiên. Nếu đã xác định mua, hãy chuẩn bị sẵn thông tin giao hàng và phương thức thanh toán.",
        "Ngoài livestream, voucher có thể xuất hiện ở trang sản phẩm, giỏ hàng hoặc mục khuyến mãi. Hãy đọc điều kiện về đơn tối thiểu, danh mục và hạn dùng. Một số mã chỉ áp dụng cho người mua lần đầu hoặc cho sản phẩm cụ thể; đừng giả định mọi mã đều dùng được cho mọi đơn.",
        "Trước khi chốt, so sánh giá sau giảm với giá thông thường và phí vận chuyển. Một mức giảm lớn nhưng phí ship cao hoặc thời gian giao dài có thể không thực sự tiết kiệm. Nếu sản phẩm cần dùng gấp, hãy kiểm tra thời gian giao dự kiến thay vì chỉ nhìn giá.",
      ],
      bullets: [
        "Theo dõi shop và lịch livestream để nhận voucher.",
        "Kiểm tra voucher ở trang sản phẩm, giỏ hàng và mục khuyến mãi.",
        "Đọc điều kiện đơn tối thiểu, danh mục và hạn dùng.",
        "So sánh tổng tiền sau giảm và phí ship.",
        "Kiểm tra thời gian giao nếu cần dùng gấp.",
      ],
    },
    {
      title: "Đánh giá người bán trước khi mua",
      paragraphs: [
        "Hãy xem đánh giá shop, số lượng đã bán, tỷ lệ phản hồi và các bình luận gần đây. Đánh giá 5 sao có thể không phản ánh đầy đủ chất lượng; nên đọc cả bình luận trung bình và tiêu cực để biết vấn đề thường gặp. Với sản phẩm có nhiều biến thể, hãy kiểm tra đánh giá theo đúng phân loại bạn định mua.",
        "Xem chính sách đổi trả, bảo hành và thời gian giao hàng trên trang sản phẩm. Nếu thông tin không rõ ràng, hãy hỏi shop trước khi đặt. Với hàng điện tử, mỹ phẩm hoặc đồ cho trẻ em, nên ưu tiên shop có giấy tờ, tem nhãn và phản hồi cụ thể thay vì chỉ có giá rẻ.",
        "Khi nhận hàng, kiểm tra ngoại quan và quay video mở kiện. Nếu sản phẩm sai mô tả, hư hỏng hoặc không đúng phân loại, hãy mở yêu cầu đổi trả trên TikTok Shop trong thời hạn quy định. Giữ lại mã đơn, ảnh chụp và video để làm bằng chứng khi cần khiếu nại.",
      ],
      bullets: [
        "Xem đánh giá shop và bình luận gần đây.",
        "Kiểm tra số lượng đã bán và tỷ lệ phản hồi.",
        "Đọc chính sách đổi trả, bảo hành, thời gian giao.",
        "Hỏi shop nếu thông tin sản phẩm chưa rõ.",
        "Quay video mở hàng và giữ bằng chứng đơn hàng.",
      ],
    },
    {
      title: "Chọn danh mục phù hợp trên TikTok Shop",
      paragraphs: [
        "Thời trang và phụ kiện thường có nhiều mẫu mã, size và chất liệu khác nhau. Hãy xem bảng size, ảnh thực tế từ người mua và chính sách đổi trả. Với mỹ phẩm, ưu tiên shop có thông tin nguồn gốc, hạn dùng và đánh giá thực tế; không nên mua sản phẩm không rõ thương hiệu chỉ vì giá thấp.",
        "Đồ gia dụng, đồ bếp và phụ kiện công nghệ cần kiểm tra kích thước, điện áp, chất liệu và bảo hành. Với thiết bị điện, hãy chọn shop có tem bảo hành và thông tin sản phẩm rõ ràng. Với đồ cho mẹ & bé, kiểm tra độ tuổi, thành phần và chứng nhận an toàn trước khi mua.",
        "Sản phẩm từ livestream có thể có giá tốt nhưng số lượng giới hạn. Nếu chưa chắc về chất lượng, hãy bắt đầu với đơn nhỏ để trải nghiệm shop trước khi mua món giá trị lớn. Đừng mua số lượng nhiều chỉ để được freeship hoặc nhận quà tặng nếu bạn không thực sự cần.",
      ],
      bullets: [
        "Thời trang: size, chất liệu, ảnh thực tế, đổi trả.",
        "Mỹ phẩm: nguồn gốc, hạn dùng, đánh giá.",
        "Gia dụng: kích thước, điện áp, bảo hành.",
        "Mẹ & bé: độ tuổi, thành phần, chứng nhận.",
        "Đơn lớn: thử shop bằng đơn nhỏ trước.",
      ],
    },
    {
      title: "Lưu ý sau khi đặt hàng TikTok Shop",
      paragraphs: [
        "Sau khi đặt, hãy theo dõi trạng thái đơn và thông tin vận chuyển. Nếu shop giao chậm hoặc không cập nhật, liên hệ trực tiếp qua kênh của TikTok Shop thay vì nhắn tin ngoài nền tảng. Không chuyển khoản thêm hoặc cung cấp mã OTP cho bất kỳ ai yêu cầu.",
        "Khi nhận hàng, kiểm tra sản phẩm trước khi bấm xác nhận đã nhận. Nếu có vấn đề, chụp ảnh, quay video và mở yêu cầu đổi trả trong thời hạn. Giữ lại bao bì và phụ kiện để việc hoàn trả thuận tiện hơn.",
        "Sansale247 không bán hàng và không xử lý đơn TikTok Shop. Website chỉ tổng hợp thông tin khuyến mãi và dẫn link. Mọi giao dịch, thanh toán, vận chuyển, đổi trả và bảo hành do TikTok Shop hoặc người bán xử lý. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Theo dõi trạng thái đơn và thông tin vận chuyển.",
        "Chỉ liên hệ shop qua kênh chính thức của TikTok Shop.",
        "Không chuyển khoản thêm hoặc chia sẻ OTP.",
        "Kiểm tra hàng trước khi xác nhận đã nhận.",
        "Mở yêu cầu đổi trả trong thời hạn nếu có vấn đề.",
      ],
    },
    {
      title: "Xử lý khi đơn TikTok Shop có vấn đề",
      paragraphs: [
        "Nếu đơn giao chậm, trước tiên hãy kiểm tra trạng thái vận chuyển và thông báo từ đơn vị giao hàng. Đôi khi đơn bị hoãn do thời tiết, quá tải hoặc sai địa chỉ. Nếu shop không phản hồi trong thời gian hợp lý, hãy dùng kênh hỗ trợ chính thức của TikTok Shop thay vì nhắn tin qua tài khoản cá nhân hoặc chuyển khoản ngoài nền tảng.",
        "Khi nhận hàng, hãy kiểm tra trước khi bấm xác nhận. Nếu sản phẩm sai mô tả, thiếu phụ kiện, hư hỏng hoặc không đúng phân loại, hãy chụp ảnh và quay video rõ tình trạng, sau đó mở yêu cầu trả hàng/hoàn tiền trong thời hạn quy định. Giữ lại bao bì, tem nhãn và hóa đơn để việc đối chiếu thuận tiện.",
        "Không nên tự thỏa thuận hoàn tiền ngoài hệ thống, kể cả khi shop hứa xử lý nhanh. Giao dịch ngoài nền tảng có thể khiến bạn mất quyền được bảo vệ. Nếu shop yêu cầu cung cấp OTP, mật khẩu hoặc chuyển khoản thêm, hãy dừng lại và báo cáo với TikTok Shop.",
        "Cuối cùng, hãy đánh giá shop sau khi xử lý xong. Đánh giá trung thực giúp người mua sau có thêm thông tin và cũng là tín hiệu để nền tảng xử lý các shop có vấn đề. Đừng đánh giá chỉ vì được tặng quà hoặc yêu cầu xóa đánh giá.",
      ],
      bullets: [
        "Kiểm tra trạng thái vận chuyển trước khi liên hệ shop.",
        "Chỉ dùng kênh hỗ trợ chính thức của TikTok Shop.",
        "Chụp ảnh, quay video và mở yêu cầu trả hàng trong thời hạn.",
        "Giữ bao bì, tem nhãn và bằng chứng đơn hàng.",
        "Không chuyển khoản thêm hoặc cung cấp OTP.",
        "Đánh giá trung thực sau khi vấn đề được xử lý.",
      ],
    },
  ],
};

/** Extra FAQs appended to the four base questions in content.ts. */
export const MERCHANT_EXTRA_FAQS: Record<Merchant, LandingFaqItem[]> = {
  shopee: [
    {
      question: "Shopee promo code là gì và dùng thế nào?",
      answer:
        "Đó là mã giảm giá áp dụng khi thanh toán đơn Shopee. Bạn nhập mã ở bước thanh toán, sau khi đã chọn sản phẩm và địa chỉ giao hàng. Mã chỉ hoạt động nếu đơn đạt điều kiện về giá trị, danh mục, phương thức thanh toán và còn lượt sử dụng.",
    },
    {
      question: "Có nên mua thêm để đủ điều kiện freeship?",
      answer:
        "Chỉ nên mua thêm nếu món thêm thực sự cần và tổng chi phí vẫn có lợi. Đừng mua hàng không dùng chỉ để tiết kiệm phí ship; khoản phát sinh có thể lớn hơn số tiền được giảm.",
    },
    {
      question: "Mã Shopee áp dụng được cho mọi sản phẩm không?",
      answer:
        "Không. Nhiều mã giới hạn danh mục, người bán, phương thức thanh toán hoặc giá trị đơn. Hãy đọc điều kiện trên trang voucher và kiểm tra lại ở bước thanh toán trước khi xác nhận.",
    },
    {
      question: "Làm sao biết deal Shopee còn hiệu lực?",
      answer:
        "Hãy mở link sản phẩm và xem giá, tồn kho, thời gian khuyến mãi trên trang đích. Trang tổng hợp có thể cập nhật chậm hơn vài phút so với sàn, đặc biệt trong các khung giờ flash sale.",
    },
  ],
  tiki: [
    {
      question: "Tiki promo codes có áp dụng cho mọi tài khoản?",
      answer:
        "Không. Một số mã chỉ dành cho người dùng mới, thành viên ở hạng nhất định hoặc đơn hàng đầu tiên. Điều kiện cụ thể được ghi trên trang voucher hoặc hiển thị khi bạn nhập mã ở bước thanh toán.",
    },
    {
      question: "Sản phẩm Tiki có phải luôn do Tiki bán không?",
      answer:
        "Không. Tiki có thể có nhiều nhà bán tham gia. Hãy kiểm tra tên người bán, chính sách bảo hành và đổi trả trên trang sản phẩm để biết ai chịu trách nhiệm sau khi mua.",
    },
    {
      question: "Có nên chờ sale lớn để mua Tiki?",
      answer:
        "Sale lớn có thể có voucher tốt hơn, nhưng không phải sản phẩm nào cũng giảm sâu và tồn kho có thể hạn chế. Nếu cần dùng ngay, hãy so sánh giá hiện tại với mức giá bạn chấp nhận được thay vì chờ đợi.",
    },
    {
      question: "Mua hàng Tiki có được kiểm tra khi nhận không?",
      answer:
        "Chính sách kiểm hàng phụ thuộc đơn vị vận chuyển và người bán. Bạn nên xem thông tin trên trang đơn hàng; với đơn giá trị lớn, hãy quay video mở kiện để có bằng chứng nếu sản phẩm có vấn đề.",
    },
  ],
  lazada: [
    {
      question: "Lazada promo codes dùng được mấy lần?",
      answer:
        "Tùy chương trình. Có mã dùng một lần, có mã dùng nhiều lần nhưng giới hạn theo tài khoản hoặc thời gian. Hãy đọc điều kiện trên trang voucher trước khi áp dụng.",
    },
    {
      question: "Voucher Lazada có cộng dồn với voucher shop không?",
      answer:
        "Không phải lúc nào cũng cộng dồn. Một số chương trình loại trừ nhau hoặc chỉ cho chọn một mã giảm giá. Hệ thống sẽ báo lỗi nếu bạn áp dụng mã không tương thích; hãy thử từng mã và kiểm tra tổng tiền.",
    },
    {
      question: "LazMall khác gì nhà bán thông thường?",
      answer:
        "LazMall thường có cam kết chính hãng và chính sách đổi trả riêng, nhưng bạn vẫn nên kiểm tra thông tin sản phẩm, bảo hành và đánh giá. Không phải mọi sản phẩm trên Lazada đều thuộc LazMall.",
    },
    {
      question: "Flash sale Lazada có đảm bảo còn hàng không?",
      answer:
        "Không. Flash sale thường giới hạn số lượng và có thể hết trước khi bạn hoàn tất thanh toán. Nếu sản phẩm hết, bạn có thể xem deal tương tự hoặc chờ khung giờ tiếp theo.",
    },
  ],
  tiktokshop: [
    {
      question: "TikTok Shop deals có an toàn không?",
      answer:
        "Nền tảng có quy trình đặt hàng và thanh toán riêng, nhưng chất lượng phụ thuộc người bán. Hãy kiểm tra đánh giá, chính sách đổi trả và chỉ giao dịch trong ứng dụng; không chuyển khoản ngoài nền tảng.",
    },
    {
      question: "Voucher TikTok Shop có dùng được sau livestream không?",
      answer:
        "Tùy chương trình. Một số voucher chỉ có hiệu lực trong phiên live hoặc trong thời gian ngắn sau đó. Hãy kiểm tra hạn dùng và điều kiện trước khi thanh toán.",
    },
    {
      question: "Làm sao kiểm tra shop TikTok có uy tín?",
      answer:
        "Xem số lượng đã bán, đánh giá gần đây, tỷ lệ phản hồi và bình luận về đóng gói, giao hàng, đổi trả. Nên bắt đầu bằng đơn nhỏ nếu chưa từng mua từ shop đó.",
    },
    {
      question: "Tôi có thể hủy đơn TikTok Shop không?",
      answer:
        "Việc hủy đơn phụ thuộc trạng thái đơn và chính sách của shop. Hãy thao tác trong ứng dụng TikTok Shop càng sớm càng tốt; Sansale247 không thể hủy hoặc thay đổi đơn hàng thay bạn.",
    },
  ],
};
