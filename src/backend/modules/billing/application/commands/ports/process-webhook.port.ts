export interface ProcessWebhookPortInput {
  payload: string
  signature: string
}

export interface CheckoutSessionCompletedEvent {
  type: "checkout.session.completed"
  stripeEventId: string
  stripeCustomerId: string | null
  stripePaymentIntentId: string | null
  amountTotal: number
  currency: string
}

export interface PaymentIntentEvent {
  type:
    | "payment_intent.succeeded"
    | "payment_intent.payment_failed"
    | "payment_intent.canceled"
  stripeEventId: string
  stripePaymentIntentId: string
}

export interface UnknownEvent {
  type: "unknown"
  stripeEventId: string
  eventType: string
}

export type WebhookEventData =
  | CheckoutSessionCompletedEvent
  | PaymentIntentEvent
  | UnknownEvent

export interface ProcessWebhookPortOutput {
  event: WebhookEventData
}

export interface ProcessWebhookPort {
  handle(input: ProcessWebhookPortInput): Promise<ProcessWebhookPortOutput>
}

export const ProcessWebhookPortToken = Symbol("ProcessWebhookPort")
