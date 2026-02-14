import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { PaymentStatus } from "@/backend/modules/billing/internal/domain/payment/payment"
import { Payment } from "@/backend/modules/billing/internal/domain/payment/payment"
import type { PaymentRepository } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { payments } from "../schemas"

@injectable()
export class PaymentMysqlDrizzleRepository implements PaymentRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findByCustomerId(customerId: string): Promise<Payment[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(payments)
      .where(eq(payments.customerId, customerId))

    return result.map((row) =>
      Payment.reconstruct({
        id: row.id,
        customerId: row.customerId,
        stripePaymentIntentId: row.stripePaymentIntentId,
        amount: row.amount,
        currency: row.currency,
        status: row.status as PaymentStatus,
        createdAt: row.createdAt
      })
    )
  }

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string
  ): Promise<Payment | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return Payment.reconstruct({
      id: row.id,
      customerId: row.customerId,
      stripePaymentIntentId: row.stripePaymentIntentId,
      amount: row.amount,
      currency: row.currency,
      status: row.status as PaymentStatus,
      createdAt: row.createdAt
    })
  }

  async save(payment: Payment): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(payments)
      .values({
        id: payment.id,
        customerId: payment.customerId,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt
      })
      .onDuplicateKeyUpdate({
        set: { status: payment.status }
      })
  }
}
