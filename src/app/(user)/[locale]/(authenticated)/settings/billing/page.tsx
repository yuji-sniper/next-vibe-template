import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getInvoiceHistoryQuery } from "@/features/billing/queries/get-invoice-history"
import { invoiceHistoryKey } from "@/features/billing/queries/keys"
import { getSubscriptionQuery } from "@/features/pricing/queries/get-subscription"
import { subscriptionKey } from "@/features/pricing/queries/keys"
import { getQueryClient } from "@/lib/react-query/query-client"
import { BillingSettingsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: "metadata.billingSettings"
  })

  return {
    title: t("title"),
    description: t("description")
  }
}

export default async function BillingSettingsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: subscriptionKey(true),
      queryFn: () => getSubscriptionQuery(true)
    }),
    queryClient.prefetchQuery({
      queryKey: invoiceHistoryKey(),
      queryFn: getInvoiceHistoryQuery
    })
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingSettingsContainer />
    </HydrationBoundary>
  )
}
