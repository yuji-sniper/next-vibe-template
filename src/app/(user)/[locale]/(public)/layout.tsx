import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { getAuthUserQuery } from "@/features/auth/queries/get-auth-user"
import { authUserKey } from "@/features/auth/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"

export default async function UserPublicLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()
  const { authUser } = await queryClient.fetchQuery({
    queryKey: authUserKey,
    queryFn: () => getAuthUserQuery({ orError: false })
  })

  if (authUser) {
    redirect(`/${locale}/home`)
  }

  return children
}
