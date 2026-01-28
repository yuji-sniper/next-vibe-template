import type { Product } from "./product"

export interface ProductRepository {
  findById(id: string): Promise<Product | null>
  findByStripeProductId(stripeProductId: string): Promise<Product | null>
  findAll(options?: { activeOnly?: boolean }): Promise<Product[]>
  save(product: Product): Promise<void>
}

export const ProductRepositoryToken = Symbol("ProductRepository")
