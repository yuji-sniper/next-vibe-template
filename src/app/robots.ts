import type { MetadataRoute } from "next"

import { env } from "@/env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/ja/", "/en/"],
        disallow: [
          "/api/*",
          "/admin/*",
          "/*/home/",
          "/*/pricing/",
          "/*/settings/"
        ]
      }
    ],
    sitemap: `${env.NEXT_PUBLIC_ORIGIN}/sitemap.xml`
  }
}
