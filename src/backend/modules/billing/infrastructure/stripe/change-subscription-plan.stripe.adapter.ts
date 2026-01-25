import { injectable } from "tsyringe"
import { SubscriptionUpdateFailedError } from "@/backend/modules/billing/domain/subscription/subscription.errors"
import type {
  ChangeSubscriptionPlanPort,
  ChangeSubscriptionPlanPortInput,
  ChangeSubscriptionPlanPortOutput
} from "../../application/commands/ports/change-subscription-plan.port"
import { stripe } from "./stripe-client"

@injectable()
export class ChangeSubscriptionPlanStripeAdapter
  implements ChangeSubscriptionPlanPort
{
  async handle(
    input: ChangeSubscriptionPlanPortInput
  ): Promise<ChangeSubscriptionPlanPortOutput> {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        input.stripeSubscriptionId
      )

      const subscriptionItemId = subscription.items.data[0]?.id
      if (!subscriptionItemId) {
        throw new SubscriptionUpdateFailedError()
      }

      const updatedSubscription = await stripe.subscriptions.update(
        input.stripeSubscriptionId,
        {
          items: [
            {
              id: subscriptionItemId,
              price: input.newPriceId
            }
          ],
          proration_behavior: "create_prorations"
        }
      )

      const newPriceId = updatedSubscription.items.data[0]?.price.id
      if (!newPriceId) {
        throw new SubscriptionUpdateFailedError()
      }

      return {
        stripeSubscriptionId: updatedSubscription.id,
        stripePriceId: newPriceId
      }
    } catch (error) {
      if (error instanceof SubscriptionUpdateFailedError) {
        throw error
      }
      throw new SubscriptionUpdateFailedError()
    }
  }
}
