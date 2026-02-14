import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { getNotificationByIdQuery } from "@/features/admin-notifications/queries/get-notification-by-id"
import { adminNotificationDetailKey } from "@/features/admin-notifications/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { NotificationDetailHeader } from "./_components/notification-detail-header"
import { NotificationDetailNav } from "./_components/notification-detail-nav"

type Props = {
  children: React.ReactNode
  params: Promise<{ notificationId: string }>
}

export default async function NotificationDetailLayout({
  children,
  params
}: Props) {
  const { notificationId } = await params
  const queryClient = getQueryClient()

  try {
    await queryClient.fetchQuery({
      queryKey: adminNotificationDetailKey(notificationId),
      queryFn: () => getNotificationByIdQuery({ id: notificationId })
    })
  } catch {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container max-w-4xl py-8">
        <NotificationDetailHeader notificationId={notificationId} />
        <NotificationDetailNav notificationId={notificationId} />
        {children}
      </div>
    </HydrationBoundary>
  )
}
