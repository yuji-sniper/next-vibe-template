import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { Customer } from "@/backend/modules/billing/internal/domain/customer/customer"
import type { CustomerRepository } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { customers } from "../schemas"

@injectable()
export class CustomerMysqlDrizzleRepository implements CustomerRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findByUserId(userId: string): Promise<Customer | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.userId, userId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return Customer.reconstruct({
      id: row.id,
      userId: row.userId,
      stripeCustomerId: row.stripeCustomerId,
      email: row.email,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }

  async findByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<Customer | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.stripeCustomerId, stripeCustomerId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const row = result[0]
    return Customer.reconstruct({
      id: row.id,
      userId: row.userId,
      stripeCustomerId: row.stripeCustomerId,
      email: row.email,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }

  async save(customer: Customer): Promise<void> {
    const db = this.getDb.handle()
    await db.insert(customers).values({
      id: customer.id,
      userId: customer.userId,
      stripeCustomerId: customer.stripeCustomerId,
      email: customer.email.value,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    })
  }
}
