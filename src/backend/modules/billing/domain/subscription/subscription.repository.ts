import type { Subscription } from "./subscription"

export const SubscriptionRepositoryToken = Symbol("SubscriptionRepository")

export interface SubscriptionRepository {
  findById(id: string): Promise<Subscription | undefined>
  findByCustomerId(customerId: string): Promise<Subscription | undefined>
  findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | undefined>
  save(subscription: Subscription): Promise<void>
  delete(id: string): Promise<void>
}
