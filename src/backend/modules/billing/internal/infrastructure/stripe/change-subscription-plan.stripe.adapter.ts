import { injectable } from "tsyringe"
import { SubscriptionUpdateFailedError } from "@/backend/modules/billing/public/errors/subscription.errors"
import type {
  ChangeSubscriptionPlanPort,
  ChangeSubscriptionPlanPortInput,
  ChangeSubscriptionPlanPortOutput
} from "../../application/ports/change-subscription-plan.port"
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
        throw new SubscriptionUpdateFailedError(
          "Subscription item not found in Stripe"
        )
      }

      const updatedSubscription = await stripe.subscriptions.update(
        input.stripeSubscriptionId,
        {
          items: [
            {
              id: subscriptionItemId,
              price: input.newStripePriceId
            }
          ],
          // プラン変更時の日割り計算を有効化
          // 旧プランの未使用分をクレジット、新プランの残り期間分を追加請求として計算し、
          // 差額を次回の請求に反映する
          proration_behavior: "create_prorations"
        }
      )

      const newPriceId = updatedSubscription.items.data[0]?.price.id
      if (!newPriceId) {
        throw new SubscriptionUpdateFailedError(
          "New price ID not found in Stripe"
        )
      }

      return {
        stripeSubscriptionId: updatedSubscription.id,
        stripePriceId: newPriceId
      }
    } catch (error) {
      if (error instanceof SubscriptionUpdateFailedError) {
        throw error
      }
      throw new SubscriptionUpdateFailedError(
        "Unexpected error in ChangeSubscriptionPlanStripeAdapter"
      )
    }
  }
}
