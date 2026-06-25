"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { initPostHog } from "@/lib/posthog";

export function Analytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("analytics-consent");
    if (saved === "true") {
      setConsent(true);
      initPostHog();
    } else if (!saved) {
      const banner = document.getElementById("cookie-banner");
      if (banner) banner.style.display = "block";
    }
  }, []);

  if (!consent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  );
}
