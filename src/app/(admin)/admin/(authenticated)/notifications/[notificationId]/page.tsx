import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getNotificationByIdQuery } from "@/features/admin-notifications/queries/get-notification-by-id"
import { adminNotificationDetailKey } from "@/features/admin-notifications/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { NotificationDetailContainer } from "./_components/container"

type Props = {
  params: Promise<{ notificationId: string }>
}

export const metadata: Metadata = {
  title: "お知らせ詳細",
  description: "お知らせ詳細ページです。"
}

export default async function NotificationDetailPage({ params }: Props) {
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
      <NotificationDetailContainer notificationId={notificationId} />
    </HydrationBoundary>
  )
}
