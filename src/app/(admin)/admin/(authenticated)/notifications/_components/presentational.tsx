"use client"

import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CancelNotificationDialog } from "@/features/admin-notifications/components/ui/CancelNotificationDialog"
import { NotificationFilter } from "@/features/admin-notifications/components/ui/NotificationFilter"
import { NotificationPagination } from "@/features/admin-notifications/components/ui/NotificationPagination"
import { NotificationTable } from "@/features/admin-notifications/components/ui/NotificationTable"
import type {
  NotificationFilterStatus,
  NotificationListItem
} from "@/features/admin-notifications/types/notification"

type NotificationsPresentationalProps = {
  notifications: NotificationListItem[]
  isLoading: boolean
  filterStatus: NotificationFilterStatus
  onFilterChange: (status: NotificationFilterStatus) => void
  onCancelConfirm: (id: string, title: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  cancelDialogOpen: boolean
  cancelDialogNotificationTitle: string
  isCanceling: boolean
  onCancelDialogOpenChange: (open: boolean) => void
  onCancel: () => void
}

export const NotificationsPresentational = ({
  notifications,
  isLoading,
  filterStatus,
  onFilterChange,
  onCancelConfirm,
  page,
  totalPages,
  onPageChange,
  cancelDialogOpen,
  cancelDialogNotificationTitle,
  isCanceling,
  onCancelDialogOpenChange,
  onCancel
}: NotificationsPresentationalProps) => {
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">お知らせ管理</h1>
        <Button asChild>
          <Link href="/notifications/new">
            <PlusIcon className="size-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <NotificationFilter value={filterStatus} onChange={onFilterChange} />
      </div>

      <div className="rounded-md border">
        <NotificationTable
          notifications={notifications}
          isLoading={isLoading}
          onCancel={onCancelConfirm}
        />
      </div>

      <NotificationPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <CancelNotificationDialog
        open={cancelDialogOpen}
        onOpenChange={onCancelDialogOpenChange}
        notificationTitle={cancelDialogNotificationTitle}
        isCanceling={isCanceling}
        onCancel={onCancel}
      />
    </div>
  )
}
