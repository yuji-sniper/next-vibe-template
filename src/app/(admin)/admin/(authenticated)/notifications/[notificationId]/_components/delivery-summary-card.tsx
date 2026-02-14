"use client"

import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  MailIcon,
  SendIcon,
  ShieldOffIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DeliverySummary } from "@/features/admin-notifications/types/delivery"

type DeliverySummaryCardProps = {
  summary: DeliverySummary
}

export const DeliverySummaryCard = ({ summary }: DeliverySummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>配信サマリー</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <SummaryItem
            icon={<MailIcon className="size-4 text-muted-foreground" />}
            label="合計"
            value={summary.total}
          />
          <SummaryItem
            icon={<ClockIcon className="size-4 text-blue-500" />}
            label="保留"
            value={summary.pending}
          />
          <SummaryItem
            icon={<SendIcon className="size-4 text-yellow-500" />}
            label="送信中"
            value={summary.sending}
          />
          <SummaryItem
            icon={<CheckCircleIcon className="size-4 text-green-500" />}
            label="送信済み"
            value={summary.sent}
          />
          <SummaryItem
            icon={<AlertCircleIcon className="size-4 text-red-500" />}
            label="失敗"
            value={summary.failed}
          />
          <SummaryItem
            icon={<ShieldOffIcon className="size-4 text-muted-foreground" />}
            label="抑制"
            value={summary.suppressed}
          />
        </div>
      </CardContent>
    </Card>
  )
}

const SummaryItem = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: number
}) => {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  )
}
