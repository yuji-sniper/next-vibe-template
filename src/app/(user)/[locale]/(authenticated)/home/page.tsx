import { getTranslations, setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("home")

  return (
    <div>
      <h1>{t("heading")}</h1>
    </div>
  )
}
