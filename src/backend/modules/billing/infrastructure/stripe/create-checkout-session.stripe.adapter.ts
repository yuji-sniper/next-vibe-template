import { injectable } from "tsyringe"
import { PaymentCreateFailedError } from "@/backend/modules/billing/domain/payment/payment.errors"
import type {
  CreateCheckoutSessionPort,
  CreateCheckoutSessionPortInput,
  CreateCheckoutSessionPortOutput
} from "../../application/commands/ports/create-checkout-session.port"
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
            price: input.priceId,
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl
      })

      if (!session.url) {
        throw new PaymentCreateFailedError()
      }

      return {
        sessionId: session.id,
        sessionUrl: session.url
      }
    } catch (error) {
      if (error instanceof PaymentCreateFailedError) {
        throw error
      }
      throw new PaymentCreateFailedError()
    }
  }
}
