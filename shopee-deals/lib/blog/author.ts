/**
 * Public editorial identity used by every blog post and the author profile.
 * Keeping it in one place means the author link, schema @id and profile copy
 * cannot drift apart as the blog grows.
 */
export const EDITORIAL_TEAM = {
  slug: "ban-bien-tap",
  name: "Ban biên tập Sansale247",
  title: "Nội dung và kiểm duyệt deal",
  href: "/tac-gia/ban-bien-tap",
  updated: "2026-10-31",
  description:
    "Hồ sơ Ban biên tập Sansale247: ai viết nội dung, quy trình kiểm tra mã giảm giá và deal, nguyên tắc affiliate, cách báo lỗi và cập nhật bài viết.",
  shortBio:
    "Nhóm biên tập tổng hợp mã giảm giá, voucher và deal từ các sàn lớn; kiểm tra điều kiện, hạn dùng, nguồn dữ liệu và cập nhật khi thông tin thay đổi.",
  expertise: [
    "Mã giảm giá và voucher",
    "Freeship và phí vận chuyển",
    "Giá, tồn kho và điều kiện khuyến mãi",
    "Quy trình mua hàng trên Shopee, Tiki, Lazada, TikTok Shop",
    "Minh bạch affiliate",
  ],
  process: [
    {
      title: "Thu thập và phân loại",
      text: "Dữ liệu được lấy từ AccessTrade, datafeed của sàn, trang chương trình công khai và phản hồi của người đọc. Mỗi mục được phân loại theo sàn, danh mục, loại ưu đãi và thời hạn.",
    },
    {
      title: "Kiểm tra nguồn và điều kiện",
      text: "Biên tập viên đối chiếu trang đích khi có thể: mã còn hiệu lực không, đơn tối thiểu, danh mục loại trừ, phương thức thanh toán, khu vực giao hàng và hạn sử dụng. Thông tin không kiểm chứng được sẽ không được trình bày như chắc chắn.",
    },
    {
      title: "Đối chiếu quyền lợi thực tế",
      text: "Bài viết so sánh tổng chi phí sau mã, phí vận chuyển và điều kiện đổi trả thay vì chỉ nhìn mức giảm trên tiêu đề. Với sản phẩm dễ thay đổi giá, nội dung ghi rõ thời điểm kiểm tra để người đọc tự xác nhận lại.",
    },
    {
      title: "Biên tập và rà soát",
      text: "Nội dung được viết theo cấu trúc dễ tra cứu, có ví dụ và bảng so sánh khi cần. Trước khi xuất bản, bài được rà soát lại về số liệu, liên kết, tiêu đề và các câu khẳng định có thể gây hiểu nhầm.",
    },
    {
      title: "Cập nhật và đính chính",
      text: "Khi mã hết hạn, link lỗi hoặc điều kiện thay đổi, nội dung được sửa hoặc gỡ. Ngày cập nhật trên bài phản ánh lần rà soát gần nhất; lỗi do người đọc báo được ưu tiên kiểm tra.",
    },
  ],
  principles: [
    "Không hứa mức giảm hoặc freeship khi chưa kiểm tra điều kiện.",
    "Không tạo cảm giác khẩn cấp giả hoặc đếm ngược không có thật.",
    "Không để hoa hồng affiliate quyết định thứ hạng deal.",
    "Không che giấu quan hệ affiliate với sàn hoặc mạng tiếp thị.",
    "Không đăng thông tin cá nhân, OTP hoặc hướng dẫn thanh toán ngoài sàn.",
    "Sửa hoặc gỡ nội dung sai khi phát hiện, thay vì để tồn tại vì mục đích traffic.",
  ],
} as const;
