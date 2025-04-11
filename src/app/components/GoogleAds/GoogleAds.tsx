"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }

  namespace JSX {
    interface IntrinsicElements {
      "amp-ad": any;
    }
  }
}

const GoogleAdsCardFomate: React.FC = () => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "inline-block", height: "70px" }}
      data-ad-client="ca-pub-8351627559637354"
      data-ad-slot="2645453984"
    ></ins>
  );
};

export default GoogleAdsCardFomate;

export const CardShapeAd = () => {
  return (
    <amp-ad
      width="100vw"
      height="320"
      type="adsense"
      data-ad-client="ca-pub-8351627559637354"
      data-ad-slot="8907610009"
      data-auto-format="rspv"
      data-full-width=""
    >
      <div style={{ overflow: "hidden" }}></div>
    </amp-ad>
  );
};
