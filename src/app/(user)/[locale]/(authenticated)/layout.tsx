import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { Toaster } from "@/components/ui/sonner"
import { AuthUserMenu } from "@/features/auth/components/layout/AuthUserMenu"
import { getAuthUserQuery } from "@/features/auth/queries/get-auth-user"
import { authUserKey } from "@/features/auth/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"

export const dynamic = "force-dynamic"

export default async function UserAuthenticatedLayout({
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

  if (!authUser) {
    redirect(`/${locale}/sign-in`)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="z-50 shrink-0 border-b bg-background">
        <div className="container flex h-14 items-center justify-end">
          <AuthUserMenu />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {children}
        </HydrationBoundary>
      </main>
      <Toaster />
    </div>
  )
}
