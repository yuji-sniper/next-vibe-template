import type { DependencyContainer } from "tsyringe"
import { ArchiveStripePricePortToken } from "@/backend/modules/billing/internal/application/commands/ports/archive-stripe-price.port"
import { CancelSubscriptionPortToken } from "@/backend/modules/billing/internal/application/commands/ports/cancel-subscription.port"
import { ChangeSubscriptionPlanPortToken } from "@/backend/modules/billing/internal/application/commands/ports/change-subscription-plan.port"
import { CreateCheckoutSessionPortToken } from "@/backend/modules/billing/internal/application/commands/ports/create-checkout-session.port"
import { CreateStripeCustomerPortToken } from "@/backend/modules/billing/internal/application/commands/ports/create-stripe-customer.port"
import { CreateStripePricePortToken } from "@/backend/modules/billing/internal/application/commands/ports/create-stripe-price.port"
import { CreateStripeProductPortToken } from "@/backend/modules/billing/internal/application/commands/ports/create-stripe-product.port"
import { ProcessStripeWebhookPortToken } from "@/backend/modules/billing/internal/application/commands/ports/process-stripe-webhook.port"
import { UpdateStripeProductPortToken } from "@/backend/modules/billing/internal/application/commands/ports/update-stripe-product.port"
import { GetCurrentAdminPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import { GetCurrentUserPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-user.port"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { InvoiceRepositoryToken } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event.repository"
import { GetCurrentUserAuthModuleAdapter } from "@/backend/modules/billing/internal/infrastructure/modules/auth/get-current-user.auth-module.adapter"
import { GetCurrentAdminAuthAdminModuleAdapter } from "@/backend/modules/billing/internal/infrastructure/modules/auth-admin/get-current-admin.auth-admin-module.adapter"
import { CustomerDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/customer.drizzle.repository"
import { InvoiceDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/invoice.drizzle.repository"
import { PaymentDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/payment.drizzle.repository"
import { PriceDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/price.drizzle.repository"
import { ProductDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/product.drizzle.repository"
import { SubscriptionDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/subscription.drizzle.repository"
import { WebhookEventDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/repositories/webhook-event.drizzle.repository"
import { ArchiveStripePriceStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/archive-stripe-price.stripe.adapter"
import { CancelSubscriptionStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/cancel-subscription.stripe.adapter"
import { ChangeSubscriptionPlanStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/change-subscription-plan.stripe.adapter"
import { CreateCheckoutSessionStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/create-checkout-session.stripe.adapter"
import { CreateStripeCustomerStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/create-stripe-customer.stripe.adapter"
import { CreateStripePriceStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/create-stripe-price.stripe.adapter"
import { CreateStripeProductStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/create-stripe-product.stripe.adapter"
import { ProcessStripeWebhookStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/process-stripe-webhook.stripe.adapter"
import { UpdateStripeProductStripeAdapter } from "@/backend/modules/billing/internal/infrastructure/stripe/update-stripe-product.stripe.adapter"

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
    GetCurrentAdminPortToken,
    GetCurrentAdminAuthAdminModuleAdapter
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
