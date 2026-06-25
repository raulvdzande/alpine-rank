import type { MetadataRoute } from "next";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://peakflow.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/account/"],
    },
    sitemap: `${ORIGIN}/sitemap.xml`,
  };
}
