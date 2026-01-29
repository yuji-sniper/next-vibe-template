import { setRequestLocale } from "next-intl/server"
import { SettingsNav } from "./_components/settings-nav"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function SettingsLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <SettingsNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
