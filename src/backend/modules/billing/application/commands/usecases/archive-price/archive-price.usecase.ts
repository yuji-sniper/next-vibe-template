import { inject, injectable } from "tsyringe"
import type { RequireAuthAdminPort } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { RequireAuthAdminPortToken } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { PriceNotFoundError } from "@/backend/modules/billing/domain/price/price.errors"
import type { PriceRepository } from "@/backend/modules/billing/domain/price/price.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/domain/price/price.repository"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { ArchiveStripePricePort } from "../../ports/archive-stripe-price.port"
import { ArchiveStripePricePortToken } from "../../ports/archive-stripe-price.port"
import type {
  ArchivePriceUseCaseInput,
  ArchivePriceUseCasePort
} from "./archive-price.usecase.port"

@injectable()
export class ArchivePriceUseCase implements ArchivePriceUseCasePort {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(RequireAuthAdminPortToken)
    private readonly requireAuthAdmin: RequireAuthAdminPort,
    @inject(PriceRepositoryToken)
    private readonly priceRepository: PriceRepository,
    @inject(ArchiveStripePricePortToken)
    private readonly archiveStripePrice: ArchiveStripePricePort
  ) {}

  async handle(input: ArchivePriceUseCaseInput): Promise<void> {
    this.logger.info("Archiving price started", { priceId: input.priceId })

    // 1. Admin認可チェック
    await this.requireAuthAdmin.handle()

    // 2. 価格取得（存在確認）
    const price = await this.priceRepository.findById(input.priceId)
    if (!price) {
      this.logger.warn("Price not found", { priceId: input.priceId })
      throw new PriceNotFoundError(input.priceId)
    }

    // 3. Stripe連携済みなら Stripe で非アクティブ化
    if (price.stripePriceId) {
      this.logger.info("Archiving Stripe price", {
        priceId: input.priceId,
        stripePriceId: price.stripePriceId
      })
      await this.archiveStripePrice.handle({
        stripePriceId: price.stripePriceId
      })
    }

    // 4. DB で active=false に更新
    price.archive()
    await this.priceRepository.save(price)

    this.logger.info("Price archived successfully", { priceId: input.priceId })
  }
}
