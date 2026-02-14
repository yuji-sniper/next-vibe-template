"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { NotificationDetail } from "@/features/admin-notifications/types/notification-detail"
import type { NotificationFormValues } from "@/features/admin-notifications/types/notification-form"
import { NotificationForm } from "../../_components/notification-form"
import { NotificationDetailView } from "./notification-detail-view"

type NotificationDetailPresentationalProps = {
  notification: NotificationDetail | null
  isLoading: boolean
  isEditing: boolean
  isUpdatePending: boolean
  defaultValues: Partial<NotificationFormValues>
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (values: NotificationFormValues) => void
}

export const NotificationDetailPresentational = ({
  notification,
  isLoading,
  isEditing,
  isUpdatePending,
  defaultValues,
  onEdit,
  onCancelEdit,
  onUpdate
}: NotificationDetailPresentationalProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!notification) {
    return null
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>お知らせを編集</CardTitle>
            <Button variant="outline" onClick={onCancelEdit}>
              キャンセル
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <NotificationForm
            mode="edit"
            defaultValues={defaultValues}
            onSubmit={onUpdate}
            isPending={isUpdatePending}
            submitLabel="更新"
          />
        </CardContent>
      </Card>
    )
  }

  return <NotificationDetailView notification={notification} onEdit={onEdit} />
}
