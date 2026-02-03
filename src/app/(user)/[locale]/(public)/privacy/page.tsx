import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { env } from "@/env"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.privacy" })

  const origin = env.NEXT_PUBLIC_ORIGIN

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${origin}/${locale}/privacy`,
      languages: {
        ja: `${origin}/ja/privacy`,
        en: `${origin}/en/privacy`
      }
    }
  }
}

const sectionKeys = [
  "collection",
  "purpose",
  "thirdParty",
  "security",
  "cookies",
  "retention",
  "rights",
  "changes",
  "contact"
] as const

const listSections: Record<string, string[]> = {
  collection: ["1", "2", "3", "4"],
  purpose: ["1", "2", "3", "4", "5"]
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("privacy")

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">{t("heading")}</h1>
      <p className="mb-10 text-sm text-muted-foreground">{t("lastUpdated")}</p>

      <div className="space-y-8">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="mb-3 text-xl font-semibold">
              {t(`sections.${key}.title`)}
            </h2>
            <p className="leading-7 text-muted-foreground">
              {t(`sections.${key}.content`)}
            </p>
            {listSections[key] && (
              <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
                {listSections[key].map((item) => (
                  <li key={item}>{t(`sections.${key}.items.${item}`)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
