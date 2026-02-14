"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCreateNotificationMutation } from "@/features/admin-notifications/hooks/mutations/useCreateNotificationMutation"
import type { NotificationFormValues } from "@/features/admin-notifications/types/notification-form"
import { NotificationCreatePresentational } from "./presentational"

export const NotificationCreateContainer = () => {
  const router = useRouter()
  const createMutation = useCreateNotificationMutation()

  const handleSubmit = async (values: NotificationFormValues) => {
    try {
      await createMutation.mutateAsync(values)
      toast.success("お知らせを予約しました")
      router.push("/notifications")
    } catch {
      toast.error("お知らせの予約に失敗しました")
    }
  }

  const handleCancel = () => {
    router.push("/notifications")
  }

  return (
    <NotificationCreatePresentational
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={createMutation.isPending}
    />
  )
}
