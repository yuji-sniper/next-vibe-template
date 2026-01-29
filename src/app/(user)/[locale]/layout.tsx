import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { ProgressBarProvider } from "@/providers/ProgressBarProvider"
import { QueryProvider } from "@/providers/QueryProvider"

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
