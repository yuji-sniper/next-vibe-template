export interface ChangeSubscriptionPlanPortInput {
  stripeSubscriptionId: string
  newStripePriceId: string
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
