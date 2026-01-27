import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { getAuthAdminQuery } from "@/features/auth-admin/queries/get-auth-admin"
import { authAdminKey } from "@/features/auth-admin/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { AdminSidebar } from "./_components/admin-sidebar"

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
    redirect("/admin/sign-in")
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4">
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
