"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useUpdateNotificationMutation } from "@/features/admin-notifications/hooks/mutations/useUpdateNotificationMutation"
import { useGetNotificationByIdQuery } from "@/features/admin-notifications/hooks/queries/useGetNotificationByIdQuery"
import type { NotificationFormValues } from "@/features/admin-notifications/types/notification-form"
import { NotificationDetailPresentational } from "./presentational"

type NotificationDetailContainerProps = {
  notificationId: string
}

export const NotificationDetailContainer = ({
  notificationId
}: NotificationDetailContainerProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { data, isLoading } = useGetNotificationByIdQuery({ notificationId })
  const updateMutation = useUpdateNotificationMutation()

  const notification = data?.notification

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleUpdate = async (values: NotificationFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: notificationId,
        ...values
      })
      toast.success("お知らせを更新しました")
      setIsEditing(false)
    } catch {
      toast.error("お知らせの更新に失敗しました")
    }
  }

  const defaultValues: Partial<NotificationFormValues> = notification
    ? {
        title: notification.title,
        subject: notification.subject,
        bodyText: notification.bodyText,
        bodyHtml: notification.bodyHtml ?? "",
        sendAt: new Date(notification.sendAt),
        audienceType:
          notification.audienceType as NotificationFormValues["audienceType"],
        audiencePayload: notification.audiencePayload ?? undefined
      }
    : {}

  return (
    <NotificationDetailPresentational
      notification={notification ?? null}
      isLoading={isLoading}
      isEditing={isEditing}
      isUpdatePending={updateMutation.isPending}
      defaultValues={defaultValues}
      onEdit={handleEdit}
      onCancelEdit={handleCancelEdit}
      onUpdate={handleUpdate}
    />
  )
}
