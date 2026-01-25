import type Stripe from "stripe"
import { injectable } from "tsyringe"
import { WebhookVerificationFailedError } from "@/backend/modules/billing/domain/webhook-event/webhook-event.errors"
import { env } from "@/env"
import type {
  ProcessWebhookPort,
  ProcessWebhookPortInput,
  ProcessWebhookPortOutput,
  WebhookEventData
} from "../../application/commands/ports/process-webhook.port"
import { stripe } from "./stripe-client"

@injectable()
export class ProcessWebhookStripeAdapter implements ProcessWebhookPort {
  async handle(
    input: ProcessWebhookPortInput
  ): Promise<ProcessWebhookPortOutput> {
    const event = this.verifySignature(input.payload, input.signature)
    const eventData = this.parseEvent(event)
    return { event: eventData }
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

  private parseEvent(event: Stripe.Event): WebhookEventData {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        return {
          type: "checkout.session.completed",
          stripeEventId: event.id,
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : null,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          amountTotal: session.amount_total ?? 0,
          currency: session.currency ?? "jpy"
        }
      }
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed":
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object
        return {
          type: event.type,
          stripeEventId: event.id,
          stripePaymentIntentId: paymentIntent.id
        }
      }
      default:
        return {
          type: "unknown",
          stripeEventId: event.id,
          eventType: event.type
        }
    }
  }
}
