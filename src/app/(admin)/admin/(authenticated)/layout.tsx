import type { Metadata } from "next"
import { env } from "@/env"
import { authAdminKey, getAuthAdminQuery } from "@/features/auth-admin"
import { getQueryClient } from "@/lib/react-query"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Dashboard | ${env.NEXT_PUBLIC_SERVICE_NAME_ADMIN}`,
  description: "Dashboard page."
}

export default async function AdminAuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: authAdminKey,
    queryFn: () => getAuthAdminQuery({ redirectIfUnauthorized: true })
  })

  return children
}
