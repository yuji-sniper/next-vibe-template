import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { env } from "@/env"
import { routing } from "@/i18n/routing"
import { ProgressBarProvider } from "@/providers/ProgressBarProvider"
import { QueryProvider } from "@/providers/QueryProvider"

const serviceName = env.NEXT_PUBLIC_SERVICE_NAME
const serviceDescription =
  "A modern and beautiful template for your next project."
const authorName = "John Smith"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_ORIGIN),
  title: {
    template: `%s | ${serviceName}`,
    default: serviceName
  },
  description: serviceDescription,
  keywords: ["Next.js", "React", "Vibe coding"],
  authors: [{ name: authorName, url: env.NEXT_PUBLIC_ORIGIN }],
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <ProgressBarProvider>{children}</ProgressBarProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
