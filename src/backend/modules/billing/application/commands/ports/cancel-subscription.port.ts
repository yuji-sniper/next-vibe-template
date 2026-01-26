export interface CancelSubscriptionPortInput {
  stripeSubscriptionId: string
  cancelAtPeriodEnd?: boolean
}

export interface CancelSubscriptionPortOutput {
  stripeSubscriptionId: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: number | null
}

export interface CancelSubscriptionPort {
  handle(
    input: CancelSubscriptionPortInput
  ): Promise<CancelSubscriptionPortOutput>
}

export const CancelSubscriptionPortToken = Symbol("CancelSubscriptionPort")
