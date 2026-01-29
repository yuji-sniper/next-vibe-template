"use client"

import { AppProgressProvider, Progress } from "@bprogress/next"
import type { PropsWithChildren } from "react"

export const ProgressBarProvider = ({ children }: PropsWithChildren) => {
  return (
    <AppProgressProvider
      height="2px"
      color="oklch(0.205 0 0)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
      <Progress />
    </AppProgressProvider>
  )
}
