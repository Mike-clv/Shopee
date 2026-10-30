import { SITE } from "@/lib/site";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  title: string;
  description?: string;
  items: FaqItem[];
};

export const FAQ_UPDATED = "2026-10-30";

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Mua hàng và mã giảm giá",
    description:
      "Những câu hỏi thường gặp khi tìm mã, kiểm tra giá và sử dụng voucher trên website.",
    items: [
      {
        question: "Sansale247 có bán hàng trực tiếp không?",
        answer:
          "Không. Sansale247 là website tổng hợp mã giảm giá, voucher và deal từ các sàn thương mại điện tử. Website không giữ hàng, không xử lý đơn hàng, thanh toán, vận chuyển, đổi trả hoặc bảo hành. Mọi giao dịch diễn ra trên trang của sàn hoặc người bán.",
      },
      {
        question: "Mã giảm giá trên website có luôn sử dụng được không?",
        answer:
          "Không đảm bảo. Mã có thể hết hạn, hết lượt, thay đổi điều kiện hoặc chỉ áp dụng cho một nhóm người dùng. Website cố gắng cập nhật và ghi chú điều kiện, nhưng bạn nên kiểm tra lại ở bước thanh toán trên trang đích.",
      },
      {
        question: "Giá hiển thị trên website có phải giá cuối cùng?",
        answer:
          "Không. Giá trên website là thông tin tham khảo tại thời điểm đồng bộ. Giá cuối cùng, phí vận chuyển, thuế và ưu đãi áp dụng được xác định trên trang của sàn hoặc người bán khi bạn đặt hàng.",
      },
      {
        question: "Tại sao tôi thấy một mã đã hết hạn?",
        answer:
          "Chương trình có thể kết thúc sớm, hết lượt sử dụng hoặc dữ liệu đồng bộ chậm hơn so với trang đích. Nếu bạn gặp mã hết hạn hoặc link lỗi, hãy gửi URL cụ thể qua trang liên hệ để website kiểm tra và cập nhật.",
      },
    ],
  },
  {
    title: "Link affiliate và chi phí",
    description:
      "Cách website duy trì hoạt động và ảnh hưởng của link tiếp thị liên kết đến giá bạn trả.",
    items: [
      {
        question: "Mua qua link trên Sansale247 có đắt hơn không?",
        answer:
          "Không. Khi bạn mua qua link affiliate, mức giá hiển thị trên sàn vẫn là giá bạn phải trả. Khoản hoa hồng do sàn hoặc người bán chi trả cho website, không cộng thêm vào đơn hàng của bạn.",
      },
      {
        question: "Website kiếm tiền như thế nào?",
        answer:
          "Website có thể nhận hoa hồng tiếp thị liên kết khi người đọc mua hàng qua link. Website không bán vị trí hiển thị, không nhận tiền để đẩy deal lên đầu và không để hoa hồng quyết định nội dung.",
      },
      {
        question: "Làm sao biết link nào là link affiliate?",
        answer:
          "Link affiliate thường đi qua tên miền theo dõi của AccessTrade hoặc có tham số tiếp thị. Website cũng ghi chú minh bạch ở chân trang và có trang Tiết lộ affiliate để giải thích rõ.",
      },
    ],
  },
  {
    title: "Dữ liệu và quyền riêng tư",
    description:
      "Thông tin website thu thập, mục đích sử dụng và cách gửi yêu cầu về dữ liệu cá nhân.",
    items: [
      {
        question: "Sansale247 thu thập những dữ liệu gì?",
        answer:
          "Website có thể ghi nhận dữ liệu kỹ thuật khi bạn truy cập như địa chỉ IP, loại trình duyệt, thiết bị, trang đã xem và thời gian. Website không yêu cầu tạo tài khoản và không trực tiếp xử lý thanh toán.",
      },
      {
        question: "Website có dùng cookie quảng cáo không?",
        answer:
          "Hiện tại website chỉ dùng cookie phiên cần thiết cho quản trị viên. Khi bạn bấm link ra sàn hoặc đối tác affiliate, bên thứ ba có thể đặt cookie trên tên miền của họ để ghi nhận lượt mua. Website không kiểm soát các cookie này.",
      },
      {
        question: "Làm sao yêu cầu xem hoặc xóa dữ liệu cá nhân?",
        answer:
          `Gửi email đến ${SITE.contactEmail} với tiêu đề “Yêu cầu dữ liệu cá nhân”. Website sẽ xác minh và phản hồi theo thời hạn pháp luật quy định, thường không quá 30 ngày.`,
      },
    ],
  },
  {
    title: "Báo lỗi và hợp tác",
    description:
      "Cách báo mã hết hạn, link lỗi hoặc liên hệ về nội dung, dữ liệu và hợp tác.",
    items: [
      {
        question: "Tôi muốn báo mã hết hạn hoặc link lỗi thì làm thế nào?",
        answer:
          `Gửi email đến ${SITE.contactEmail} kèm URL của trang hoặc deal, mô tả ngắn lỗi bạn gặp và ảnh chụp màn hình nếu có. Thông tin càng cụ thể, website càng kiểm tra nhanh hơn.`,
      },
      {
        question: "Website có hỗ trợ xử lý đơn hàng không?",
        answer:
          "Không. Sansale247 không có quyền can thiệp vào đơn hàng, hoàn tiền, vận chuyển hoặc bảo hành của bên thứ ba. Vui lòng liên hệ trực tiếp sàn hoặc người bán nơi bạn đã đặt hàng.",
      },
      {
        question: "Tôi muốn hợp tác hoặc gửi thông tin thương hiệu?",
        answer:
          `Gửi email đến ${SITE.contactEmail} với thông tin về thương hiệu, sản phẩm và đề xuất hợp tác. Website không bán thứ hạng và không cam kết đăng nội dung trả phí nếu chưa có thỏa thuận rõ ràng.`,
      },
    ],
  },
];

export const FAQ_ITEMS = FAQ_GROUPS.flatMap((group) => group.items);
