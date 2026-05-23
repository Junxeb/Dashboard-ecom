import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.istudiobyspvi.com" },
      { protocol: "https", hostname: "i5.walmartimages.com" },
      { protocol: "https", hostname: "www.jbhifi.co.nz" },
      { protocol: "https", hostname: "i2.cloudfable.net" },
      { protocol: "https", hostname: "assets.myntassets.com" },
      { protocol: "https", hostname: "cdn.media.amplience.net" },
      { protocol: "https", hostname: "www.mcsport.ie" },
      { protocol: "https", hostname: "down-th.img.susercontent.com" },
      { protocol: "https", hostname: "www.bhg.com" },
      { protocol: "https", hostname: "as2.ftcdn.net" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "t4.ftcdn.net" },
      { protocol: "https", hostname: "sendatoy.com.au" },
      { protocol: "https", hostname: "media.istockphoto.com" },
      { protocol: "https", hostname: "arkiveheadcare.com" },
      { protocol: "https", hostname: "static.vecteezy.com" }
    ]
  }
};

export default nextConfig;
