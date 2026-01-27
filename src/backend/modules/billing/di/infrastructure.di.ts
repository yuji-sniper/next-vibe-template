import type { DependencyContainer } from "tsyringe"
import { ArchiveStripePricePortToken } from "@/backend/modules/billing/application/commands/ports/archive-stripe-price.port"
import { CancelSubscriptionPortToken } from "@/backend/modules/billing/application/commands/ports/cancel-subscription.port"
import { ChangeSubscriptionPlanPortToken } from "@/backend/modules/billing/application/commands/ports/change-subscription-plan.port"
import { CreateCheckoutSessionPortToken } from "@/backend/modules/billing/application/commands/ports/create-checkout-session.port"
import { CreateStripeCustomerPortToken } from "@/backend/modules/billing/application/commands/ports/create-stripe-customer.port"
import { CreateStripePricePortToken } from "@/backend/modules/billing/application/commands/ports/create-stripe-price.port"
import { CreateStripeProductPortToken } from "@/backend/modules/billing/application/commands/ports/create-stripe-product.port"
import { CreateSubscriptionCheckoutSessionPortToken } from "@/backend/modules/billing/application/commands/ports/create-subscription-checkout-session.port"
import { ProcessStripeWebhookPortToken } from "@/backend/modules/billing/application/commands/ports/process-stripe-webhook.port"
import { UpdateStripeProductPortToken } from "@/backend/modules/billing/application/commands/ports/update-stripe-product.port"
import { GetCurrentUserPortToken } from "@/backend/modules/billing/application/ports/get-current-user.port"
import { RequireAuthAdminPortToken } from "@/backend/modules/billing/application/ports/require-auth-admin.port"
import { CustomerRepositoryToken } from "@/backend/modules/billing/domain/customer/customer.repository"
import { InvoiceRepositoryToken } from "@/backend/modules/billing/domain/invoice/invoice.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/domain/payment/payment.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/domain/price/price.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/domain/product/product.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/domain/subscription/subscription.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/domain/webhook-event/webhook-event.repository"
import { GetCurrentUserAuthModuleAdapter } from "@/backend/modules/billing/infrastructure/modules/auth/get-current-user.auth-module.adapter"
import { RequireAuthAdminAuthAdminModuleAdapter } from "@/backend/modules/billing/infrastructure/modules/auth-admin/require-auth-admin.auth-admin-module.adapter"
import { CustomerDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/customer.drizzle.repository"
import { InvoiceDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/invoice.drizzle.repository"
import { PaymentDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/payment.drizzle.repository"
import { PriceDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/price.drizzle.repository"
import { ProductDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/product.drizzle.repository"
import { SubscriptionDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/subscription.drizzle.repository"
import { WebhookEventDrizzleRepository } from "@/backend/modules/billing/infrastructure/repositories/webhook-event.drizzle.repository"
import { ArchiveStripePriceStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/archive-stripe-price.stripe.adapter"
import { CancelSubscriptionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/cancel-subscription.stripe.adapter"
import { ChangeSubscriptionPlanStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/change-subscription-plan.stripe.adapter"
import { CreateCheckoutSessionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-checkout-session.stripe.adapter"
import { CreateStripeCustomerStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-stripe-customer.stripe.adapter"
import { CreateStripePriceStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-stripe-price.stripe.adapter"
import { CreateStripeProductStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-stripe-product.stripe.adapter"
import { CreateSubscriptionCheckoutSessionStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/create-subscription-checkout-session.stripe.adapter"
import { ProcessStripeWebhookStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/process-stripe-webhook.stripe.adapter"
import { UpdateStripeProductStripeAdapter } from "@/backend/modules/billing/infrastructure/stripe/update-stripe-product.stripe.adapter"

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
  container.registerSingleton(ProductRepositoryToken, ProductDrizzleRepository)
  container.registerSingleton(PriceRepositoryToken, PriceDrizzleRepository)

  // External Module Adapters
  container.registerSingleton(
    GetCurrentUserPortToken,
    GetCurrentUserAuthModuleAdapter
  )
  container.registerSingleton(
    RequireAuthAdminPortToken,
    RequireAuthAdminAuthAdminModuleAdapter
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
  container.registerSingleton(
    CreateStripeProductPortToken,
    CreateStripeProductStripeAdapter
  )
  container.registerSingleton(
    UpdateStripeProductPortToken,
    UpdateStripeProductStripeAdapter
  )
  container.registerSingleton(
    CreateStripePricePortToken,
    CreateStripePriceStripeAdapter
  )
  container.registerSingleton(
    ArchiveStripePricePortToken,
    ArchiveStripePriceStripeAdapter
  )
}
