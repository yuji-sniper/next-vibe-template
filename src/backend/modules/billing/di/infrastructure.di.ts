import type { DependencyContainer } from "tsyringe"
import { CreateCheckoutSessionPortToken } from "@/backend/modules/billing/application/commands/ports/create-checkout-session.port"
import { CreateStripeCustomerPortToken } from "@/backend/modules/billing/application/commands/ports/create-stripe-customer.port"
import { ProcessWebhookPortToken } from "@/backend/modules/billing/application/commands/ports/process-webhook.port"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/domain/payment/payment.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/domain/webhook-event/webhook-event.repository"
import { CustomerDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/customer.drizzle.repository"
import { PaymentDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/payment.drizzle.repository"
import { WebhookEventDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/webhook-event.drizzle.repository"
import { CreateCheckoutSessionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-checkout-session.stripe.adapter"
import { CreateStripeCustomerStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-stripe-customer.stripe.adapter"
import { ProcessWebhookStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/process-webhook.stripe.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  // Repositories
  container.registerSingleton(
    CustomerRepositoryToken,
    CustomerDrizzleRepository
  )
  container.registerSingleton(PaymentRepositoryToken, PaymentDrizzleRepository)
  container.registerSingleton(
    WebhookEventRepositoryToken,
    WebhookEventDrizzleRepository
  )

  // Stripe Adapters
  container.registerSingleton(
    CreateCheckoutSessionPortToken,
    CreateCheckoutSessionStripeAdapter
  )
  container.registerSingleton(
    CreateStripeCustomerPortToken,
    CreateStripeCustomerStripeAdapter
  )
  container.registerSingleton(
    ProcessWebhookPortToken,
    ProcessWebhookStripeAdapter
  )
}
