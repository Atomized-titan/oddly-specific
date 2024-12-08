import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Oddly Specific";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          padding: "80px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0A0A0F",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(80% 80% at 50% 50%, rgba(167, 139, 250, 0.12) 0%, rgba(0, 0, 0, 0) 100%)",
            zIndex: 0,
          }}
        />

        {/* Grid Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(167, 139, 250, 0.08) 2%, transparent 0%)",
            backgroundSize: "50px 50px",
            zIndex: 1,
          }}
        />

        {/* Left Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            zIndex: 2,
            flex: 1,
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 700,
              color: "#A78BFA",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Oddly Specific
          </h1>
          <p
            style={{
              fontSize: 36,
              color: "#64748B",
              margin: 0,
              fontWeight: 400,
              maxWidth: "500px",
            }}
          >
            Because generic compliments are boring
          </p>
        </div>

        {/* Right Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "480px",
            background: "rgba(30, 30, 35, 0.95)",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(167, 139, 250, 0.1)",
            zIndex: 2,
            marginLeft: "40px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "#94A3B8",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            CREATIVE
          </span>
          <span
            style={{
              fontSize: 28,
              color: "#FFFFFF",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            You&apos;re the kind of person who creates spotify playlists for
            extremely specific moods.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
