"use client"

import { useMutation } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useGetAuthAdminQuery } from "@/features/auth-admin/hooks/queries/useGetAuthAdminQuery"
import { authAdminClient } from "@/lib/better-auth/auth-admin-client"
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

export function AuthAdminMenu() {
  const popoverId = useId()
  const router = useRouter()

  const { data } = useGetAuthAdminQuery({ orError: false })
  const authAdmin = data?.authAdmin

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authAdminClient.signOut()
    },
    onSuccess: () => {
      getQueryClient().clear()
      router.push("/sign-in")
    }
  })

  if (!authAdmin) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-full transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="アカウントメニューを開く"
        >
          <Avatar>
            {authAdmin.image ? (
              <AvatarImage src={authAdmin.image} alt={authAdmin.name} />
            ) : null}
            <AvatarFallback>{getInitials(authAdmin.name)}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent id={popoverId} align="end" className="w-64 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-medium">{authAdmin.name}</p>
          <p className="text-xs text-muted-foreground">{authAdmin.email}</p>
        </div>
        <div className="p-1">
          <button
            type="button"
            onClick={() => signOutMutation.mutate()}
            disabled={signOutMutation.isPending}
            className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent disabled:opacity-50"
          >
            <LogOut className="size-4" />
            {signOutMutation.isPending ? "ログアウト中..." : "ログアウト"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
