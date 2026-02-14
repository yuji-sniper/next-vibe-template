"use client"

import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationStatusBadge } from "@/features/admin-notifications/components/ui/NotificationStatusBadge"
import type { NotificationDetail } from "@/features/admin-notifications/types/notification-detail"
import type { NotificationFormValues } from "@/features/admin-notifications/types/notification-form"
import { NotificationForm } from "../../_components/notification-form"
import { DeliveryList } from "./delivery-list"
import { NotificationDetailView } from "./notification-detail-view"

type NotificationDetailPresentationalProps = {
  notificationId: string
  notification: NotificationDetail | null
  isLoading: boolean
  isEditing: boolean
  isUpdatePending: boolean
  defaultValues: Partial<NotificationFormValues>
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (values: NotificationFormValues) => void
  onBack: () => void
}

export const NotificationDetailPresentational = ({
  notificationId,
  notification,
  isLoading,
  isEditing,
  isUpdatePending,
  defaultValues,
  onEdit,
  onCancelEdit,
  onUpdate,
  onBack
}: NotificationDetailPresentationalProps) => {
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="mb-4 h-8 w-64" />
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
      </div>
    )
  }

  if (!notification) {
    return null
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          お知らせ一覧に戻る
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold">{notification.title}</h1>
        <NotificationStatusBadge status={notification.status} />
      </div>

      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">詳細</TabsTrigger>
          <TabsTrigger value="deliveries">配信結果</TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="mt-6">
          {isEditing ? (
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
          ) : (
            <NotificationDetailView
              notification={notification}
              onEdit={onEdit}
            />
          )}
        </TabsContent>

        <TabsContent value="deliveries" className="mt-6">
          <DeliveryList notificationId={notificationId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
