import { injectable } from "tsyringe"
import { ProductCreateFailedError } from "@/backend/modules/billing/public/errors/product.errors"
import type {
  CreateStripeProductPort,
  CreateStripeProductPortInput,
  CreateStripeProductPortOutput
} from "../../application/ports/create-stripe-product.port"
import { stripe } from "./stripe-client"

@injectable()
export class CreateStripeProductStripeAdapter
  implements CreateStripeProductPort
{
  async handle(
    input: CreateStripeProductPortInput
  ): Promise<CreateStripeProductPortOutput> {
    try {
      const stripeProduct = await stripe.products.create({
        name: input.name,
        description: input.description,
        metadata: input.metadata
      })

      return {
        id: stripeProduct.id,
        name: stripeProduct.name,
        description: stripeProduct.description,
        active: stripeProduct.active,
        metadata: stripeProduct.metadata
      }
    } catch {
      throw new ProductCreateFailedError()
    }
  }
}
