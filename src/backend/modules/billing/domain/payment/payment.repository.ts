import type { Payment } from "./payment"

export interface PaymentRepository {
  findByCustomerId(customerId: string): Promise<Payment[]>
  findByStripePaymentIntentId(
    stripePaymentIntentId: string
  ): Promise<Payment | null>
  save(payment: Payment): Promise<void>
}

export const PaymentRepositoryToken = Symbol("PaymentRepository")
