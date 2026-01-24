import { redirect } from "next/navigation"
import { getAuthAdminQuery } from "@/features/auth-admin/queries/get-auth-admin"
import { authAdminKey } from "@/features/auth-admin/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"

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
