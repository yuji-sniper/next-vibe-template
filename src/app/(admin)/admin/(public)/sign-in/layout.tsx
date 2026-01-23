import type { Metadata } from "next"
import { env } from "@/env"

export const metadata: Metadata = {
  title: `Sign In | ${env.NEXT_PUBLIC_SERVICE_NAME_ADMIN}`,
  description: "Admin sign in page."
}

export default async function AdminSignInLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
