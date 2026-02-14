"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationStatusBadge } from "@/features/admin-notifications/components/ui/NotificationStatusBadge"
import { useGetNotificationByIdQuery } from "@/features/admin-notifications/hooks/queries/useGetNotificationByIdQuery"

type NotificationDetailHeaderProps = {
  notificationId: string
}

export const NotificationDetailHeader = ({
  notificationId
}: NotificationDetailHeaderProps) => {
  const router = useRouter()
  const { data, isLoading } = useGetNotificationByIdQuery({ notificationId })
  const notification = data?.notification

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/notifications")}
          className="gap-2"
        >
          <ArrowLeftIcon className="size-4" />
          お知らせ一覧に戻る
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20" />
          </>
        ) : notification ? (
          <>
            <h1 className="text-2xl font-bold">{notification.title}</h1>
            <NotificationStatusBadge status={notification.status} />
          </>
        ) : null}
      </div>
    </div>
  )
}
