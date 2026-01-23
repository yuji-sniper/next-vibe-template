import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env"
import { authUserKey, getAuthUserQuery } from "@/features/auth"
import { getQueryClient } from "@/lib/react-query"

export const metadata: Metadata = {
  title: `Top | ${env.NEXT_PUBLIC_SERVICE_NAME}`,
  description: "Top page."
}

export default async function UserPublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const { authUser } = await queryClient.fetchQuery({
    queryKey: authUserKey,
    queryFn: () => getAuthUserQuery({ orError: false })
  })

  if (authUser) {
    redirect("/home")
  }

  return children
}
