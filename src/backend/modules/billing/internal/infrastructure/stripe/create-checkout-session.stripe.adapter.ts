import { injectable } from "tsyringe"
import { CheckoutSessionFailedError } from "@/backend/modules/billing/public/errors/checkout-session.errors"
import type {
  CreateCheckoutSessionPort,
  CreateCheckoutSessionPortInput,
  CreateCheckoutSessionPortOutput
} from "../../application/ports/create-checkout-session.port"
import { stripe } from "./stripe-client"

@injectable()
export class CreateCheckoutSessionStripeAdapter
  implements CreateCheckoutSessionPort
{
  async handle(
    input: CreateCheckoutSessionPortInput
  ): Promise<CreateCheckoutSessionPortOutput> {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: input.stripeCustomerId,
        line_items: [
          {
            price: input.stripePriceId,
            quantity: 1
          }
        ],
        mode: input.mode,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        ...(input.mode === "payment" && {
          invoice_creation: { enabled: true }
        })
      })

      if (!session.url) {
        throw new CheckoutSessionFailedError()
      }

      return {
        sessionId: session.id,
        sessionUrl: session.url
      }
    } catch (error) {
      if (error instanceof CheckoutSessionFailedError) {
        throw error
      }
      throw new CheckoutSessionFailedError()
    }
  }
}
