import type Stripe from "stripe"

export interface ProcessStripeWebhookPortInput {
  payload: string
  signature: string
}

export interface ProcessStripeWebhookPortOutput {
  event: Stripe.Event
}

export interface ProcessStripeWebhookPort {
  handle(
    input: ProcessStripeWebhookPortInput
  ): Promise<ProcessStripeWebhookPortOutput>
}

export const ProcessStripeWebhookPortToken = Symbol("ProcessStripeWebhookPort")
