import type { Invoice } from "./invoice"

export const InvoiceRepositoryToken = Symbol("InvoiceRepository")

export interface InvoiceRepository {
  findById(id: string): Promise<Invoice | undefined>
  findByStripeInvoiceId(stripeInvoiceId: string): Promise<Invoice | undefined>
  findByCustomerId(customerId: string): Promise<Invoice[]>
  findBySubscriptionId(subscriptionId: string): Promise<Invoice[]>
  save(invoice: Invoice): Promise<void>
}
