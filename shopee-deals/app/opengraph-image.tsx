import { ImageResponse } from "next/og";

export const alt =
  "Sansale247 — Mã giảm giá Shopee, Tiki, Lazada, TikTok Shop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #fff7f2 0%, #ffffff 55%, #eef6ff 100%)",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "#f15a24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "36px",
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "#1f2937" }}>
            Sansale247
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "64px",
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-2px",
              maxWidth: "950px",
            }}
          >
            Mã giảm giá thật, deal đáng mua.
          </div>
          <div
            style={{
              marginTop: "20px",
              fontSize: "28px",
              color: "#4b5563",
            }}
          >
            Shopee · Tiki · Lazada · TikTok Shop
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            color: "#6b7280",
          }}
        >
          <span>Cập nhật tự động 24/7</span>
          <span>sansale247.io.vn</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
