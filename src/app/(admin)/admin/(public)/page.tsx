import type { Metadata } from "next"
import { Suspense } from "react"
import { AdminSignInContainer } from "./_components/container"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Admin sign in page."
}

export default function AdminSignInPage() {
  return (
    <Suspense>
      <AdminSignInContainer />
    </Suspense>
  )
}
