import { redirect } from "next/navigation"
import { authAdminKey, getAuthAdminQuery } from "@/features/auth-admin"
import { getQueryClient } from "@/lib/react-query"

export default async function AdminPublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const authAdmin = await queryClient.fetchQuery({
    queryKey: authAdminKey,
    queryFn: () => getAuthAdminQuery({ orError: false })
  })

  if (authAdmin) {
    redirect("/")
  }

  return children
}
