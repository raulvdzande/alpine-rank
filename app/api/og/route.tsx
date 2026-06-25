import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(135deg, #1d9e75 0%, #1a5fb4 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          ⛰ PeakFlow — Ski Rankings
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const resort = await prisma.resort.findUnique({
    where: { slug },
    select: { name: true, Country: true, snowScore: true, pisteKm: true, reviewCount: true },
  });

  if (!resort) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(135deg, #1d9e75 0%, #1a5fb4 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          ⛰ PeakFlow
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1a3a5c 0%, #0f2a45 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>⛰</div>
        <div style={{ fontSize: 56, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
          {resort.name}
        </div>
        <div style={{ fontSize: 28, marginBottom: 40, opacity: 0.8 }}>
          {resort.Country}
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 24,
            background: "rgba(255,255,255,0.1)",
            padding: "20px 40px",
            borderRadius: "12px",
          }}
        >
          <div>❄ {resort.snowScore?.toFixed(1) ?? "—"}/10</div>
          <div>🏔 {resort.pisteKm ?? "—"}km</div>
          <div>⭐ {resort.reviewCount}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
