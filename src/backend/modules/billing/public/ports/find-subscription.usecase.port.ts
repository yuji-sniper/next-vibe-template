import type { SubscriptionStatus } from "@/backend/modules/billing/internal/domain/subscription/subscription"

export interface FindSubscriptionUseCasePortInput {
  includeProduct?: boolean
}

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
        product?: {
          id: string
          name: string
          description: string | null
          features: string[] | null
          price: {
            id: string
            stripePriceId: string | null
            unitAmount: number
            currency: string
            type: "one_time" | "recurring"
            recurringInterval: string | null
            displayName: string | null
          }
        }
      }
    | undefined
}

export interface FindSubscriptionUseCasePort {
  handle(
    input?: FindSubscriptionUseCasePortInput
  ): Promise<FindSubscriptionUseCasePortOutput>
}

export const FindSubscriptionUseCasePortToken = Symbol(
  "FindSubscriptionUseCasePort"
)
