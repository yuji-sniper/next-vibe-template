import { injectable } from "tsyringe"
import { ProductUpdateFailedError } from "@/backend/modules/billing/public/errors/product.errors"
import type {
  UpdateStripeProductPort,
  UpdateStripeProductPortInput
} from "../../application/ports/update-stripe-product.port"
import { stripe } from "./stripe-client"

@injectable()
export class UpdateStripeProductStripeAdapter
  implements UpdateStripeProductPort
{
  async handle(input: UpdateStripeProductPortInput): Promise<void> {
    try {
      await stripe.products.update(input.stripeProductId, {
        name: input.name,
        description: input.description,
        active: input.active,
        metadata: input.metadata
      })
    } catch {
      throw new ProductUpdateFailedError()
    }
  }
}
