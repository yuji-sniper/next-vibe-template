/**
 * サブスクリプションのステータス
 */
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid"
  | "paused"

/**
 * サブスクリプションに紐づくプロダクト情報
 */
export type SubscriptionProduct = {
  id: string
  name: string
  description: string | null
  features: string[] | null
  price: {
    id: string
    stripePriceId: string | null
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
  }
}

/**
 * サブスクリプション情報
 */
export type Subscription = {
  id: string
  customerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  status: SubscriptionStatus
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
  product?: SubscriptionProduct
}
