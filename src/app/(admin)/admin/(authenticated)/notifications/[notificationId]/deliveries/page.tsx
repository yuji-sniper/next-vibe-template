import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { DELIVERIES_PER_PAGE } from "@/features/admin-notifications/hooks/queries/useGetDeliveriesQuery"
import { getDeliveriesQuery } from "@/features/admin-notifications/queries/get-deliveries"
import { adminDeliveriesWithFilterKey } from "@/features/admin-notifications/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { DeliveriesContainer } from "./_components/container"

type Props = {
  params: Promise<{ notificationId: string }>
}

export const metadata: Metadata = {
  title: "配信結果",
  description: "お知らせの配信結果ページです。"
}

export default async function DeliveriesPage({ params }: Props) {
  const { notificationId } = await params
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: adminDeliveriesWithFilterKey({
      notificationId,
      page: 1
    }),
    queryFn: () =>
      getDeliveriesQuery({
        notificationId,
        limit: DELIVERIES_PER_PAGE,
        offset: 0
      })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DeliveriesContainer notificationId={notificationId} />
    </HydrationBoundary>
  )
}
