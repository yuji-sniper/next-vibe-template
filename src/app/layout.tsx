import type { Metadata } from "next"
import "./globals.css"
import { env } from "@/env"

const serviceName = env.NEXT_PUBLIC_SERVICE_NAME
const serviceDescription =
  "A modern and beautiful template for your next project."
const authorName = "John Smith"

export const metadata: Metadata = {
  title: {
    template: `%s | ${serviceName}`,
    default: serviceName
  },
  description: serviceDescription,
  keywords: ["Next.js", "React", "Vibe coding"],
  authors: [{ name: authorName, url: "https://vibe-coding.com" }],
  creator: authorName,
  publisher: authorName,
  openGraph: {
    title: serviceName,
    description: serviceDescription,
    url: env.NEXT_PUBLIC_ORIGIN,
    siteName: serviceName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: serviceName,
    description: serviceDescription,
    images: ["/og-image.png"]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
