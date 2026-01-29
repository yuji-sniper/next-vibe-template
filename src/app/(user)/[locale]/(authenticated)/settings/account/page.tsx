import { setRequestLocale } from "next-intl/server"
import { AccountSettingsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AccountSettingsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AccountSettingsContainer />
}
