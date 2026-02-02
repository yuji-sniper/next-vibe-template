"use client"

import { useLocale } from "next-intl"
import { useState } from "react"
import { useEffectOnce } from "react-use"
import { authClient } from "@/lib/better-auth/auth-client"
import { SignInPresentational } from "./presentational"

export function SignInContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const locale = useLocale()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `/${locale}/home`
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffectOnce(() => {
    authClient.oneTap({
      callbackURL: `/${locale}/home`,
      cancelOnTapOutside: false
    })
  })

  return (
    <SignInPresentational
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
    />
  )
}
