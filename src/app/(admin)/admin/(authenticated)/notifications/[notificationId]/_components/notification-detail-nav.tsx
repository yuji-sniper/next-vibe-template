"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/shadcn/utils"

type NotificationDetailNavProps = {
  notificationId: string
}

const navItems = [
  { label: "詳細", href: "" },
  { label: "配信結果", href: "/deliveries" }
]

export const NotificationDetailNav = ({
  notificationId
}: NotificationDetailNavProps) => {
  const pathname = usePathname()
  const basePath = `/notifications/${notificationId}`

  return (
    <nav className="mb-6 flex gap-1 border-b">
      {navItems.map((item) => {
        const fullHref = `${basePath}${item.href}`
        const isActive =
          item.href === ""
            ? pathname.endsWith(basePath)
            : pathname.endsWith(fullHref)

        return (
          <Link
            key={item.href}
            href={fullHref}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
