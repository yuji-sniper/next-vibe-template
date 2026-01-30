import type { MetadataRoute } from "next"

import { env } from "@/env"
import { routing } from "@/i18n/routing"

const publicPaths = ["/", "/sign-in"]

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = env.NEXT_PUBLIC_ORIGIN

  return routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: `${origin}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1.0 : 0.5
    }))
  )
}
