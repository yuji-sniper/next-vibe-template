"use client"

import { useState } from "react"
import { useEffectOnce } from "react-use"
import { authClient } from "@/lib/better-auth/auth-client"
import { SignInPresentational } from "./presentational"

export function SignInContainer() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffectOnce(() => {
    authClient.oneTap({
      callbackURL: "/home"
    })
  })

  return (
    <SignInPresentational
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
    />
  )
}
