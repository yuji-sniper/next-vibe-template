export type Product = {
  id: string
  stripeProductId: string | null
  name: string
  description: string | null
  active: boolean
  displayOrder: number
  features: string[] | null
  metadata: Record<string, string> | null
  priceCount: number
  createdAt: string
  updatedAt: string
  prices?: {
    id: string
    stripePriceId: string | null
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
    active: boolean
  }[]
}

export type ProductFilterStatus = "all" | "active" | "archived"
