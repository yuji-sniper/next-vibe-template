import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { AuthAdminMenu } from "@/features/auth-admin/components/layout/AuthAdminMenu"
import { getAuthAdminQuery } from "@/features/auth-admin/queries/get-auth-admin"
import { authAdminKey } from "@/features/auth-admin/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"

export const dynamic = "force-dynamic"

export default async function AdminAuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const { authAdmin } = await queryClient.fetchQuery({
    queryKey: authAdminKey,
    queryFn: () => getAuthAdminQuery({ orError: false })
  })

  if (!authAdmin) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-14 items-center justify-end">
          <AuthAdminMenu />
        </div>
      </header>
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {children}
        </HydrationBoundary>
      </main>
    </div>
  )
}
