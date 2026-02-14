"use client"

import { EyeIcon, XCircleIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import type { NotificationListItem } from "../../../types/notification"
import { AudienceType, NotificationStatus } from "../../../types/notification"
import { NotificationStatusBadge } from "../NotificationStatusBadge"

type NotificationRowProps = {
  notification: NotificationListItem
  onCancel: (id: string, title: string) => void
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const audienceLabels: Record<number, string> = {
  [AudienceType.ALL]: "全ユーザー",
  [AudienceType.SEGMENT]: "セグメント",
  [AudienceType.SINGLE]: "個別"
}

export const NotificationRow = ({
  notification,
  onCancel
}: NotificationRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{notification.title}</TableCell>
      <TableCell className="max-w-[200px]">
        <span className="text-muted-foreground">{notification.subject}</span>
      </TableCell>
      <TableCell>{formatDateTime(notification.sendAt)}</TableCell>
      <TableCell>{audienceLabels[notification.audienceType] ?? "-"}</TableCell>
      <TableCell>
        <NotificationStatusBadge status={notification.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/notifications/${notification.id}`}>
              <EyeIcon className="size-4" />
              <span className="sr-only">詳細</span>
            </Link>
          </Button>
          {notification.status === NotificationStatus.SCHEDULED && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onCancel(notification.id, notification.title)}
            >
              <XCircleIcon className="size-4" />
              <span className="sr-only">キャンセル</span>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
