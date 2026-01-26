export interface ChangeSubscriptionPlanPortInput {
  stripeSubscriptionId: string
  newPriceId: string
}

export interface ChangeSubscriptionPlanPortOutput {
  stripeSubscriptionId: string
  stripePriceId: string
}

export interface ChangeSubscriptionPlanPort {
  handle(
    input: ChangeSubscriptionPlanPortInput
  ): Promise<ChangeSubscriptionPlanPortOutput>
}

export const ChangeSubscriptionPlanPortToken = Symbol(
  "ChangeSubscriptionPlanPort"
)
