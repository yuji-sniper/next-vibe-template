"use client"

import type { PropsWithChildren } from "react"
import { AuthUserMenu } from "@/features/auth/components/layout/AuthUserMenu"

export const AuthUserLayoutWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-14 items-center justify-end">
          <AuthUserMenu />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
