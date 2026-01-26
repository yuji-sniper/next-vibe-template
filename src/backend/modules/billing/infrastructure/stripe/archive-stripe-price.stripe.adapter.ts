import { injectable } from "tsyringe"
import { PriceArchiveFailedError } from "@/backend/modules/billing/domain/price/price.errors"
import type {
  ArchiveStripePricePort,
  ArchiveStripePricePortInput
} from "../../application/commands/ports/archive-stripe-price.port"
import { stripe } from "./stripe-client"

@injectable()
export class ArchiveStripePriceStripeAdapter implements ArchiveStripePricePort {
  async handle(input: ArchiveStripePricePortInput): Promise<void> {
    try {
      await stripe.prices.update(input.stripePriceId, {
        active: false
      })
    } catch {
      throw new PriceArchiveFailedError()
    }
  }
}
