import { injectable } from "tsyringe"
import { SubscriptionCancelFailedError } from "@/backend/modules/billing/public/errors/subscription.errors"
import type {
  CancelSubscriptionPort,
  CancelSubscriptionPortInput,
  CancelSubscriptionPortOutput
} from "../../application/ports/cancel-subscription.port"
import { stripe } from "./stripe-client"

@injectable()
export class CancelSubscriptionStripeAdapter implements CancelSubscriptionPort {
  async handle(
    input: CancelSubscriptionPortInput
  ): Promise<CancelSubscriptionPortOutput> {
    try {
      const cancelAtPeriodEnd = input.cancelAtPeriodEnd ?? true

      const subscription = await stripe.subscriptions.update(
        input.stripeSubscriptionId,
        {
          cancel_at_period_end: cancelAtPeriodEnd
        }
      )

      const firstItem = subscription.items.data[0]

      return {
        stripeSubscriptionId: subscription.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: firstItem?.current_period_end ?? null
      }
    } catch {
      throw new SubscriptionCancelFailedError()
    }
  }
}
