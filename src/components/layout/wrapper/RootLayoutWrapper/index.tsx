"use client"

import type { PropsWithChildren } from "react"
import { QueryProvider } from "@/providers/QueryProvider"

export const RootLayoutWrapper = ({ children }: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>
}
