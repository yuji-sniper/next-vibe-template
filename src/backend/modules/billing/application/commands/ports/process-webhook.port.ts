import type Stripe from "stripe"

export interface ProcessWebhookPortInput {
  payload: string
  signature: string
}

export interface ProcessWebhookPortOutput {
  event: Stripe.Event
}

export interface ProcessWebhookPort {
  handle(input: ProcessWebhookPortInput): Promise<ProcessWebhookPortOutput>
}

export const ProcessWebhookPortToken = Symbol("ProcessWebhookPort")
