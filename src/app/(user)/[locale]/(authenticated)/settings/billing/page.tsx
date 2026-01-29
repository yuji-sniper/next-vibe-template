import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { setRequestLocale } from "next-intl/server"
import { getActivePlansQuery } from "@/features/pricing/queries/get-active-plans"
import { getSubscriptionQuery } from "@/features/pricing/queries/get-subscription"
import {
  activePlansKey,
  subscriptionKey
} from "@/features/pricing/queries/keys"
import { PRICE_TYPE } from "@/features/pricing/types/plan"
import { getQueryClient } from "@/lib/react-query/query-client"
import { BillingSettingsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

const BILLING_PAGE_PRICE_TYPE = PRICE_TYPE.RECURRING

export default async function BillingSettingsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: subscriptionKey,
      queryFn: getSubscriptionQuery
    }),
    queryClient.prefetchQuery({
      queryKey: activePlansKey(BILLING_PAGE_PRICE_TYPE),
      queryFn: () => getActivePlansQuery(BILLING_PAGE_PRICE_TYPE)
    })
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingSettingsContainer />
    </HydrationBoundary>
  )
}
