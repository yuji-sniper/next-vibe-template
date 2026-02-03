import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { AccountSettingsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "metadata.accountSettings"
  })

  return {
    title: t("title"),
    description: t("description")
  }
}

export default async function AccountSettingsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AccountSettingsContainer />
}
