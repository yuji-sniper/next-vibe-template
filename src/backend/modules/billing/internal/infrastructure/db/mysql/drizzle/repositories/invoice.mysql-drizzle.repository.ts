import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { InvoiceStatus } from "@/backend/modules/billing/internal/domain/invoice/invoice"
import { Invoice } from "@/backend/modules/billing/internal/domain/invoice/invoice"
import type { InvoiceRepository } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { invoices } from "../schemas"

@injectable()
export class InvoiceMysqlDrizzleRepository implements InvoiceRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Invoice | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
  }

  async findByStripeInvoiceId(
    stripeInvoiceId: string
  ): Promise<Invoice | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.stripeInvoiceId, stripeInvoiceId))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
  }

  async findByCustomerId(customerId: string): Promise<Invoice[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.customerId, customerId))

    return result.map((row) => this.toDomain(row))
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Invoice[]> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.subscriptionId, subscriptionId))

    return result.map((row) => this.toDomain(row))
  }

  async save(invoice: Invoice): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(invoices)
      .values({
        id: invoice.id,
        customerId: invoice.customerId,
        subscriptionId: invoice.subscriptionId,
        stripeInvoiceId: invoice.stripeInvoiceId,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt
      })
      .onDuplicateKeyUpdate({
        set: {
          status: invoice.status,
          paidAt: invoice.paidAt
        }
      })
  }

  private toDomain(row: {
    id: string
    customerId: string
    subscriptionId: string | null
    stripeInvoiceId: string
    amount: number
    currency: string
    status: string
    paidAt: Date | null
    createdAt: Date
  }): Invoice {
    return Invoice.reconstruct({
      id: row.id,
      customerId: row.customerId,
      subscriptionId: row.subscriptionId,
      stripeInvoiceId: row.stripeInvoiceId,
      amount: row.amount,
      currency: row.currency,
      status: row.status as InvoiceStatus,
      paidAt: row.paidAt,
      createdAt: row.createdAt
    })
  }
}
