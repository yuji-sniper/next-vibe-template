import type { Metadata } from "next"
import { env } from "@/env"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Dashboard | ${env.NEXT_PUBLIC_SERVICE_NAME_ADMIN}`,
  description: "Dashboard page."
}

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
