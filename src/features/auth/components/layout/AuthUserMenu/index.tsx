"use client"

import { useMutation } from "@tanstack/react-query"
import { ArrowUpCircle, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useId, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useGetAuthUserQuery } from "@/features/auth/hooks/queries/useGetAuthUserQuery"
import { authClient } from "@/lib/better-auth/auth-client"
import { getQueryClient } from "@/lib/react-query/query-client"

/**
 * 名前の最初の2文字を取得する
 * @param name 名前
 * @returns 名前の最初の2文字
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AuthUserMenu() {
  const [open, setOpen] = useState(false)
  const popoverId = useId()
  const t = useTranslations("userAccount")
  const locale = useLocale()
  const router = useRouter()

  const { data } = useGetAuthUserQuery({ orError: false })
  const authUser = data?.authUser

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut()
    },
    onSuccess: () => {
      getQueryClient().clear()
      router.push(`/${locale}/sign-in`)
    }
  })

  if (!authUser) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
          aria-label={t("openMenu")}
        >
          <Avatar>
            {authUser.image ? (
              <AvatarImage src={authUser.image} alt={authUser.name} />
            ) : null}
            <AvatarFallback>{getInitials(authUser.name)}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent id={popoverId} align="end" className="w-64 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-medium">{authUser.name}</p>
          <p className="text-xs text-muted-foreground">{authUser.email}</p>
        </div>
        <div className="p-1">
          <Link
            href={`/${locale}/settings/account`}
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Settings className="size-4" />
            {t("settings")}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <ArrowUpCircle className="size-4" />
            {t("upgradePlan")}
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              signOutMutation.mutate()
            }}
            disabled={signOutMutation.isPending}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="size-4" />
            {signOutMutation.isPending ? t("loggingOut") : t("logout")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
