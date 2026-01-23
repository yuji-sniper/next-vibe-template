import type { Metadata } from "next"
import { env } from "@/env"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Home | ${env.NEXT_PUBLIC_SERVICE_NAME}`,
  description: "Home page."
}

export default async function HomeLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
