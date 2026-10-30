import type { LandingFaqItem, LandingSection } from "./merchant-sections";

/**
 * Long-form sections for the eight G1.3 category hubs. Each category gets a
 * different angle so pages are not near-duplicates: freeship = eligibility,
 * voucher = terms, beauty = safety, fashion = sizing, electronics = warranty,
 * book = editions, food = shelf life, home = logistics. Claims stay factual:
 * we aggregate public/partner offers, we do not sell or fulfil orders.
 * English queries are addressed naturally (e.g. "free shipping voucher").
 */
export const CATEGORY_SECTIONS: Record<string, LandingSection[]> = {
  freeship: [
    {
      title: "Mã freeship giảm được khoản nào?",
      paragraphs: [
        "Mã freeship giảm hoặc miễn phí vận chuyển khi đơn hàng đạt điều kiện. Phần được giảm thường chỉ là phí ship cơ bản, chưa gồm phụ thu khu vực xa, phụ thu cân nặng hoặc phụ phí của đơn vị giao hàng. Vì vậy, mức miễn phí bạn thấy trên mã có thể thấp hơn số tiền phải trả thực tế nếu đơn đi xa hoặc nặng hơn định mức.",
        "Shopee, Lazada, Tiki và TikTok Shop đều có chương trình freeship riêng theo từng thời điểm. Mã có thể đến từ sàn, từ người bán hoặc từ chương trình theo khung giờ. Số lượng mã thường giới hạn theo ngày và theo tài khoản, nên mã có thể hết trước thời hạn ghi trên trang voucher.",
        "Nếu bạn tìm bằng tiếng Anh với cụm \"free shipping voucher\" hoặc \"Shopee freeship code\", cách kiểm tra vẫn như vậy: đọc điều kiện trước, sau đó xem phí vận chuyển ở bước thanh toán. Trang này tổng hợp các mã đang được ghi nhận và dẫn về trang đích để bạn tự kiểm tra lần cuối.",
      ],
      bullets: [
        "Freeship thường chỉ giảm phí ship cơ bản.",
        "Phụ thu cân nặng và khu vực xa có thể vẫn tính.",
        "Mã đến từ sàn, người bán hoặc chương trình khung giờ.",
        "Số lượng mã giới hạn theo ngày và tài khoản.",
        "Kiểm tra phí ship thực tế ở bước thanh toán.",
      ],
    },
    {
      title: "Điều kiện đơn tối thiểu và cách gom đơn",
      paragraphs: [
        "Phần lớn mã freeship yêu cầu giá trị đơn tối thiểu. Một số mã loại trừ danh mục, chỉ dành cho người mua lần đầu hoặc yêu cầu phương thức thanh toán cụ thể. Điều kiện được ghi trên trang voucher và có thể hiển thị lại khi bạn nhập mã; hãy đọc trước khi thêm sản phẩm vào giỏ.",
        "Gom đơn là cách phổ biến để đạt mức tối thiểu, nhưng chỉ nên thêm những món bạn thực sự cần. Nếu món thêm không dùng đến, số tiền bỏ ra có thể lớn hơn phần phí ship được giảm. Hãy tính tổng chi phí sau giảm thay vì chỉ nhìn nhãn freeship trên sản phẩm.",
        "Với đơn cần dùng gấp, thời gian chờ mã cũng là một chi phí. Nếu mức tiết kiệm nhỏ hơn giá trị thời gian bạn bỏ ra, hãy đặt hàng ngay. Không nên hoãn một món cần thiết chỉ để chờ đợt mã tiếp theo.",
      ],
      bullets: [
        "Đọc kỹ đơn tối thiểu, danh mục và phương thức thanh toán.",
        "Chỉ gom thêm món thực sự cần dùng.",
        "So tổng chi phí sau giảm, không chỉ nhìn mức miễn ship.",
        "Giữ mã cho đợt sau nếu đơn chưa đạt điều kiện.",
        "Đừng hoãn món cần gấp vì chờ mã.",
      ],
    },
    {
      title: "Khu vực giao hàng và đơn vị vận chuyển",
      paragraphs: [
        "Phí vận chuyển thay đổi theo khoảng cách từ kho người bán đến địa chỉ nhận. Khu vực trung tâm thường rẻ hơn, trong khi huyện xa, đảo hoặc địa chỉ khó giao có thể phát sinh phụ thu. Cùng một mã freeship áp cho hai địa chỉ khác nhau có thể cho kết quả khác nhau.",
        "Mỗi đơn vị vận chuyển có bảng phí riêng về cân nặng, kích thước và thời gian giao. Đơn cồng kềnh hoặc nặng thường có phần phụ phí không nằm trong mã. Nếu bạn cần hàng đúng ngày, hãy xem thời gian giao dự kiến bên cạnh mức phí được giảm.",
        "Hãy nhập địa chỉ chính xác ngay từ đầu và ghi chú rõ nếu ở chung cư nhiều tòa hoặc nơi giao hàng khó tìm. Sửa địa chỉ sau khi đơn đã đi có thể làm phát sinh phí hoặc khiến đơn bị trả về.",
      ],
      bullets: [
        "Phí ship phụ thuộc khoảng cách, cân nặng và kích thước.",
        "Khu vực xa hoặc đảo có thể có phụ thu riêng.",
        "Xem thời gian giao dự kiến trước khi xác nhận.",
        "Nhập địa chỉ và ghi chú giao hàng thật rõ.",
        "Đơn nặng, cồng kềnh thường không được miễn toàn bộ.",
      ],
    },
    {
      title: "Kết hợp freeship với mã giảm giá",
      paragraphs: [
        "Nhiều người muốn áp đồng thời mã freeship và mã giảm giá sản phẩm. Mỗi sàn có quy ước riêng: có nơi cho dùng nhiều mã, có nơi chỉ cho chọn một mã giảm giá và một mã vận chuyển. Đừng giả định mọi mã cộng dồn được; hãy thử từng cách và xem tổng tiền cuối cùng.",
        "Thứ tự áp mã có thể ảnh hưởng kết quả. Với một số chương trình, điều kiện đơn được tính trên giá trước khi giảm mã; với chương trình khác, điều kiện tính sau khi đã áp mã. Nếu mã báo lỗi, hãy đọc thông báo thay vì nhập lại liên tục.",
        "Mã giảm giá và freeship đều có hạn sử dụng riêng. Khi đơn hàng lớn, hãy so giá trị mã giảm giá với phần phí ship được miễn để chọn phương án có lợi hơn. Với đơn nhỏ và nhẹ, freeship có thể chiếm tỷ trọng lớn hơn.",
      ],
      bullets: [
        "Mỗi sàn có quy ước cộng dồn mã khác nhau.",
        "Thử từng mã và kiểm tra tổng tiền sau mỗi lần.",
        "Đọc thông báo lỗi thay vì nhập lại nhiều lần.",
        "So giá trị mã giảm giá với phần ship được miễn.",
        "Kiểm tra hạn của cả hai loại mã.",
      ],
    },
    {
      title: "Lưu ý trước khi thanh toán",
      paragraphs: [
        "Trước khi xác nhận, hãy kiểm tra ba thứ: phí vận chuyển sau khi áp mã, mã đã thực sự được áp dụng và tổng tiền cuối cùng. Nếu tổng tiền không thay đổi như mong đợi, hãy quay lại bước trước để xử lý thay vì thanh toán rồi khiếu nại sau.",
        "Chỉ thanh toán trong hệ thống của sàn. Không chuyển khoản riêng cho người bán và không cung cấp mã OTP cho bất kỳ ai, kể cả người tự xưng là nhân viên hỗ trợ. Các sàn lớn không yêu cầu bạn cung cấp mật khẩu hay mã xác thực qua tin nhắn.",
        "Sansale247 là website tổng hợp khuyến mãi, không bán hàng và không xử lý vận chuyển. Mọi giao dịch, thanh toán, đổi trả và freeship thực tế do sàn hoặc người bán quyết định. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Kiểm tra phí ship, mã đã áp dụng và tổng tiền cuối.",
        "Không chuyển khoản riêng hoặc cung cấp OTP.",
        "Giao dịch trong sàn để được bảo vệ.",
        "Freeship thực tế do sàn và đơn vị giao tính toán.",
        "Đọc tiết lộ affiliate nếu bạn quan tâm cách website vận hành.",
      ],
    },
  ],
  voucher: [
    {
      title: "Các loại voucher phổ biến",
      paragraphs: [
        "Voucher giảm giá thường thuộc ba nhóm: mã của sàn áp cho toàn trang, voucher của từng cửa hàng hoặc nhà bán, và ưu đãi thanh toán từ ngân hàng hoặc ví điện tử. Mỗi nhóm có điều kiện riêng về giá trị đơn, danh mục và số lần sử dụng.",
        "Có mã cần nhập tay ở bước thanh toán, có mã phải bấm nhận trước rồi mới áp dụng. Mã nhập tay dễ sai do thừa khoảng trắng hoặc nhầm ký tự; mã nhận trước có thể bị bỏ qua nếu bạn quên bấm nút nhận. Hãy kiểm tra mục khuyến mãi trong giỏ hàng để biết mã nào đang hoạt động.",
        "Trang này tổng hợp mã đang được ghi nhận kèm điều kiện bằng tiếng Việt. Nếu bạn tìm bằng tiếng Anh với cụm \"coupon code\" hoặc \"promo code\", hãy đối chiếu lại điều kiện trên trang thanh toán của sàn trước khi mua.",
      ],
      bullets: [
        "Mã sàn, voucher của shop và ưu đãi thanh toán.",
        "Mã nhập tay và mã cần bấm nhận trước.",
        "Kiểm tra danh mục áp dụng và số lần dùng.",
        "Không phải mọi mã đều cộng dồn được.",
        "Đối chiếu điều kiện ở bước thanh toán cuối.",
      ],
    },
    {
      title: "Đọc điều kiện trước khi dùng mã",
      paragraphs: [
        "Mỗi voucher có ít nhất bốn điều kiện: hạn sử dụng, giá trị đơn tối thiểu, danh mục hoặc người bán áp dụng, và giới hạn số lượt hoặc tài khoản. Bốn thông tin này quyết định mã có dùng được hay không, quan trọng hơn mức phần trăm giảm ghi trên tiêu đề.",
        "Một số mã chỉ dành cho người dùng mới, hạng thành viên cụ thể hoặc đơn đầu tiên trong tháng. Một số mã loại trừ sản phẩm đang giảm sẵn hoặc gian hàng nhất định. Nếu mã báo lỗi dù bạn nghĩ đã đủ điều kiện, hãy kiểm tra sản phẩm trong giỏ có thuộc chương trình bị loại trừ không.",
        "Hạn trên voucher có thể không phải hạn thực tế nếu số lượng phát đã hết. Đây là điều thường gặp trong đợt sale lớn, nên đừng chờ đến phút cuối. Với món chắc chắn mua, hãy áp mã sớm và thanh toán khi điều kiện đã đạt.",
      ],
      bullets: [
        "Bốn điều kiện chính: hạn, đơn tối thiểu, danh mục, số lượt.",
        "Không chỉ nhìn mức giảm trên tiêu đề.",
        "Mã người mới hoặc hạng thành viên có điều kiện riêng.",
        "Sản phẩm đang giảm sẵn có thể bị loại trừ.",
        "Số lượng mã có thể hết trước hạn.",
      ],
    },
    {
      title: "Lỗi khi nhập mã và cách xử lý",
      paragraphs: [
        "Lỗi phổ biến nhất là sai định dạng: thừa khoảng trắng, nhầm số 0 với chữ O hoặc thiếu ký tự. Hãy dán mã trực tiếp từ nơi bạn lưu thay vì nhập tay. Nếu vẫn lỗi, kiểm tra tài khoản đã đăng nhập đúng và mã không bị trống.",
        "Lỗi thứ hai là loại trừ chương trình: mã không cộng dồn với mã khác đang áp trong giỏ. Hãy thử bỏ mã cũ trước, hoặc so tổng tiền theo từng phương án để chọn cách tiết kiệm hơn. Tránh nhập đi nhập lại một mã đã báo không hợp lệ.",
        "Một số mã chỉ áp dụng theo khung giờ hoặc khu vực. Thử lại ở thời điểm khác có thể cho kết quả khác, nhưng nếu mã vẫn lỗi thì nên chuyển sang chương trình khác. Ghi lại mã đã thử để không mất thời gian kiểm tra lại.",
      ],
      bullets: [
        "Dán mã thay vì nhập tay để tránh lỗi ký tự.",
        "Kiểm tra đăng nhập và danh mục trước khi thử lại.",
        "Bỏ mã khác đã áp rồi thử lại với mã mới.",
        "Không nhập liên tục một mã không hoạt động.",
        "Ghi lại mã đã thử để tránh lặp lại.",
      ],
    },
    {
      title: "Lên kế hoạch mua bằng voucher",
      paragraphs: [
        "Hãy viết danh sách cần mua và mức giá bạn chấp nhận cho từng món trước khi sale mở. Khi có voucher, so sản phẩm với danh sách thay vì mở rộng giỏ theo những gì đang được quảng cáo. Voucher giúp giảm chi phí trên đơn đã định, không phải lý do để mua thêm.",
        "Trong các đợt sale lớn, giá có thể được điều chỉnh trước đó. Ghi lại giá tham chiếu vài ngày trước sale giúp bạn phân biệt mức giảm thật với việc chỉ đưa giá về mức cũ. Cách này đúng cho mọi sàn, kể cả khi bạn tìm mã bằng tiếng Anh.",
        "Cuối cùng, hãy tính cả thời gian. Nếu tổng tiết kiệm sau mã nhỏ hơn thời gian bạn phải bỏ ra để chờ và thử mã, mua ngay không mã là lựa chọn hợp lý. Voucher tốt nhất là voucher áp được vào giỏ hàng đúng nhu cầu.",
      ],
      bullets: [
        "Viết danh sách và mức giá trước khi sale.",
        "Ghi giá tham chiếu để phân biệt giảm thật.",
        "So tổng tiết kiệm với thời gian chờ mã.",
        "Voucher áp trên giỏ đúng nhu cầu, không phải để mua thêm.",
        "Mua không mã cũng hợp lý khi tiết kiệm nhỏ.",
      ],
    },
    {
      title: "Lưu ý bảo mật khi dùng mã",
      paragraphs: [
        "Mã giảm giá không bao giờ yêu cầu mật khẩu, mã OTP hoặc thông tin thẻ ngoài trang thanh toán của sàn. Nếu link nhận mã có địa chỉ lạ hoặc yêu cầu đăng nhập lại, hãy đóng trang và tự vào ứng dụng sàn để tra mã.",
        "Không chia sẻ mã gắn với tài khoản cho người khác để dùng chung. Việc dùng tài khoản không phải của mình có thể vi phạm điều khoản của sàn và khiến đơn bị hủy. Mã công khai trên trang khuyến mãi thì không bị giới hạn này, nhưng vẫn nên đọc điều kiện.",
        "Sansale247 tổng hợp thông tin khuyến mãi công khai hoặc từ đối tác, không bán hàng và không xử lý giao dịch. Khi mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhỏ nhưng giá bạn trả không đổi. Điều kiện cuối cùng do sàn quyết định.",
      ],
      bullets: [
        "Mã không cần mật khẩu hoặc OTP.",
        "Thanh toán trong sàn hoặc cổng chính thức.",
        "Không dùng mã cá nhân trên tài khoản người khác.",
        "Điều kiện thực thi mã do sàn quyết định.",
        "Đọc tiết lộ affiliate nếu bạn muốn biết cách website vận hành.",
      ],
    },
  ],
  beauty: [
    {
      title: "Kiểm tra gì trước khi mua mỹ phẩm?",
      paragraphs: [
        "Mỹ phẩm tiếp xúc trực tiếp với da, nên cần kiểm tra kỹ hơn nhiều mặt hàng khác. Ba thông tin quan trọng nhất là thành phần, hạn dùng và nguồn cung. Nếu trang sản phẩm không ghi rõ, hãy hỏi người bán trước khi đặt món có giá trị cao.",
        "Da mỗi người phản ứng khác nhau với cùng một công thức. Đánh giá của người khác có thể hữu ích để tham khảo, nhưng không thay thế việc thử trên da bạn. Với sản phẩm chứa hoạt chất mạnh như AHA/BHA, retinoid hoặc vitamin C nồng độ cao, nên dùng thử lượng nhỏ và tham khảo bác sĩ da liễu nếu đang điều trị.",
        "Nếu bạn tìm bằng tiếng Anh với cụm \"beauty deals\" hoặc \"skincare sale\", cách đánh giá vẫn như vậy: ưu tiên nhà bán rõ nguồn gốc, hạn dùng còn dài và đánh giá có cả bình luận trung bình hoặc tiêu cực. Trang này tổng hợp deal đang ghi nhận và dẫn về sàn để bạn kiểm tra lần cuối.",
      ],
      bullets: [
        "Kiểm tra thành phần, hạn dùng và nguồn cung.",
        "Da mỗi người khác nhau; review không thay thế dùng thử.",
        "Hoạt chất mạnh nên thử từ nồng độ thấp.",
        "Tham khảo bác sĩ da liễu khi đang điều trị.",
        "Đọc cả bình luận tiêu cực, không chỉ đánh giá 5 sao.",
      ],
    },
    {
      title: "Đọc nhãn: thành phần và hạn dùng",
      paragraphs: [
        "Danh sách thành phần thường theo chuẩn INCI, sắp theo thứ tự lượng giảm dần. Nhóm đầu thường là nền sản phẩm, nhóm sau mới đến hoạt chất. Nếu bạn đang tránh một thành phần cụ thể, hãy đọc toàn bộ nhãn thay vì chỉ xem phần mô tả nổi bật.",
        "Hạn dùng có hai dạng: ngày hết hạn cố định (EXP hoặc best before) và hạn sau khi mở nắp (ký hiệu PAO). Sản phẩm ít dùng như kem chống nắng hoặc nước hoa nên được kiểm tra cả hai, vì bao bì còn hạn nhưng đã mở quá lâu vẫn có thể biến chất.",
        "Màu, mùi và cảm giác khi thoa là cách kiểm tra nhanh tại nhà. Nếu sản phẩm đổi màu rõ, tách lớp hoặc có mùi lạ so với lần trước, hãy ngừng dùng và liên hệ nơi mua. Điều này không thay thế tư vấn chuyên môn nhưng giúp bạn tránh dùng sản phẩm đã hỏng.",
      ],
      bullets: [
        "Thành phần sắp theo lượng giảm dần.",
        "EXP/best before là hạn tuyệt đối.",
        "PAO là hạn sau khi mở nắp.",
        "Sản phẩm ít dùng cần xem cả hai loại hạn.",
        "Đổi màu, tách lớp hoặc mùi lạ thì nên dừng dùng.",
      ],
    },
    {
      title: "Chọn nhà bán và hàng chính hãng",
      paragraphs: [
        "Hàng chính hãng thường đến từ gian hàng chính thức của thương hiệu, nhà phân phối có giấy tờ hoặc sàn lớn có quy trình kiểm soát rõ. Giá thấp bất thường có thể đi kèm hàng gần hạn, bản mini hoặc hàng không phân phối chính thức. Đừng chỉ dựa vào giá để quyết định.",
        "Khi nhận hàng, hãy kiểm tra tem chống giả, mã vạch, đường in và tình trạng seal. Nhiều thương hiệu có công cụ kiểm tra mã lô trên trang chính thức. Nếu nghi ngờ, hãy liên hệ sàn hoặc người bán trước khi mở sản phẩm.",
        "Với mỹ phẩm giá trị cao, nên bắt đầu bằng size nhỏ nếu có. Nếu chưa từng dùng, một món giảm sâu vẫn có thể thành chi phí bỏ đi nếu da không phù hợp. Lịch sử phản hồi và bình luận gần đây của shop là thông tin hữu ích trước khi mua.",
      ],
      bullets: [
        "Ưu tiên gian hàng chính thức hoặc đại lý ủy quyền.",
        "Giá quá thấp có thể là hàng gần hạn hoặc size mini.",
        "Kiểm tra tem, mã lô và seal khi nhận.",
        "Bắt đầu bằng size nhỏ với sản phẩm chưa từng dùng.",
        "Chọn shop có phản hồi rõ ràng.",
      ],
    },
    {
      title: "Đặc thù từng nhóm sản phẩm",
      paragraphs: [
        "Son và nước hoa chịu ảnh hưởng nhiều từ cơ địa. Màu son trên ảnh có thể khác màu trên môi; mùi nước hoa có thể khác nhau tùy nhiệt độ và thời gian lưu hương. Nếu chưa từng dùng, size nhỏ là cách thử hợp lý trước khi mua chai lớn.",
        "Kem chống nắng nên được chọn theo chỉ số SPF/PA ghi trên nhãn và nhu cầu sử dụng, không theo cảm giác giá. Serum và kem dưỡng cần đọc cả hướng bảo quản vì một số hoạt chất dễ mất tác dụng khi gặp nắng hoặc nhiệt độ cao.",
        "Các sản phẩm mini hoặc travel size có thể là lựa chọn tiết kiệm để thử thương hiệu. Tuy nhiên, mua nhiều chai nhỏ cùng lúc có thể tốn hơn một chai dung tích chuẩn nếu bạn không dùng hết trước hạn.",
      ],
      bullets: [
        "Son và nước hoa nên thử size nhỏ trước.",
        "Kem chống nắng chọn theo SPF/PA trên nhãn.",
        "Serum cần đọc hướng bảo quản.",
        "Mini size hợp lý để thử thương hiệu.",
        "Tính tổng chi phí trước khi mua nhiều chai nhỏ.",
      ],
    },
    {
      title: "Đổi trả và bảo quản sau khi mua",
      paragraphs: [
        "Mỹ phẩm thường khó đổi trả khi đã mở seal vì lý do vệ sinh. Hãy kiểm tra hàng trước khi bấm xác nhận: đúng tên, đúng dung tích, còn seal và mã lô rõ ràng. Nếu hàng không đúng mô tả, đừng mở sản phẩm và quay video mở gói để làm bằng chứng.",
        "Sau khi mở, bảo quản nơi khô mát, tránh ánh nắng trực tiếp và hơi ẩm từ phòng tắm nếu công thức không yêu cầu khác. Dụng cụ lấy sản phẩm nên được vệ sinh hoặc dùng riêng để hạn chế vi khuẩn.",
        "Sansale247 không bán hàng, không tư vấn công thức và không xử lý đổi trả. Mọi giao dịch và chính sách do sàn hoặc người bán quyết định. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Kiểm tra hàng trước khi xác nhận, không mở nếu nghi ngờ.",
        "Quay video mở gói để làm bằng chứng khi cần.",
        "Bảo quản khô mát, tránh nắng và ẩm.",
        "Vệ sinh dụng cụ lấy sản phẩm.",
        "Liên hệ sàn trực tiếp khi cần hỗ trợ sau mua.",
      ],
    },
  ],
  fashion: [
    {
      title: "Bảng size và cách đo tại nhà",
      paragraphs: [
        "Size S, M, L không giống nhau giữa các shop và thương hiệu. Mỗi nhà bán có bảng size riêng theo số đo ngực, eo, hông và chiều dài. Trước khi đặt, hãy đo một món quần áo bạn đang mặc vừa rồi so với bảng size của sản phẩm.",
        "Ảnh sản phẩm thường được chụp trong điều kiện ánh sáng đẹp, nên màu và chất liệu có thể khác thực tế. Bình luận kèm ảnh của người mua giúp bạn thấy dáng và màu gần đúng hơn. Với đồ dáng rộng, hãy xem chiều dài và độ rộng ngực thay vì chỉ chọn size nhỏ hơn.",
        "Nếu bạn tìm bằng tiếng Anh với cụm \"clothing sale\" hoặc \"fashion deals\", cách mua vẫn như vậy: đo trước, đối chiếu bảng size và đọc chính sách đổi trả. Trang này tổng hợp deal đang ghi nhận và dẫn về sàn để bạn kiểm tra.",
      ],
      bullets: [
        "Đo món đồ đang mặc vừa để so bảng size.",
        "Size không đồng nghĩa giữa các shop.",
        "Xem ảnh và bình luận thực tế của người mua.",
        "Đồ dáng rộng cần xem chiều dài và độ rộng.",
        "Đọc chính sách đổi trả trước khi đặt.",
      ],
    },
    {
      title: "Chất liệu và cách nhận biết",
      paragraphs: [
        "Thành phần vải ảnh hưởng đến cảm giác mặc và cách bảo quản. Cotton thấm hút tốt nhưng dễ nhăn; polyester nhanh khô, giữ màu tốt nhưng ít thoáng hơn; linen nhẹ và mát nhưng dễ nhăn. Sản phẩm ghi \"cotton pha\" thường có thêm polyester, nên đọc tỷ lệ cụ thể.",
        "Độ co giãn của vải quyết định bạn nên chọn size sát hay rộng. Vải có spandex co giãn tốt hơn vải dệt thường, nhưng form có thể thay đổi sau nhiều lần giặt. Hãy đọc mô tả và bình luận gần đây để biết sản phẩm có co rút hay không.",
        "Màu trên màn hình có thể khác màu thực tế. Nếu món đồ cần phối với trang phục có sẵn, hãy so trực tiếp với món đó thay vì chỉ so với ảnh của người bán.",
      ],
      bullets: [
        "Cotton thấm nhưng dễ nhăn; polyester nhanh khô.",
        "Đọc tỷ lệ thành phần thay vì chỉ đọc tên vải.",
        "Độ co giãn ảnh hưởng cách chọn size.",
        "Màu thực tế có thể khác ảnh.",
        "So màu với đồ bạn định phối.",
      ],
    },
    {
      title: "Kiểm tra hàng và đổi trả",
      paragraphs: [
        "Khi nhận quần áo, hãy kiểm tra tag size, màu, đường may và các lỗi vải ở vị trí dễ thấy. Đừng cắt tag trước khi thử, vì nhiều chính sách đổi trả yêu cầu tag còn nguyên. Nếu sản phẩm có mùi lạ hoặc dấu hiệu đã qua sử dụng, hãy chụp ảnh và liên hệ ngay.",
        "Đồ lót, đồ bơi và một số trang phục vệ sinh thường không được đổi trả sau khi mở seal. Với những món này, hãy đo và chọn size kỹ trước khi đặt. Đọc thời hạn đổi trả của shop, không chỉ chính sách chung của sàn.",
        "Khi cần đổi size, hãy phản hồi sớm trong thời hạn quy định và giữ bao bì. Phí đổi trả thường do khách chịu theo chính sách; với đơn giá trị nhỏ, phí đổi có thể cao hơn khoản tiết kiệm ban đầu.",
      ],
      bullets: [
        "Kiểm tra tag, màu và đường may khi nhận.",
        "Giữ tag đến khi chắc chắn giữ món.",
        "Đồ lót, đồ bơi thường không đổi vì lý do vệ sinh.",
        "Phản hồi đổi trả sớm trong thời hạn.",
        "Tính phí đổi trước khi quyết định.",
      ],
    },
    {
      title: "Giày dép và phụ kiện",
      paragraphs: [
        "Giày nên được chọn theo chiều dài bàn chân hoặc chiều dài đế trong, không chỉ theo số size. Mỗi thương hiệu có bảng quy đổi khác nhau, đặc biệt với giày nhập khẩu. Nếu đã có một đôi vừa, hãy đo đế trong của đôi đó để so sánh.",
        "Giày thể thao có nhiều dòng với tính năng khác nhau: nhẹ, êm, hỗ trợ chạy hoặc chỉ dùng hàng ngày. Giày thời trang thường ưu tiên hình thức hơn tính năng. Hãy đọc mô tả để chọn đúng mục đích sử dụng.",
        "Phụ kiện như dây giày, túi, thắt lưng cần kiểm tra kích thước và chất liệu. Với phụ kiện dùng chung cho nhiều món, hãy tính số lượng cần thiết để tránh mua thừa.",
      ],
      bullets: [
        "Chọn giày theo chiều dài bàn chân hoặc đế trong.",
        "Số size khác nhau giữa các thương hiệu.",
        "Chọn dòng giày theo mục đích sử dụng.",
        "Kiểm tra kích thước phụ kiện trước khi mua.",
        "Đọc đánh giá về độ vừa chân.",
      ],
    },
    {
      title: "Bảo quản để dùng bền",
      paragraphs: [
        "Nhãn giặt ghi nhiệt độ, chế độ giặt và hạn chế sấy. Các món ghi \"hand wash only\" thường không chịu được máy giặt, nhất là vải mỏng, đồ có kim tuyến hoặc chi tiết thủ công. Đọc nhãn trước khi giặt chung với đồ khác.",
        "Quần áo sáng màu dễ phai khi phơi nắng trực tiếp; đồ len nên phơi ngang để giữ dáng. Dùng túi lưới cho đồ mỏng và khóa kín để tránh vướng vào khóa kéo của món khác.",
        "Sansale247 không bán hàng, không xử lý đổi trả và không tư vấn bảo quản cho từng sản phẩm. Mọi giao dịch và chính sách do sàn hoặc người bán quyết định. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Đọc nhãn giặt trước khi giặt máy.",
        "Đồ hand wash không nên giặt máy thường.",
        "Phơi đồ sáng màu tránh nắng trực tiếp.",
        "Đồ len nên phơi ngang.",
        "Dùng túi lưới cho đồ mỏng, kim tuyến.",
      ],
    },
  ],
  electronics: [
    {
      title: "Đọc thông số và phiên bản sản phẩm",
      paragraphs: [
        "Trước khi mua điện tử, hãy đối chiếu model, cấu hình và phiên bản. Hai sản phẩm trông giống nhau có thể khác dung lượng bộ nhớ, số khe SIM, công suất hoặc năm sản xuất. Mã model trên ảnh và trong mô tả cần khớp nhau; nếu chỉ ghi tên chung chung, hãy hỏi người bán.",
        "Một số sản phẩm là bản nhập khẩu không có bảo hành chính hãng tại Việt Nam, hoặc bản nội địa dùng ngôn ngữ và băng tần khác. Những khác biệt này không phải lúc nào cũng xấu, nhưng bạn cần biết trước để quyết định. Đừng so sánh giá của hai bản khác nhau rồi kết luận bên nào rẻ hơn.",
        "Nếu tìm bằng tiếng Anh với cụm \"electronics deals\" hoặc \"tech sale\", hãy kiểm tra lại model và thông số trên trang sản phẩm. Trang này tổng hợp deal đang ghi nhận, không bán hàng và không bảo đảm cấu hình thay cho nhà sản xuất.",
      ],
      bullets: [
        "Đối chiếu model, cấu hình, dung lượng và phiên bản.",
        "Kiểm tra bản chính hãng và bản nhập khẩu.",
        "Xem năm sản xuất và tình trạng hàng.",
        "Không so giá giữa hai phiên bản khác nhau.",
        "Hỏi người bán nếu mô tả thiếu thông số.",
      ],
    },
    {
      title: "Bảo hành: ai chịu trách nhiệm?",
      paragraphs: [
        "Bảo hành có thể do nhà sản xuất, nhà bán hoặc sàn đứng ra xử lý. Trước khi mua, hãy xem thời hạn, phạm vi và nơi tiếp nhận bảo hành. Sản phẩm chính hãng thường có trung tâm bảo hành của hãng; hàng nhập khẩu có thể chỉ được shop bảo hành.",
        "Hóa đơn và tem serial là căn cứ quan trọng khi cần bảo hành. Hãy lưu lại xác nhận đơn hàng, ảnh tem và phiếu bảo hành nếu có. Với hàng giá trị lớn, nên kiểm tra serial trên trang của hãng sau khi nhận.",
        "Một số chương trình bảo hành mở rộng chỉ áp dụng khi mua đúng kênh phân phối. Nếu giá rẻ hơn đáng kể nhưng không rõ nguồn gốc, hãy cân nhắc rủi ro mất quyền bảo hành chính hãng.",
      ],
      bullets: [
        "Xác định bảo hành do hãng, shop hay sàn xử lý.",
        "Lưu hóa đơn, xác nhận đơn và ảnh tem serial.",
        "Kiểm tra serial trên trang của hãng khi nhận.",
        "Hàng nhập khẩu có thể chỉ được shop bảo hành.",
        "Cân nhắc rủi ro khi giá rẻ bất thường.",
      ],
    },
    {
      title: "Hàng trưng bày, refurb và like-new",
      paragraphs: [
        "Các nhãn như trưng bày, refurbished hoặc like-new không đồng nghĩa với hàng mới. Tình trạng có thể từ trầy nhẹ đến đã thay linh kiện. Hãy đọc mô tả chi tiết và hỏi người bán về pin, màn hình, phụ kiện và bảo hành.",
        "Với điện thoại hoặc laptop, tình trạng pin và màn hình ảnh hưởng lớn đến giá trị sử dụng. Nếu người bán chỉ ghi \"99%\", hãy hỏi cách kiểm tra và có hỗ trợ đổi trả nếu sai mô tả không. Ảnh thực tế của máy là thông tin quan trọng hơn ảnh minh họa.",
        "Mức giá thấp có thể hợp lý nếu bạn chấp nhận rủi ro và không cần bảo hành dài. Tuy nhiên, với thiết bị dùng hàng ngày, chênh lệch vài trăm nghìn có thể không đáng để đổi lấy sự bất tiện khi sửa chữa.",
      ],
      bullets: [
        "Đọc rõ tình trạng: trưng bày, refurb hay like-new.",
        "Hỏi về pin, màn hình, linh kiện và phụ kiện.",
        "Yêu cầu ảnh thực tế của máy.",
        "Kiểm tra chính sách đổi trả nếu sai mô tả.",
        "Cân nhắc chi phí sửa chữa về sau.",
      ],
    },
    {
      title: "Phụ kiện và khả năng tương thích",
      paragraphs: [
        "Không phải sản phẩm nào cũng đi kèm sạc, cáp hoặc tai nghe. Hãy đọc phần \"trong hộp\" để biết bạn cần mua thêm gì. Với thiết bị nhập khẩu, phích cắm và điện áp có thể khác, cần bộ chuyển đổi phù hợp.",
        "Sạc và cáp giá rẻ không rõ nguồn gốc có thể ảnh hưởng đến tuổi thọ pin hoặc gây nguy hiểm. Nên chọn phụ kiện có chứng nhận và công suất phù hợp với thiết bị. Công suất sạc cao hơn không nhất thiết làm hỏng máy, nhưng cần đúng chuẩn.",
        "Với phụ kiện như ốp lưng, giá đỡ hoặc bàn phím, hãy kiểm tra kích thước và model tương thích. Một món phụ kiện rẻ nhưng không vừa sẽ thành chi phí bỏ đi.",
      ],
      bullets: [
        "Đọc kỹ phần trong hộp.",
        "Kiểm tra điện áp và phích cắm với hàng nhập khẩu.",
        "Chọn sạc, cáp có chứng nhận và đúng công suất.",
        "Kiểm tra model tương thích của phụ kiện.",
        "Đừng mua phụ kiện chỉ vì giá rẻ.",
      ],
    },
    {
      title: "Kiểm tra khi nhận hàng",
      paragraphs: [
        "Khi nhận thiết bị, hãy quay video mở gói và kiểm tra ngoại quan trước khi bật máy. Đối chiếu serial, màu, dung lượng và phụ kiện với đơn hàng. Nếu có dấu hiệu móp, trầy hoặc thiếu phụ kiện, hãy báo ngay trong thời hạn đổi trả.",
        "Với điện thoại, laptop hoặc đồ điện, nên bật thử và kiểm tra các chức năng cơ bản trong thời gian cho phép đổi trả. Lưu lại ảnh chụp màn hình thông tin thiết bị và serial để đối chiếu nếu cần hỗ trợ.",
        "Sansale247 không bán hàng, không bảo hành và không xử lý đổi trả. Mọi giao dịch và chính sách do sàn hoặc người bán quyết định. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Quay video mở gói và kiểm tra ngoại quan.",
        "Đối chiếu serial, màu, dung lượng và phụ kiện.",
        "Bật thử các chức năng trong thời hạn đổi trả.",
        "Lưu ảnh thông tin thiết bị và serial.",
        "Liên hệ sàn hoặc người bán khi có vấn đề.",
      ],
    },
  ],
  book: [
    {
      title: "Chọn đúng phiên bản và nhà xuất bản",
      paragraphs: [
        "Với sách, cùng một tựa đề có thể có nhiều phiên bản: bản gốc, bản dịch, tái bản có bổ sung hoặc bản bìa mềm/bìa cứng. Giá khác nhau nhưng nội dung và chất lượng giấy có thể không giống nhau. Hãy kiểm tra nhà xuất bản, năm in và người dịch trước khi mua.",
        "Sách giáo trình và sách chuyên môn càng cần đúng phiên bản vì bài tập hoặc nội dung có thể thay đổi giữa các lần tái bản. Nếu mua cho khóa học, hãy đối chiếu mã sách hoặc ISBN với yêu cầu của giảng viên.",
        "Nếu tìm bằng tiếng Anh với cụm \"book sale\" hoặc \"online bookstore\", hãy kiểm tra lại ISBN và phiên bản trên trang sản phẩm. Trang này tổng hợp deal đang ghi nhận và dẫn về sàn để bạn kiểm tra lần cuối.",
      ],
      bullets: [
        "Kiểm tra nhà xuất bản, năm in và người dịch.",
        "Sách giáo trình cần đúng phiên bản hoặc ISBN.",
        "Phân biệt bìa mềm, bìa cứng và bản tái bản.",
        "Đọc kỹ mô tả trước khi so giá.",
        "Hỏi người bán nếu thiếu thông tin phiên bản.",
      ],
    },
    {
      title: "Sách mới và sách cũ",
      paragraphs: [
        "Sách cũ có thể là lựa chọn tiết kiệm nếu tình trạng còn tốt. Tuy nhiên, mô tả \"còn tốt\" có thể bao gồm ghi chú, gạch chân hoặc thiếu phụ lục. Hãy hỏi người bán về tình trạng bìa, gáy, trang và các phụ kiện đi kèm.",
        "Sách mới giá rẻ bất thường có thể là bản in lậu hoặc hàng tồn kho lâu năm. Chất lượng giấy và keo gáy ảnh hưởng đến việc sử dụng lâu dài. Nếu mua để học hoặc làm quà, nên ưu tiên bản in rõ ràng và có nguồn gốc.",
        "Với sách có kèm đĩa, bản đồ hoặc phụ lục, hãy xác nhận còn đủ bộ. Một cuốn sách thiếu phụ kiện có thể rẻ hơn nhưng không dùng được cho mục đích ban đầu.",
      ],
      bullets: [
        "Hỏi rõ tình trạng bìa, gáy và trang sách cũ.",
        "Kiểm tra ghi chú, gạch chân và phụ lục.",
        "Cảnh giác với sách in lậu giá quá rẻ.",
        "Xác nhận đủ bộ nếu có đĩa hoặc phụ kiện.",
        "Ưu tiên bản in rõ nếu mua làm quà.",
      ],
    },
    {
      title: "Giá sách, combo và chi phí thực",
      paragraphs: [
        "Giá niêm yết chưa phản ánh toàn bộ chi phí. Hãy cộng phí vận chuyển và so giá theo từng cuốn thay vì chỉ nhìn giá combo. Một combo rẻ hơn có thể chỉ có lợi nếu bạn đọc hết tất cả các cuốn.",
        "Sách mỏng thường có phí ship chiếm tỷ trọng lớn trong tổng giá. Nếu mua nhiều cuốn cùng một shop, gom đơn có thể tiết kiệm hơn. Tuy nhiên, đừng thêm sách không cần chỉ để đạt mức miễn phí vận chuyển.",
        "Giá sách thay đổi theo chương trình và tồn kho. Ghi lại mức giá bạn thấy hợp lý trước khi chờ sale; nếu giá hiện tại sát mức đó và bạn cần dùng, không nhất thiết phải chờ.",
      ],
      bullets: [
        "So giá theo từng cuốn, không chỉ theo combo.",
        "Cộng phí ship vào tổng chi phí.",
        "Gom đơn sách cùng shop để tiết kiệm ship.",
        "Không mua thêm sách chỉ để đạt freeship.",
        "Ghi giá tham chiếu trước khi chờ sale.",
      ],
    },
    {
      title: "Đóng gói và vận chuyển sách",
      paragraphs: [
        "Sách dễ bị cong góc, ẩm hoặc rách bìa trong quá trình vận chuyển. Khi nhận, hãy kiểm tra bìa và gáy trước khi bấm xác nhận. Nếu sách bị hư do đóng gói kém, hãy chụp ảnh và liên hệ ngay.",
        "Với sách giá trị cao hoặc bộ nhiều cuốn, nên chọn shop có đóng gói cẩn thận và đọc đánh giá về khâu giao hàng. Mùa mưa hoặc giao đường dài có thể làm bìa ẩm nếu gói không kín.",
        "Sau khi nhận, bảo quản sách nơi khô ráo, tránh ánh nắng trực tiếp. Sách bị ẩm có thể được hong khô nhẹ, nhưng đừng ép trang khi còn ướt vì dễ rách.",
      ],
      bullets: [
        "Kiểm tra bìa, gáy và góc sách khi nhận.",
        "Chụp ảnh nếu sách hư do vận chuyển.",
        "Chọn shop đóng gói kỹ với bộ sách giá trị cao.",
        "Bảo quản sách nơi khô ráo, tránh nắng.",
        "Không ép trang sách khi còn ẩm.",
      ],
    },
    {
      title: "Sách giấy và sách điện tử",
      paragraphs: [
        "Sách giấy phù hợp để ghi chú, tra cứu và làm quà; sách điện tử thuận tiện khi đọc trên điện thoại hoặc máy đọc sách. Mỗi định dạng có hạn chế riêng về thiết bị, độ sáng màn hình và khả năng chia sẻ.",
        "Sách điện tử thường gắn với tài khoản hoặc ứng dụng của nơi bán. Trước khi mua, hãy kiểm tra định dạng, khả năng đọc offline và quyền sử dụng. Không phải file nào cũng chuyển được sang thiết bị khác.",
        "Với sách học hoặc sách cần tra cứu nhanh, nhiều người vẫn thấy bản giấy dễ đánh dấu hơn. Nếu bạn mua cả hai, hãy cân nhắc mục đích sử dụng thay vì mua trùng chỉ vì giá đang giảm.",
      ],
      bullets: [
        "Sách giấy phù hợp ghi chú và làm quà.",
        "Sách điện tử cần đúng ứng dụng và thiết bị.",
        "Kiểm tra định dạng và quyền sử dụng trước khi mua.",
        "Không phải file nào cũng đọc offline được.",
        "Tránh mua trùng nếu không có nhu cầu.",
      ],
    },
  ],
  food: [
    {
      title: "Hạn dùng và hạn bảo quản",
      paragraphs: [
        "Hạn dùng (EXP) là mốc an toàn cuối cùng theo nhà sản xuất; best before là mốc chất lượng tốt nhất, không nhất thiết là hạn hỏng ngay. Cả hai đều phụ thuộc vào việc bảo quản đúng nhiệt độ và bao bì còn kín.",
        "Sau khi mở bao bì, hạn sử dụng thường ngắn hơn nhiều so với hạn in trên gói. Các sản phẩm như nước chấm, sữa chua hoặc đồ ăn vặt cần được bảo quản theo hướng dẫn và dùng trong thời gian hợp lý. Đừng chỉ nhìn hạn trên bao bì mà bỏ qua điều kiện bảo quản.",
        "Nếu tìm bằng tiếng Anh với cụm \"food deals\" hoặc \"grocery sale\", hãy kiểm tra lại hạn dùng và khối lượng trên trang sản phẩm. Trang này tổng hợp deal đang ghi nhận và dẫn về sàn để bạn kiểm tra.",
      ],
      bullets: [
        "Phân biệt EXP và best before.",
        "Hạn sau khi mở thường ngắn hơn hạn trên gói.",
        "Bảo quản đúng nhiệt độ và bao bì.",
        "Kiểm tra hạn dùng trước khi mua số lượng lớn.",
        "Đọc kỹ mô tả và khối lượng sản phẩm.",
      ],
    },
    {
      title: "Chọn shop thực phẩm phù hợp",
      paragraphs: [
        "Thực phẩm là nhóm cần cẩn trọng về nguồn gốc. Hãy chọn shop có thông tin rõ ràng, phản hồi tốt và đánh giá thực tế về chất lượng. Với hàng tươi sống hoặc dễ hỏng, nên ưu tiên shop có kinh nghiệm đóng gói và giao nhanh.",
        "Sản phẩm giá rẻ bất thường có thể là hàng gần hạn, hàng khuyến mãi số lượng lớn hoặc không rõ nguồn gốc. Hãy đọc kỹ mô tả và hỏi người bán nếu thông tin còn mơ hồ. Đừng mua số lượng lớn chỉ vì giá thấp nếu bạn không dùng kịp.",
        "Với thực phẩm chức năng hoặc đồ ăn kiêng, hãy kiểm tra thành phần và khuyến cáo sử dụng. Trang này không tư vấn y tế và không bán hàng; mọi quyết định mua thuộc về bạn.",
      ],
      bullets: [
        "Chọn shop có nguồn gốc và đánh giá rõ ràng.",
        "Ưu tiên shop giao nhanh với hàng dễ hỏng.",
        "Cảnh giác với giá quá thấp bất thường.",
        "Đọc thành phần và hướng dẫn sử dụng.",
        "Không mua số lượng lớn nếu không dùng kịp.",
      ],
    },
    {
      title: "Vận chuyển hàng dễ hỏng",
      paragraphs: [
        "Sữa, bánh kem, thực phẩm đông lạnh hoặc đồ tươi cần được giữ lạnh trong quá trình giao. Nếu shop không có giải pháp đóng gói phù hợp, sản phẩm có thể hỏng trước khi đến. Hãy hỏi trước về cách bảo quản và thời gian giao dự kiến.",
        "Chọn khung giờ giao phù hợp với thời gian bạn có mặt để nhận hàng. Hàng để ngoài quá lâu có thể mất chất lượng, đặc biệt trong thời tiết nóng. Nếu nhận hàng bị ấm hoặc bao bì phồng, hãy kiểm tra kỹ trước khi dùng.",
        "Với đơn hàng dễ hỏng, hãy chụp ảnh tình trạng khi nhận và báo ngay nếu sản phẩm không đạt. Giữ lại bao bì để làm bằng chứng khi cần hỗ trợ.",
      ],
      bullets: [
        "Hỏi cách giữ lạnh với hàng tươi hoặc đông lạnh.",
        "Chọn khung giờ có người nhận.",
        "Kiểm tra bao bì và nhiệt độ khi nhận.",
        "Chụp ảnh nếu sản phẩm không đạt.",
        "Giữ bao bì để làm bằng chứng.",
      ],
    },
    {
      title: "Đọc khối lượng và số lượng",
      paragraphs: [
        "Khối lượng trên bao bì có thể là khối lượng tịnh của phần ăn được hoặc khối lượng cả hộp. Với thực phẩm sấy hoặc đông lạnh, trọng lượng có thể thay đổi sau khi rã đông. Hãy đọc kỹ đơn vị và so theo giá trên mỗi kg hoặc mỗi phần.",
        "Combo nhiều gói có thể rẻ hơn theo đơn vị nhưng chỉ có lợi nếu bạn dùng hết trước hạn. Kiểm tra số lượng thực tế trong mô tả, không chỉ nhìn ảnh minh họa. Một số sản phẩm ghi \"hộp 10 gói\" nhưng mỗi gói nhỏ hơn loại bán lẻ.",
        "Với đồ ăn vặt hoặc nguyên liệu nấu ăn, hãy tính số lần sử dụng thực tế. Mua số lượng lớn có thể tiết kiệm chi phí mỗi phần nhưng dễ lãng phí nếu khẩu vị thay đổi.",
      ],
      bullets: [
        "Phân biệt khối lượng tịnh và khối lượng cả hộp.",
        "So giá theo kg hoặc theo phần sử dụng.",
        "Kiểm tra số lượng thực tế trong combo.",
        "Chỉ mua combo khi dùng hết trước hạn.",
        "Tính số lần sử dụng trước khi mua số lượng lớn.",
      ],
    },
    {
      title: "Đổi trả và an toàn thực phẩm",
      paragraphs: [
        "Thực phẩm thường không được đổi trả vì lý do khẩu vị hoặc đã mở bao bì. Tuy nhiên, nếu sản phẩm hết hạn, sai loại, hư hỏng hoặc bao bì bị rách, bạn có quyền yêu cầu hỗ trợ theo chính sách của sàn.",
        "Không nên dùng sản phẩm có mùi lạ, màu bất thường hoặc bao bì phồng. Nếu bạn nghi ngờ chất lượng, hãy ngừng sử dụng và liên hệ nơi mua. Với sản phẩm ảnh hưởng đến sức khỏe, nên tham khảo ý kiến chuyên môn.",
        "Sansale247 không bán hàng, không xử lý đổi trả và không tư vấn dinh dưỡng. Mọi giao dịch và chính sách do sàn hoặc người bán quyết định. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Kiểm tra hạn, loại hàng và bao bì khi nhận.",
        "Không dùng sản phẩm có mùi hoặc màu bất thường.",
        "Liên hệ sàn khi hàng hư, sai hoặc hết hạn.",
        "Giữ bao bì và ảnh chụp để làm bằng chứng.",
        "Tham khảo chuyên môn nếu liên quan sức khỏe.",
      ],
    },
  ],
  home: [
    {
      title: "Đo kích thước trước khi mua đồ gia dụng",
      paragraphs: [
        "Đồ gia dụng và nội thất thường cồng kềnh, nên sai kích thước là lỗi tốn kém nhất. Hãy đo chiều rộng, chiều sâu và chiều cao của vị trí dự kiến đặt, sau đó cộng thêm khoảng trống để mở cửa hoặc thao tác. Đừng chỉ dựa vào ảnh sản phẩm.",
        "Kiểm tra cả đường đi vào nhà: cửa chính, hành lang, cầu thang và thang máy. Một chiếc tủ có thể vừa chỗ đặt nhưng không qua được cửa. Với chung cư, hãy xác nhận quy định về giờ vận chuyển và kích thước thang máy.",
        "Nếu tìm bằng tiếng Anh với cụm \"home deals\" hoặc \"furniture sale\", hãy đọc bảng kích thước và đơn vị đo trên trang sản phẩm. Trang này tổng hợp deal đang ghi nhận và dẫn về sàn để bạn kiểm tra.",
      ],
      bullets: [
        "Đo chỗ đặt, cộng khoảng trống thao tác.",
        "Kiểm tra cửa, hành lang, cầu thang và thang máy.",
        "Xác nhận quy định vận chuyển của chung cư.",
        "Đọc bảng kích thước và đơn vị đo.",
        "Đừng chỉ dựa vào ảnh minh họa.",
      ],
    },
    {
      title: "Điện áp, công suất và an toàn",
      paragraphs: [
        "Thiết bị điện gia dụng cần đúng điện áp và phích cắm. Hàng nhập khẩu có thể dùng 110V hoặc phích khác, cần bộ chuyển đổi phù hợp. Dùng sai điện áp có thể làm hỏng thiết bị hoặc gây nguy hiểm.",
        "Công suất của thiết bị ảnh hưởng đến dây điện và ổ cắm. Các thiết bị công suất lớn như bếp điện, máy sấy hoặc điều hòa nên dùng dây và ổ riêng theo hướng dẫn. Không cắm nhiều thiết bị công suất cao vào cùng một ổ.",
        "Nếu bạn thuê nhà hoặc ở chung cư, hãy kiểm tra quy định về cải tạo và lắp đặt. Việc khoan tường hoặc thay đường điện có thể cần sự đồng ý của chủ nhà hoặc ban quản lý.",
      ],
      bullets: [
        "Kiểm tra điện áp và loại phích cắm.",
        "Dùng bộ chuyển đổi phù hợp với hàng nhập khẩu.",
        "Thiết bị công suất lớn nên có dây và ổ riêng.",
        "Không cắm nhiều thiết bị công suất cao cùng ổ.",
        "Kiểm tra quy định cải tạo nếu thuê nhà.",
      ],
    },
    {
      title: "Lắp đặt và phụ kiện đi kèm",
      paragraphs: [
        "Một số sản phẩm cần lắp đặt, một số chỉ cần tháo hộp. Hãy đọc mô tả để biết đã bao gồm phụ kiện và dụng cụ chưa. Nếu cần thợ, hãy hỏi trước về chi phí và thời gian; chi phí này có thể làm thay đổi bài toán tiết kiệm.",
        "Với nội thất, kiểm tra ốc, bản lề và hướng dẫn lắp. Thiếu một phụ kiện nhỏ có thể khiến bạn phải mua thêm hoặc chờ gửi bổ sung. Chụp ảnh phụ kiện khi mở hộp để dễ đối chiếu.",
        "Nếu bạn không tự lắp được, nên chọn đơn vị có hỗ trợ lắp đặt hoặc đặt lịch với thợ địa phương. Đừng tự khoan tường hoặc đấu điện nếu không có kinh nghiệm.",
      ],
      bullets: [
        "Đọc mô tả để biết sản phẩm đã gồm phụ kiện gì.",
        "Hỏi chi phí lắp đặt trước khi mua.",
        "Kiểm tra ốc, bản lề và hướng dẫn lắp.",
        "Chụp ảnh phụ kiện khi mở hộp.",
        "Không tự đấu điện nếu không có kinh nghiệm.",
      ],
    },
    {
      title: "Vận chuyển đồ cồng kềnh",
      paragraphs: [
        "Đồ nội thất và thiết bị lớn thường có phí vận chuyển riêng, không nằm trong freeship thông thường. Phí có thể tăng theo kích thước, cân nặng và số tầng. Hãy kiểm tra trước khi đặt để tránh phát sinh.",
        "Thời gian giao đồ cồng kềnh thường dài hơn hàng nhỏ. Nếu bạn cần sử dụng đúng ngày, hãy xác nhận lịch giao và chuẩn bị người nhận. Với chung cư, cần đăng ký vận chuyển với ban quản lý nếu có quy định.",
        "Khi nhận, hãy kiểm tra ngoại quan và đếm đủ phụ kiện trước khi ký. Nếu sản phẩm hư, chụp ảnh và ghi chú với đơn vị giao. Giữ bao bì để thuận tiện cho việc đổi trả.",
      ],
      bullets: [
        "Kiểm tra phí vận chuyển riêng của đồ lớn.",
        "Xác nhận lịch giao và người nhận.",
        "Đăng ký với ban quản lý nếu chung cư yêu cầu.",
        "Kiểm tra ngoại quan và phụ kiện khi nhận.",
        "Giữ bao bì để đổi trả nếu cần.",
      ],
    },
    {
      title: "Bảo hành và đổi trả đồ gia dụng",
      paragraphs: [
        "Chính sách bảo hành đồ gia dụng khác nhau theo sản phẩm và nhà bán. Hãy xem thời hạn, phạm vi và điều kiện áp dụng trước khi mua. Một số sản phẩm chỉ bảo hành động cơ, không bảo hành hao mòn tự nhiên.",
        "Đổi trả đồ cồng kềnh thường phức tạp và có phí. Trước khi đặt, hãy đọc kỹ điều kiện và giữ lại bao bì, phụ kiện. Nếu sản phẩm lỗi do vận chuyển, hãy báo ngay khi nhận.",
        "Sansale247 không bán hàng, không bảo hành và không xử lý đổi trả. Mọi giao dịch và chính sách do sàn hoặc người bán quyết định. Nếu mua qua link tiếp thị liên kết, website có thể nhận hoa hồng nhưng bạn không phải trả thêm.",
      ],
      bullets: [
        "Đọc thời hạn và phạm vi bảo hành.",
        "Hỏi rõ phí đổi trả đồ cồng kềnh.",
        "Giữ bao bì và phụ kiện.",
        "Báo ngay khi sản phẩm lỗi do vận chuyển.",
        "Liên hệ sàn hoặc nhà bán khi cần hỗ trợ.",
      ],
    },
  ],
};

/** Extra FAQs appended to the four base questions for the eight G1.3 hubs. */
export const CATEGORY_EXTRA_FAQS: Record<string, LandingFaqItem[]> = {
  freeship: [
    {
      question: "Freeship có áp dụng toàn quốc không?",
      answer:
        "Không phải lúc nào cũng vậy. Mã freeship thường áp dụng theo khu vực và đơn vị vận chuyển; khu vực xa hoặc đảo có thể phát sinh phụ thu. Hãy kiểm tra phí ship ở bước thanh toán với đúng địa chỉ nhận hàng.",
    },
    {
      question: "Có nên mua thêm để đủ điều kiện freeship?",
      answer:
        "Chỉ nên mua thêm nếu món đó thực sự cần và tổng chi phí vẫn có lợi. Nếu món thêm không dùng đến, số tiền bỏ ra có thể lớn hơn phần phí ship được giảm.",
    },
    {
      question: "Vì sao freeship không giảm hết phí vận chuyển?",
      answer:
        "Mã thường chỉ giảm phí ship cơ bản. Phụ thu cân nặng, kích thước hoặc khu vực xa vẫn có thể được tính riêng. Đọc điều kiện trên mã và kiểm tra tổng phí ở bước xác nhận.",
    },
    {
      question: "Kiểm tra freeship đã áp dụng ở đâu?",
      answer:
        "Ở bước thanh toán, xem mục phí vận chuyển và tổng tiền cuối cùng. Nếu phí không giảm như mong đợi, quay lại bước trước để kiểm tra mã và điều kiện trước khi đặt hàng.",
    },
  ],
  voucher: [
    {
      question: "Một voucher dùng được mấy lần?",
      answer:
        "Tùy chương trình. Có mã chỉ dùng một lần, có mã dùng nhiều lần nhưng giới hạn theo tài khoản hoặc thời gian. Điều kiện số lần sử dụng thường được ghi trên trang voucher.",
    },
    {
      question: "Voucher có cộng dồn được không?",
      answer:
        "Không phải lúc nào cũng cộng dồn. Một số chương trình loại trừ nhau hoặc chỉ cho chọn một mã giảm giá. Hệ thống sẽ báo lỗi nếu mã không tương thích; hãy thử từng mã và kiểm tra tổng tiền.",
    },
    {
      question: "Mã hết lượt có phải lỗi website không?",
      answer:
        "Thường không. Mã có thể đã được phát hết dù vẫn hiển thị trên trang. Hãy thử mã khác hoặc chương trình tương tự; không nên nhập lại cùng một mã nhiều lần.",
    },
    {
      question: "Có nên dùng mã từ nguồn không rõ ràng?",
      answer:
        "Chỉ nên dùng mã từ nguồn có link sản phẩm hoặc trang chương trình rõ ràng. Không cung cấp mật khẩu, OTP hoặc thông tin thẻ cho bất kỳ trang nhận mã nào ngoài sàn.",
    },
  ],
  beauty: [
    {
      question: "Mua mỹ phẩm online có an toàn không?",
      answer:
        "An toàn phụ thuộc vào người bán và nguồn hàng. Hãy chọn shop có thông tin rõ, kiểm tra tem, seal và hạn dùng khi nhận. Nếu sản phẩm có dấu hiệu bất thường, không nên sử dụng.",
    },
    {
      question: "Mỹ phẩm mini có phải hàng giả không?",
      answer:
        "Không hẳn. Nhiều thương hiệu có size mini hoặc travel size chính hãng. Tuy nhiên, giá quá thấp và bao bì in mờ có thể là dấu hiệu cần kiểm tra kỹ hơn.",
    },
    {
      question: "Sản phẩm hết hạn có dùng được không?",
      answer:
        "Không nên. Sau hạn, công thức có thể biến chất và gây kích ứng. Nếu sản phẩm đổi màu, tách lớp hoặc có mùi lạ, hãy ngừng dùng ngay cả khi chưa tới hạn.",
    },
    {
      question: "Có nên mua mỹ phẩm chỉ dựa trên review?",
      answer:
        "Review chỉ là tham khảo vì da mỗi người khác nhau. Hãy đọc cả bình luận trung bình và tiêu cực, ưu tiên sản phẩm có thể dùng thử lượng nhỏ trước khi mua full size.",
    },
  ],
  fashion: [
    {
      question: "Size giữa các shop có giống nhau không?",
      answer:
        "Không. Cùng nhãn S, M, L nhưng số đo có thể khác nhau. Hãy đo một món đang mặc vừa và đối chiếu với bảng size của từng shop trước khi đặt.",
    },
    {
      question: "Phân vân giữa hai size thì nên chọn thế nào?",
      answer:
        "Tùy form sản phẩm. Đồ ôm nên chọn theo số đo cơ thể; đồ dáng rộng có thể chọn nhỏ hơn nếu muốn vừa vặn. Đọc bình luận có ảnh để biết form thực tế.",
    },
    {
      question: "Đổi trả quần áo có mất phí không?",
      answer:
        "Tùy shop và sàn. Phí vận chuyển đổi trả thường do khách chịu, trừ khi lỗi thuộc về người bán. Hãy đọc chính sách trước khi đặt.",
    },
    {
      question: "Giày không vừa thì xử lý thế nào?",
      answer:
        "Kiểm tra chính sách đổi trả trước khi mua và giữ hộp, tag. Nếu giày chưa qua sử dụng, nhiều shop hỗ trợ đổi size trong thời hạn nhất định; phí đổi có thể do khách chịu.",
    },
  ],
  electronics: [
    {
      question: "Hàng refurbished có đáng mua không?",
      answer:
        "Có thể đáng nếu tình trạng và bảo hành được ghi rõ. Hãy hỏi về pin, màn hình, linh kiện đã thay và chính sách đổi trả. Giá rẻ chỉ có lợi khi rủi ro được kiểm soát.",
    },
    {
      question: "Bảo hành do ai xử lý?",
      answer:
        "Tùy sản phẩm: có thể là nhà sản xuất, người bán hoặc sàn. Hãy đọc mô tả và lưu hóa đơn, tem serial để biết nơi tiếp nhận bảo hành.",
    },
    {
      question: "Mua điện tử giá quá rẻ có rủi ro gì?",
      answer:
        "Có thể là hàng trưng bày, hàng refurb, bản nhập khẩu hoặc thiếu phụ kiện. Hãy kiểm tra model, tình trạng và bảo hành thay vì chỉ so giá.",
    },
    {
      question: "Nên kiểm tra gì khi nhận thiết bị?",
      answer:
        "Quay video mở gói, đối chiếu serial và phụ kiện, sau đó bật thử các chức năng cơ bản trong thời hạn đổi trả. Lưu ảnh thông tin thiết bị để đối chiếu khi cần.",
    },
  ],
  book: [
    {
      question: "Sách đang sale có phải bản cũ không?",
      answer:
        "Không nhất thiết. Sách có thể được giảm giá vì tồn kho hoặc chương trình khuyến mãi. Hãy kiểm tra năm in, nhà xuất bản và tình trạng sách thay vì chỉ nhìn mức giảm.",
    },
    {
      question: "Mua sách cũ online có rủi ro gì?",
      answer:
        "Sách cũ có thể thiếu phụ lục, có ghi chú hoặc bìa hư. Hãy hỏi người bán về tình trạng thực tế và yêu cầu ảnh chụp nếu mô tả chưa rõ.",
    },
    {
      question: "Nên mua combo hay từng cuốn?",
      answer:
        "Combo có thể rẻ hơn nhưng chỉ có lợi nếu bạn đọc hết. Hãy so giá theo từng cuốn và cân nhắc nhu cầu thực tế trước khi mua cả bộ.",
    },
    {
      question: "Sách giao có bị cong góc không?",
      answer:
        "Có thể, tùy cách đóng gói và vận chuyển. Chọn shop có đánh giá tốt về đóng gói và kiểm tra bìa, gáy khi nhận. Chụp ảnh nếu sách hư do vận chuyển.",
    },
  ],
  food: [
    {
      question: "Hạn dùng và best before khác nhau thế nào?",
      answer:
        "Hạn dùng là mốc an toàn cuối cùng theo nhà sản xuất; best before là mốc chất lượng tốt nhất. Cả hai đều phụ thuộc vào bảo quản đúng cách và bao bì còn kín.",
    },
    {
      question: "Thực phẩm tươi mua online có an toàn không?",
      answer:
        "Tùy shop và cách vận chuyển. Chọn shop có nguồn gốc rõ, giao nhanh và đóng gói giữ lạnh phù hợp. Kiểm tra hàng khi nhận trước khi sử dụng.",
    },
    {
      question: "Nên mua bao nhiêu thực phẩm mỗi lần?",
      answer:
        "Chỉ nên mua đủ dùng trước hạn. Số lượng lớn có thể rẻ hơn theo đơn vị nhưng dễ lãng phí nếu không dùng kịp hoặc bảo quản không đúng.",
    },
    {
      question: "Khi nào được đổi trả thực phẩm?",
      answer:
        "Khi hàng hư, sai loại, hết hạn hoặc bao bì bị rách. Thực phẩm đã mở thường không đổi vì lý do khẩu vị. Hãy chụp ảnh và liên hệ sàn ngay khi phát hiện vấn đề.",
    },
  ],
  home: [
    {
      question: "Đồ cồng kềnh có được freeship không?",
      answer:
        "Thường không hoặc chỉ được giảm một phần. Phí vận chuyển đồ lớn tính theo kích thước, cân nặng và số tầng. Hãy kiểm tra phí trước khi đặt.",
    },
    {
      question: "Lắp đặt có được hỗ trợ không?",
      answer:
        "Tùy sản phẩm và người bán. Một số đơn có hỗ trợ lắp đặt, số khác chỉ giao hàng. Hãy hỏi trước về chi phí và thời gian nếu bạn không tự lắp được.",
    },
    {
      question: "Đổi trả đồ nội thất thế nào?",
      answer:
        "Đồ cồng kềnh thường có phí đổi trả cao và yêu cầu giữ bao bì. Hãy đọc chính sách trước khi mua và báo ngay nếu sản phẩm lỗi do vận chuyển.",
    },
    {
      question: "Cần đo gì trước khi mua đồ gia dụng?",
      answer:
        "Đo chỗ đặt, cửa ra vào, hành lang, cầu thang và thang máy. Kiểm tra thêm điện áp, công suất và quy định vận chuyển của tòa nhà nếu ở chung cư.",
    },
  ],
};
