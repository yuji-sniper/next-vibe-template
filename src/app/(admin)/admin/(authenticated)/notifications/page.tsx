import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { NOTIFICATIONS_PER_PAGE } from "@/features/admin-notifications/hooks/queries/useGetNotificationsQuery"
import { getNotificationsQuery } from "@/features/admin-notifications/queries/get-notifications"
import { adminNotificationsWithFilterKey } from "@/features/admin-notifications/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { NotificationsContainer } from "./_components/container"

export const metadata: Metadata = {
  title: "お知らせ管理",
  description: "お知らせ管理ページです。"
}

export default function NotificationsPage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: adminNotificationsWithFilterKey({ page: 1 }),
    queryFn: () =>
      getNotificationsQuery({ limit: NOTIFICATIONS_PER_PAGE, offset: 0 })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationsContainer />
    </HydrationBoundary>
  )
}
