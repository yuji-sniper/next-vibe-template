import type { SubscriptionStatus } from "@/backend/modules/billing/domain/subscription/subscription"

export interface FindSubscriptionUseCasePortOutput {
  subscription:
    | {
        id: string
        customerId: string
        stripeSubscriptionId: string
        stripePriceId: string
        status: SubscriptionStatus
        currentPeriodStart: Date | null
        currentPeriodEnd: Date | null
        cancelAtPeriodEnd: boolean
        createdAt: Date
        updatedAt: Date
      }
    | undefined
}

export interface FindSubscriptionUseCasePort {
  handle(): Promise<FindSubscriptionUseCasePortOutput>
}

export const FindSubscriptionUseCasePortToken = Symbol(
  "FindSubscriptionUseCasePort"
)
