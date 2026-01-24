"use client"

import { ErrorAlert } from "@/components/ui/error-alert"
import { GoogleSignInButton } from "@/features/auth/components/ui/GoogleSignInButton"

type AdminSignInPresentationalProps = {
  onGoogleSignIn: () => void
  isLoading: boolean
  error: string[] | undefined
}

export function AdminSignInPresentational({
  onGoogleSignIn,
  isLoading,
  error
}: AdminSignInPresentationalProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6">
        {error && <ErrorAlert messages={error} />}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">サインイン</h1>
          <p className="text-sm text-muted-foreground">
            Googleアカウントでサインインしてください
          </p>
        </div>
        <GoogleSignInButton onClick={onGoogleSignIn} loading={isLoading} />
      </div>
    </div>
  )
}
