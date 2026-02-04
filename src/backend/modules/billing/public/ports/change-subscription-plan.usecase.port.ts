export interface ChangeSubscriptionPlanUseCasePortInput {
  newPriceId: string
}

export interface ChangeSubscriptionPlanUseCasePortOutput {
  subscriptionId: string
  stripePriceId: string
}

export interface ChangeSubscriptionPlanUseCasePort {
  handle(
    input: ChangeSubscriptionPlanUseCasePortInput
  ): Promise<ChangeSubscriptionPlanUseCasePortOutput>
}

export const ChangeSubscriptionPlanUseCasePortToken = Symbol(
  "ChangeSubscriptionPlanUseCasePort"
)
