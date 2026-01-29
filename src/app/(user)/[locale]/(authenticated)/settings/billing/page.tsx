import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { setRequestLocale } from "next-intl/server"
import { getSubscriptionQuery } from "@/features/pricing/queries/get-subscription"
import { subscriptionKey } from "@/features/pricing/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { BillingSettingsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function BillingSettingsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: subscriptionKey(true),
    queryFn: () => getSubscriptionQuery(true)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingSettingsContainer />
    </HydrationBoundary>
  )
}
