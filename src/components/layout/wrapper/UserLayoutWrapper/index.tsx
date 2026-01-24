"use client"

import type { PropsWithChildren } from "react"
import { UserAccountButton } from "@/components/layout/account/UserAccountButton"

export const UserLayoutWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-14 items-center justify-end">
          <UserAccountButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
