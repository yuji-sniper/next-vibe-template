/**
 * 課金間隔の型定義
 */
export type BillingInterval = "month" | "year"

/**
 * 価格の種類
 */
export type PriceType = "one_time" | "recurring"

export const PRICE_TYPE = {
  ONE_TIME: "one_time",
  RECURRING: "recurring"
} as const satisfies Record<string, PriceType>

/**
 * 価格情報
 */
export type Price = {
  id: string
  stripePriceId: string
  unitAmount: number
  currency: string
  type: PriceType
  recurringInterval: string | null
  displayName: string | null
}

/**
 * 商品情報
 */
export type Product = {
  id: string
  name: string
  description: string | null
  features: string[] | null
  displayOrder: number
}

/**
 * プラン（商品 + 価格一覧）
 */
export type Plan = {
  product: Product
  prices: Price[]
}
