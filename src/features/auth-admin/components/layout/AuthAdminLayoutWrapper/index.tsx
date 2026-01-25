"use client"

import type { PropsWithChildren } from "react"
import { AuthAdminMenu } from "@/features/auth-admin/components/layout/AuthAdminMenu"

export const AuthAdminLayoutWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-14 items-center justify-end">
          <AuthAdminMenu />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
