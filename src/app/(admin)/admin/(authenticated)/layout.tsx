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
import { QueryProvider } from "@/providers/QueryProvider"
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
    redirect("/")
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen">
        <QueryProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SidebarProvider>
              <AdminSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
                  <SidebarTrigger />
                </header>
                <main className="flex-1 p-4 flex justify-center">
                  {children}
                </main>
              </SidebarInset>
              <Toaster />
            </SidebarProvider>
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  )
}
