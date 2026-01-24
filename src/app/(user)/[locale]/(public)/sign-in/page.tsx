import { setRequestLocale } from "next-intl/server"
import { SignInContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SignInContainer />
}
