import type Stripe from "stripe"
import { injectable } from "tsyringe"
import { WebhookVerificationFailedError } from "@/backend/modules/billing/domain/webhook-event/webhook-event.errors"
import { env } from "@/env"
import type {
  ProcessWebhookPort,
  ProcessWebhookPortInput,
  ProcessWebhookPortOutput
} from "../../application/commands/ports/process-webhook.port"
import { stripe } from "./stripe-client"

@injectable()
export class ProcessWebhookStripeAdapter implements ProcessWebhookPort {
  async handle(
    input: ProcessWebhookPortInput
  ): Promise<ProcessWebhookPortOutput> {
    const event = this.verifySignature(input.payload, input.signature)
    return { event }
  }

  private verifySignature(payload: string, signature: string): Stripe.Event {
    try {
      const webhookSecret = env.STRIPE_WEBHOOK_SECRET
      if (!webhookSecret) {
        throw new WebhookVerificationFailedError()
      }
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch {
      throw new WebhookVerificationFailedError()
    }
  }
}
