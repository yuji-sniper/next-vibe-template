import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { authUserKey, getAuthUserQuery } from "@/features/auth"
import { getQueryClient } from "@/lib/react-query"

export const dynamic = "force-dynamic"

export default async function UserAuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const { authUser } = await queryClient.fetchQuery({
    queryKey: authUserKey,
    queryFn: () => getAuthUserQuery({ orError: false })
  })

  if (!authUser) {
    redirect("/sign-in")
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
