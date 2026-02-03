import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { env } from "@/env"
import { SignInContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.signIn" })

  const origin = env.NEXT_PUBLIC_ORIGIN

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${origin}/${locale}/sign-in`,
      languages: {
        ja: `${origin}/ja/sign-in`,
        en: `${origin}/en/sign-in`
      }
    }
  }
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SignInContainer />
}
