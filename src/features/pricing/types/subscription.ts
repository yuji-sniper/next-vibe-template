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
}
