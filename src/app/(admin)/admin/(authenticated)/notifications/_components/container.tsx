"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useCancelNotificationMutation } from "@/features/admin-notifications/hooks/mutations/useCancelNotificationMutation"
import {
  NOTIFICATIONS_PER_PAGE,
  useGetNotificationsQuery
} from "@/features/admin-notifications/hooks/queries/useGetNotificationsQuery"
import type { NotificationFilterStatus } from "@/features/admin-notifications/types/notification"
import { NotificationsPresentational } from "./presentational"

export const NotificationsContainer = () => {
  const [filterStatus, setFilterStatus] =
    useState<NotificationFilterStatus>("all")
  const [page, setPage] = useState(1)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<{
    id: string
    title: string
  } | null>(null)

  const status = filterStatus === "all" ? undefined : filterStatus

  const { data, isLoading } = useGetNotificationsQuery({ status, page })

  const cancelMutation = useCancelNotificationMutation()

  const handleFilterChange = (newFilter: NotificationFilterStatus) => {
    setFilterStatus(newFilter)
    setPage(1)
  }

  const handleCancelConfirm = (id: string, title: string) => {
    setSelectedNotification({ id, title })
    setCancelDialogOpen(true)
  }

  const handleCancel = async () => {
    if (!selectedNotification) return

    try {
      await cancelMutation.mutateAsync({ id: selectedNotification.id })
      toast.success("通知をキャンセルしました")
      setCancelDialogOpen(false)
      setSelectedNotification(null)
    } catch {
      toast.error("通知のキャンセルに失敗しました")
    }
  }

  const handleCancelDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedNotification(null)
    }
    setCancelDialogOpen(open)
  }

  const totalPages = Math.ceil((data?.total ?? 0) / NOTIFICATIONS_PER_PAGE)

  return (
    <NotificationsPresentational
      notifications={data?.notifications ?? []}
      isLoading={isLoading}
      filterStatus={filterStatus}
      onFilterChange={handleFilterChange}
      onCancelConfirm={handleCancelConfirm}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      cancelDialogOpen={cancelDialogOpen}
      cancelDialogNotificationTitle={selectedNotification?.title ?? ""}
      isCanceling={cancelMutation.isPending}
      onCancelDialogOpenChange={handleCancelDialogOpenChange}
      onCancel={handleCancel}
    />
  )
}
