import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

const itemKeys = [
  "seller",
  "representative",
  "address",
  "phone",
  "email",
  "url",
  "price",
  "additionalCost",
  "payment",
  "paymentTiming",
  "delivery",
  "cancellation",
  "environment"
] as const

export default async function CommercialLawPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("commercialLaw")

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">{t("heading")}</h1>
      <p className="mb-10 text-sm text-muted-foreground">{t("lastUpdated")}</p>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <tbody className="divide-y">
            {itemKeys.map((key) => (
              <tr key={key}>
                <th className="w-1/3 bg-muted/50 px-4 py-3 text-left text-sm font-medium align-top">
                  {t(`items.${key}.label`)}
                </th>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t(`items.${key}.value`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
