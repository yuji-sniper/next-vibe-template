import type { Price } from "./price"

export interface PriceRepository {
  findById(id: string): Promise<Price | null>
  findByStripePriceId(stripePriceId: string): Promise<Price | null>
  findByProductId(
    productId: string,
    options?: { activeOnly?: boolean }
  ): Promise<Price[]>
  save(price: Price): Promise<void>
}

export const PriceRepositoryToken = Symbol("PriceRepository")
