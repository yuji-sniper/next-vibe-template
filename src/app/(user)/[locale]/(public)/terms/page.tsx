import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

const sectionKeys = [
  "acceptance",
  "definition",
  "registration",
  "prohibited",
  "suspension",
  "liability",
  "changes",
  "law"
] as const

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("terms")

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
            {key === "prohibited" && (
              <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
                {(["1", "2", "3", "4", "5", "6"] as const).map((item) => (
                  <li key={item}>{t(`sections.prohibited.items.${item}`)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
