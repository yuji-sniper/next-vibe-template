import type { WebhookEvent } from "./webhook-event"

export interface WebhookEventRepository {
  findByStripeEventId(stripeEventId: string): Promise<WebhookEvent | null>
  save(event: WebhookEvent): Promise<void>
}

export const WebhookEventRepositoryToken = Symbol("WebhookEventRepository")
