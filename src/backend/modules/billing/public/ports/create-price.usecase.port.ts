import type {
  PriceType,
  RecurringInterval
} from "@/backend/modules/billing/internal/domain/price/price"

export type CreatePriceUseCaseInput = {
  productId: string // 自社 Product ID
  unitAmount: number
  currency?: string // default: 'jpy'
  type: PriceType
  recurringInterval?: RecurringInterval
  recurringIntervalCount?: number
  displayName?: string
  metadata?: Record<string, string>
}

export type CreatePriceUseCaseOutput = {
  price: {
    id: string
    productId: string
    stripePriceId: string | null
    currency: string
    unitAmount: number
    type: PriceType
    recurringInterval: RecurringInterval | null
    recurringIntervalCount: number
    active: boolean
    displayName: string | null
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}

export interface CreatePriceUseCasePort {
  handle(input: CreatePriceUseCaseInput): Promise<CreatePriceUseCaseOutput>
}

export const CreatePriceUseCasePortToken = Symbol("CreatePriceUseCasePort")
