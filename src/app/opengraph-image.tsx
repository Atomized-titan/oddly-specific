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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          background: "linear-gradient(to bottom right, #f3e8ff, #fae8ff)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 800,
              background: "linear-gradient(to right, #6366f1, #a855f7)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
            }}
          >
            Oddly Specific
          </h1>
          <p
            style={{
              fontSize: 30,
              margin: 0,
              marginTop: 10,
              color: "#6b7280",
            }}
          >
            Because generic compliments are boring
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
