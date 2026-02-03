import type { Metadata } from "next"
import { Suspense } from "react"
import { AdminSignInContainer } from "./_components/container"

export const metadata: Metadata = {
  title: "サインイン",
  description: "管理者用のサインインページです。"
}

export default function AdminSignInPage() {
  return (
    <Suspense>
      <AdminSignInContainer />
    </Suspense>
  )
}
