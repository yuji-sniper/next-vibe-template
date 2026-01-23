import type { Metadata } from "next"
import { env } from "@/env"
import { authUserKey, getAuthUserQuery } from "@/features/auth"
import { getQueryClient } from "@/lib/react-query"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: `Home | ${env.NEXT_PUBLIC_SERVICE_NAME}`,
  description: "Home page."
}

export default async function UserAuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: authUserKey,
    queryFn: () => getAuthUserQuery({ redirectIfUnauthorized: true })
  })

  return children
}
