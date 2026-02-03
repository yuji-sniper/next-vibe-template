import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "ダッシュボード",
  description: "ダッシュボードページです。"
}

export default function DashboardPage() {
  return (
    <div>
      <h1>ダッシュボード</h1>
    </div>
  )
}
