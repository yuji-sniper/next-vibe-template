import type { Metadata } from "next"
import { env } from "@/env"

export const metadata: Metadata = {
  title: {
    template: `%s | ${env.NEXT_PUBLIC_SERVICE_NAME_ADMIN}`,
    default: env.NEXT_PUBLIC_SERVICE_NAME_ADMIN
  },
  robots: {
    index: false,
    follow: false
  }
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
