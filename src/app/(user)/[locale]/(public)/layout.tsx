import { redirect } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@/components/ui/button"
import { env } from "@/env"
import { getAuthUserQuery } from "@/features/auth/queries/get-auth-user"
import { authUserKey } from "@/features/auth/queries/keys"
import { Link } from "@/i18n/navigation"
import { getQueryClient } from "@/lib/react-query/query-client"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function UserPublicLayout({ children, params }: Props) {
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

  const tHeader = await getTranslations("header")
  const tFooter = await getTranslations("footer")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-50 border-b bg-background w-full">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold">
            {env.NEXT_PUBLIC_SERVICE_NAME}
          </Link>
          <Button asChild size="sm">
            <Link href="/sign-in">{tHeader("signIn")}</Link>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col pt-14">{children}</main>
      <footer className="border-t py-6">
        <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {tFooter("terms")}
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {tFooter("privacy")}
          </Link>
          <Link
            href="/commercial-law"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {tFooter("commercialLaw")}
          </Link>
        </nav>
      </footer>
    </div>
  )
}
