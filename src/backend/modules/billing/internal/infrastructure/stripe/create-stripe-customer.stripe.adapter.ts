import { injectable } from "tsyringe"
import { CustomerCreateFailedError } from "@/backend/modules/billing/public/errors/customer.errors"
import type {
  CreateStripeCustomerPort,
  CreateStripeCustomerPortInput,
  CreateStripeCustomerPortOutput
} from "../../application/ports/create-stripe-customer.port"
import { stripe } from "./stripe-client"

@injectable()
export class CreateStripeCustomerStripeAdapter
  implements CreateStripeCustomerPort
{
  async handle(
    input: CreateStripeCustomerPortInput
  ): Promise<CreateStripeCustomerPortOutput> {
    try {
      const stripeCustomer = await stripe.customers.create({
        email: input.email,
        metadata: {
          userId: input.userId
        }
      })

      return {
        stripeCustomerId: stripeCustomer.id
      }
    } catch {
      throw new CustomerCreateFailedError()
    }
  }
}
