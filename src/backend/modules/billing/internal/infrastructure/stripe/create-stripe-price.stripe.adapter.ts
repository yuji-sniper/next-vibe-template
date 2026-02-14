import { injectable } from "tsyringe"
import { PriceCreateFailedError } from "@/backend/modules/billing/public/errors/price.errors"
import type {
  CreateStripePricePort,
  CreateStripePricePortInput,
  CreateStripePricePortOutput
} from "../../application/ports/create-stripe-price.port"
import { stripe } from "./stripe-client"

@injectable()
export class CreateStripePriceStripeAdapter implements CreateStripePricePort {
  async handle(
    input: CreateStripePricePortInput
  ): Promise<CreateStripePricePortOutput> {
    try {
      const stripePrice = await stripe.prices.create({
        product: input.productId,
        unit_amount: input.unitAmount,
        currency: input.currency,
        recurring: input.recurring
          ? {
              interval: input.recurring.interval,
              interval_count: input.recurring.intervalCount
            }
          : undefined,
        metadata: input.metadata
      })

      return {
        id: stripePrice.id,
        productId:
          typeof stripePrice.product === "string"
            ? stripePrice.product
            : stripePrice.product.id,
        unitAmount: stripePrice.unit_amount ?? 0,
        currency: stripePrice.currency,
        type: stripePrice.type,
        recurringInterval: stripePrice.recurring?.interval ?? null,
        recurringIntervalCount: stripePrice.recurring?.interval_count ?? null,
        active: stripePrice.active,
        metadata: stripePrice.metadata
      }
    } catch {
      throw new PriceCreateFailedError()
    }
  }
}
