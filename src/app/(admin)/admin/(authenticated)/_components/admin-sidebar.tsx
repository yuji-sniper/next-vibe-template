"use client"

import { Bell, LayoutDashboard, LogOut, Package } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { useGetAuthAdminQuery } from "@/features/auth-admin/hooks/queries/useGetAuthAdminQuery"
import { useSignOutAdmin } from "../_hooks/use-sign-out-admin"

const navItems = [
  {
    title: "ダッシュボード",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "商品管理",
    href: "/products",
    icon: Package
  },
  {
    title: "お知らせ管理",
    href: "/notifications",
    icon: Bell
  }
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { data } = useGetAuthAdminQuery({ orError: false })
  const authAdmin = data?.authAdmin
  const { signOut, isPending } = useSignOutAdmin()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">A</span>
          </div>
          <span className="text-lg font-semibold">Admin</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {authAdmin && (
          <>
            <SidebarSeparator />
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="size-8">
                {authAdmin.image ? (
                  <AvatarImage src={authAdmin.image} alt={authAdmin.name} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {getInitials(authAdmin.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col truncate">
                <span className="truncate text-sm font-medium">
                  {authAdmin.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {authAdmin.email}
                </span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={signOut}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  <span>{isPending ? "ログアウト中..." : "ログアウト"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
