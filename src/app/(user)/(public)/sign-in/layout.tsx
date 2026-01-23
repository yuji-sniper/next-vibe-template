import type { Metadata } from "next"
import { env } from "@/env"

export const metadata: Metadata = {
  title: `Sign In | ${env.NEXT_PUBLIC_SERVICE_NAME}`,
  description: "Sign in page."
}

export default async function SignInLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
