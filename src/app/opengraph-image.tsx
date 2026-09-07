import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: "linear-gradient(135deg, #1C1917 0%, #44403C 50%, #1C1917 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAF7F2",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Top decorative line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#D6C9A8",
            marginBottom: "40px",
            display: "flex",
          }}
        />

        {/* Brand Name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-2px",
            marginBottom: "12px",
            display: "flex",
          }}
        >
          Optik Intercontinental
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#D6C9A8",
            fontWeight: 400,
            marginBottom: "40px",
            display: "flex",
          }}
        >
          Toko Kacamata & Lensa Terpercaya
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#D6C9A8",
            display: "flex",
          }}
        />

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "40px",
            fontSize: 20,
            color: "#A8A29E",
          }}
        >
          <span>Frame Premium</span>
          <span>•</span>
          <span>Lensa Berkualitas</span>
          <span>•</span>
          <span>Konsultasi Gratis</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
