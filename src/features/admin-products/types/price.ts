export type Price = {
  id: string
  productId: string
  stripePriceId: string | null
  unitAmount: number
  currency: string
  type: "one_time" | "recurring"
  recurringInterval: string | null
  recurringIntervalCount: number
  displayName: string | null
  active: boolean
  metadata: Record<string, string> | null
  createdAt: string
  updatedAt: string
}
