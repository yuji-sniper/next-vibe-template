import type { Customer } from "./customer"

export interface CustomerRepository {
  findByUserId(userId: string): Promise<Customer | null>
  findByStripeCustomerId(stripeCustomerId: string): Promise<Customer | null>
  save(customer: Customer): Promise<void>
}

export const CustomerRepositoryToken = Symbol("CustomerRepository")
