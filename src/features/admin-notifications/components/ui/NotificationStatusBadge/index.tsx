"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/shadcn/utils"
import { NotificationStatus } from "../../../types/notification"

type NotificationStatusBadgeProps = {
  status: number
}

const statusConfig: Record<
  number,
  { label: string; className: string; variant: "outline" | "secondary" }
> = {
  [NotificationStatus.SCHEDULED]: {
    label: "予約済み",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    variant: "outline"
  },
  [NotificationStatus.PROCESSING]: {
    label: "処理中",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    variant: "outline"
  },
  [NotificationStatus.COMPLETED]: {
    label: "送信完了",
    className: "border-green-200 bg-green-50 text-green-700",
    variant: "secondary"
  },
  [NotificationStatus.CANCELLED]: {
    label: "キャンセル",
    className: "bg-muted text-muted-foreground",
    variant: "secondary"
  }
}

export const NotificationStatusBadge = ({
  status
}: NotificationStatusBadgeProps) => {
  const config = statusConfig[status]

  if (!config) {
    return <Badge variant="outline">不明</Badge>
  }

  return (
    <Badge variant={config.variant} className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
