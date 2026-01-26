export interface CancelSubscriptionUseCasePortInput {
  cancelAtPeriodEnd?: boolean
}

export interface CancelSubscriptionUseCasePortOutput {
  subscriptionId: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: Date | null
}

export interface CancelSubscriptionUseCasePort {
  handle(
    input?: CancelSubscriptionUseCasePortInput
  ): Promise<CancelSubscriptionUseCasePortOutput>
}

export const CancelSubscriptionUseCasePortToken = Symbol(
  "CancelSubscriptionUseCasePort"
)
