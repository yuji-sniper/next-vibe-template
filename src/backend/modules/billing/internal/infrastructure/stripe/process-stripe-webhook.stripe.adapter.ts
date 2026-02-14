import type Stripe from "stripe"
import { injectable } from "tsyringe"
import { WebhookVerificationFailedError } from "@/backend/modules/billing/public/errors/webhook-event.errors"
import { env } from "@/env"
import type {
  ProcessStripeWebhookPort,
  ProcessStripeWebhookPortInput,
  ProcessStripeWebhookPortOutput
} from "../../application/ports/process-stripe-webhook.port"
import { stripe } from "./stripe-client"

@injectable()
export class ProcessStripeWebhookStripeAdapter
  implements ProcessStripeWebhookPort
{
  async handle(
    input: ProcessStripeWebhookPortInput
  ): Promise<ProcessStripeWebhookPortOutput> {
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
