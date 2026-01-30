"use client"

import { useTranslations } from "next-intl"
import { GoogleSignInButton } from "@/features/auth/components/ui/GoogleSignInButton"

type SignInPresentationalProps = {
  onGoogleSignIn: () => void
  isLoading: boolean
}

export function SignInPresentational({
  onGoogleSignIn,
  isLoading
}: SignInPresentationalProps) {
  const t = useTranslations("signIn")

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <GoogleSignInButton onClick={onGoogleSignIn} loading={isLoading} />
      </div>
    </div>
  )
}
