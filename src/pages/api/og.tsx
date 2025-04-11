import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const type = searchParams.get("type") || "default";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#190066",
            padding: "60px",
            fontFamily: "Inter",
          }}
        >
          {/* Logo and Type */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src="https://docs.inkonchain.com/logo/icon.svg"
                alt="Ink Logo"
                width={80}
                height={80}
              />
              <span
                style={{
                  fontSize: "36px",
                  color: "white",
                }}
              >
                Ink Documentation
              </span>
            </div>
            {type !== "default" && (
              <div
                style={{
                  fontSize: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "99px",
                }}
              >
                {type}
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                fontSize: title && title.length > 40 ? "64px" : "84px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.1,
                marginTop: "40px",
              }}
            >
              {title || "Ink Documentation"}
            </div>
            {description && (
              <div
                style={{
                  fontSize: "32px",
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "160px",
              background:
                "linear-gradient(180deg, rgba(25, 0, 102, 0) 0%, #190066 100%)",
              zIndex: 0,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
