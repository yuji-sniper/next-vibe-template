import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { env } from "@/env"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.top" })
  const origin = env.NEXT_PUBLIC_ORIGIN

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${origin}/${locale}`,
      languages: {
        ja: `${origin}/ja`,
        en: `${origin}/en`
      }
    }
  }
}

export default async function TopPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("top")

  return (
    <div>
      <h1>{t("heading")}</h1>
    </div>
  )
}
