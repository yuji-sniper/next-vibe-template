import type { Price } from "./price"

export type ProductDetail = {
  id: string
  stripeProductId: string | null
  name: string
  description: string | null
  active: boolean
  displayOrder: number
  features: string[] | null
  metadata: Record<string, string> | null
  createdAt: string
  updatedAt: string
  prices: Price[]
}
