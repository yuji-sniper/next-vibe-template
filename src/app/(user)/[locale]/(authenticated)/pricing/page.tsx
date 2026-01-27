import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { setRequestLocale } from "next-intl/server"
import { getActivePlansQuery } from "@/features/pricing/queries/get-active-plans"
import { activePlansKey } from "@/features/pricing/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { PricingContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: activePlansKey,
    queryFn: getActivePlansQuery
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricingContainer />
    </HydrationBoundary>
  )
}
