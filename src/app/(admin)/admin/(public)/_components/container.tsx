"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { useEffectOnce } from "react-use"
import { authAdminClient } from "@/lib/better-auth/auth-admin-client"
import { AdminSignInPresentational } from "./presentational"

export function AdminSignInContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const errorMessage = useMemo(() => {
    const error = searchParams.get("error")
    if (error === "unable_to_create_user") {
      return [
        "このアカウントはサインインできません。",
        "管理者にお問い合わせください。"
      ]
    }
    return undefined
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await authAdminClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffectOnce(() => {
    authAdminClient.oneTap({
      callbackURL: "/dashboard",
      cancelOnTapOutside: false
    })
  })

  return (
    <AdminSignInPresentational
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
      error={errorMessage}
    />
  )
}
