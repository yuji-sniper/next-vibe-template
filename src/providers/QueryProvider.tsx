"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { getQueryClient } from "../lib/react-query/query-client"

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
