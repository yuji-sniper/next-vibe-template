import type { DependencyContainer } from "tsyringe"
import { CancelSubscriptionPortToken } from "@/backend/modules/billing/application/commands/ports/cancel-subscription.port"
import { ChangeSubscriptionPlanPortToken } from "@/backend/modules/billing/application/commands/ports/change-subscription-plan.port"
import { CreateCheckoutSessionPortToken } from "@/backend/modules/billing/application/commands/ports/create-checkout-session.port"
import { CreateStripeCustomerPortToken } from "@/backend/modules/billing/application/commands/ports/create-stripe-customer.port"
import { CreateSubscriptionCheckoutSessionPortToken } from "@/backend/modules/billing/application/commands/ports/create-subscription-checkout-session.port"
import { ProcessStripeWebhookPortToken } from "@/backend/modules/billing/application/commands/ports/process-stripe-webhook.port"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import { InvoiceRepositoryToken } from "@/backend/modules/billing/domain/invoice/invoice.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/domain/payment/payment.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/domain/webhook-event/webhook-event.repository"
import { CustomerDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/customer.drizzle.repository"
import { InvoiceDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/invoice.drizzle.repository"
import { PaymentDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/payment.drizzle.repository"
import { SubscriptionDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/subscription.drizzle.repository"
import { WebhookEventDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/webhook-event.drizzle.repository"
import { CancelSubscriptionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/cancel-subscription.stripe.adapter"
import { ChangeSubscriptionPlanStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/change-subscription-plan.stripe.adapter"
import { CreateCheckoutSessionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-checkout-session.stripe.adapter"
import { CreateStripeCustomerStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-stripe-customer.stripe.adapter"
import { CreateSubscriptionCheckoutSessionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-subscription-checkout-session.stripe.adapter"
import { ProcessStripeWebhookStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/process-stripe-webhook.stripe.adapter"

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
  container.registerSingleton(
    SubscriptionRepositoryToken,
    SubscriptionDrizzleRepository
  )
  container.registerSingleton(InvoiceRepositoryToken, InvoiceDrizzleRepository)

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
    ProcessStripeWebhookPortToken,
    ProcessStripeWebhookStripeAdapter
  )
  container.registerSingleton(
    CreateSubscriptionCheckoutSessionPortToken,
    CreateSubscriptionCheckoutSessionStripeAdapter
  )
  container.registerSingleton(
    CancelSubscriptionPortToken,
    CancelSubscriptionStripeAdapter
  )
  container.registerSingleton(
    ChangeSubscriptionPlanPortToken,
    ChangeSubscriptionPlanStripeAdapter
  )
}
