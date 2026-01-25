import { injectable } from "tsyringe"
import { SubscriptionCheckoutSessionFailedError } from "@/backend/modules/billing/domain/subscription/subscription.errors"
import type {
  CreateSubscriptionCheckoutSessionPort,
  CreateSubscriptionCheckoutSessionPortInput,
  CreateSubscriptionCheckoutSessionPortOutput
} from "../../application/commands/ports/create-subscription-checkout-session.port"
import { stripe } from "./stripe-client"

@injectable()
export class CreateSubscriptionCheckoutSessionStripeAdapter
  implements CreateSubscriptionCheckoutSessionPort
{
  async handle(
    input: CreateSubscriptionCheckoutSessionPortInput
  ): Promise<CreateSubscriptionCheckoutSessionPortOutput> {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: input.stripeCustomerId,
        line_items: [
          {
            price: input.priceId,
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl
      })

      if (!session.url) {
        throw new SubscriptionCheckoutSessionFailedError()
      }

      return {
        sessionId: session.id,
        sessionUrl: session.url
      }
    } catch (error) {
      if (error instanceof SubscriptionCheckoutSessionFailedError) {
        throw error
      }
      throw new SubscriptionCheckoutSessionFailedError()
    }
  }
}
