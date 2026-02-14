"use client"

import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { NotificationStatusBadge } from "@/features/admin-notifications/components/ui/NotificationStatusBadge"
import {
  AudienceType,
  NotificationStatus
} from "@/features/admin-notifications/types/notification"
import type { NotificationDetail } from "@/features/admin-notifications/types/notification-detail"
import { NotificationBodyPreview } from "./notification-body-preview"

type NotificationDetailViewProps = {
  notification: NotificationDetail
  onEdit: () => void
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

export const NotificationDetailView = ({
  notification,
  onEdit
}: NotificationDetailViewProps) => {
  const isScheduled = notification.status === NotificationStatus.SCHEDULED

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>基本情報</CardTitle>
            {isScheduled && (
              <Button variant="outline" onClick={onEdit} className="gap-2">
                <PencilIcon className="size-4" />
                編集
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <DetailItem label="タイトル" value={notification.title} />
            <Separator />
            <DetailItem label="件名" value={notification.subject} />
            <Separator />
            <DetailItem
              label="送信日時"
              value={formatDateTime(notification.sendAt)}
            />
            <Separator />
            <DetailItem
              label="対象タイプ"
              value={audienceLabels[notification.audienceType] ?? "不明"}
            />
            {notification.audiencePayload && (
              <>
                <Separator />
                <div>
                  <dt className="mb-1 text-sm font-medium text-muted-foreground">
                    対象条件
                  </dt>
                  <dd>
                    <pre className="rounded-md bg-muted p-3 text-sm">
                      {JSON.stringify(notification.audiencePayload, null, 2)}
                    </pre>
                  </dd>
                </div>
              </>
            )}
            <Separator />
            <div>
              <dt className="mb-1 text-sm font-medium text-muted-foreground">
                ステータス
              </dt>
              <dd>
                <NotificationStatusBadge status={notification.status} />
              </dd>
            </div>
            {notification.schedulerName && (
              <>
                <Separator />
                <DetailItem
                  label="Scheduler名"
                  value={notification.schedulerName}
                />
              </>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="作成日時"
                value={formatDateTime(notification.createdAt)}
              />
              <DetailItem
                label="更新日時"
                value={formatDateTime(notification.updatedAt)}
              />
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>メール本文</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationBodyPreview
            bodyText={notification.bodyText}
            bodyHtml={notification.bodyHtml}
          />
        </CardContent>
      </Card>
    </div>
  )
}

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <dt className="mb-1 text-sm font-medium text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}
