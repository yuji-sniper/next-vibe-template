"use client"

import { CreditCard, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/shadcn/utils"

const navItems = [
  { key: "account" as const, href: "/settings/account", icon: User },
  { key: "billing" as const, href: "/settings/billing", icon: CreditCard }
]

export function SettingsNav() {
  const t = useTranslations("settings")
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <>
      {/* デスクトップ: 縦型サイドナビ */}
      <nav className="hidden w-56 shrink-0 md:block">
        <h1 className="mb-4 text-2xl font-bold">{t("heading")}</h1>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const fullHref = `/${locale}${item.href}`
            const isActive = pathname.startsWith(fullHref)
            return (
              <li key={item.key}>
                <Link
                  href={fullHref}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* モバイル: 横スクロールタブ風ナビ */}
      <div className="md:hidden">
        <h1 className="mb-4 text-2xl font-bold">{t("heading")}</h1>
        <nav className="flex gap-2 overflow-x-auto border-b pb-2">
          {navItems.map((item) => {
            const fullHref = `/${locale}${item.href}`
            const isActive = pathname.startsWith(fullHref)
            return (
              <Link
                key={item.key}
                href={fullHref}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {t(`nav.${item.key}`)}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
