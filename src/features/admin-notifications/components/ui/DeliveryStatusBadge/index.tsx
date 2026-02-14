"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/shadcn/utils"
import { DeliveryStatus } from "../../../types/delivery"

type DeliveryStatusBadgeProps = {
  status: number
}

const statusConfig: Record<
  number,
  { label: string; className: string; variant: "outline" | "secondary" }
> = {
  [DeliveryStatus.PENDING]: {
    label: "保留",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    variant: "outline"
  },
  [DeliveryStatus.SENDING]: {
    label: "送信中",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    variant: "outline"
  },
  [DeliveryStatus.RETRYING]: {
    label: "リトライ中",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    variant: "outline"
  },
  [DeliveryStatus.SENT]: {
    label: "送信済み",
    className: "border-green-200 bg-green-50 text-green-700",
    variant: "secondary"
  },
  [DeliveryStatus.FAILED]: {
    label: "失敗",
    className: "border-red-200 bg-red-50 text-red-700",
    variant: "outline"
  },
  [DeliveryStatus.BOUNCED]: {
    label: "バウンス",
    className: "border-red-200 bg-red-50 text-red-700",
    variant: "outline"
  },
  [DeliveryStatus.COMPLAINED]: {
    label: "苦情",
    className: "border-red-200 bg-red-50 text-red-700",
    variant: "outline"
  },
  [DeliveryStatus.SUPPRESSED]: {
    label: "抑制",
    className: "bg-muted text-muted-foreground",
    variant: "secondary"
  },
  [DeliveryStatus.UNSUBSCRIBED]: {
    label: "配信停止",
    className: "bg-muted text-muted-foreground",
    variant: "secondary"
  }
}

export const DeliveryStatusBadge = ({ status }: DeliveryStatusBadgeProps) => {
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
