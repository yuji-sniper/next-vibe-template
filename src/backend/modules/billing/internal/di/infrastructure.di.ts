import type { DependencyContainer } from "tsyringe"
import { ArchiveStripePricePortToken } from "@/backend/modules/billing/internal/application/ports/archive-stripe-price.port"
import { CancelSubscriptionPortToken } from "@/backend/modules/billing/internal/application/ports/cancel-subscription.port"
import { ChangeSubscriptionPlanPortToken } from "@/backend/modules/billing/internal/application/ports/change-subscription-plan.port"
import { CreateCheckoutSessionPortToken } from "@/backend/modules/billing/internal/application/ports/create-checkout-session.port"
import { CreateStripeCustomerPortToken } from "@/backend/modules/billing/internal/application/ports/create-stripe-customer.port"
import { CreateStripePricePortToken } from "@/backend/modules/billing/internal/application/ports/create-stripe-price.port"
import { CreateStripeProductPortToken } from "@/backend/modules/billing/internal/application/ports/create-stripe-product.port"
import { GetCurrentAdminPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-admin.port"
import { GetCurrentUserPortToken } from "@/backend/modules/billing/internal/application/ports/get-current-user.port"
import { ProcessStripeWebhookPortToken } from "@/backend/modules/billing/internal/application/ports/process-stripe-webhook.port"
import { UpdateStripeProductPortToken } from "@/backend/modules/billing/internal/application/ports/update-stripe-product.port"
import { FindProductsQueryServicePortToken } from "@/backend/modules/billing/internal/application/queries/usecases/find-products/find-products.query-service.port"
import { CustomerRepositoryToken } from "@/backend/modules/billing/internal/domain/customer/customer.repository"
import { InvoiceRepositoryToken } from "@/backend/modules/billing/internal/domain/invoice/invoice.repository"
import { PaymentRepositoryToken } from "@/backend/modules/billing/internal/domain/payment/payment.repository"
import { PriceRepositoryToken } from "@/backend/modules/billing/internal/domain/price/price.repository"
import { ProductRepositoryToken } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { SubscriptionRepositoryToken } from "@/backend/modules/billing/internal/domain/subscription/subscription.repository"
import { WebhookEventRepositoryToken } from "@/backend/modules/billing/internal/domain/webhook-event/webhook-event.repository"
import { FindProductsMysqlDrizzleQueryService } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/query-services/find-products.mysql-drizzle.query-service"
import { CustomerMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/customer.mysql-drizzle.repository"
import { InvoiceMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/invoice.mysql-drizzle.repository"
import { PaymentMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/payment.mysql-drizzle.repository"
import { PriceMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/price.mysql-drizzle.repository"
import { ProductMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/product.mysql-drizzle.repository"
import { SubscriptionMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/subscription.mysql-drizzle.repository"
import { WebhookEventMysqlDrizzleRepository } from "@/backend/modules/billing/internal/infrastructure/db/mysql/drizzle/repositories/webhook-event.mysql-drizzle.repository"
import { GetCurrentUserAuthModuleAdapter } from "@/backend/modules/billing/internal/infrastructure/modules/auth/get-current-user.auth-module.adapter"
import { GetCurrentAdminAuthAdminModuleAdapter } from "@/backend/modules/billing/internal/infrastructure/modules/auth-admin/get-current-admin.auth-admin-module.adapter"
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
  // Query Services
  container.registerSingleton(
    FindProductsQueryServicePortToken,
    FindProductsMysqlDrizzleQueryService
  )

  // Repositories
  container.registerSingleton(
    CustomerRepositoryToken,
    CustomerMysqlDrizzleRepository
  )
  container.registerSingleton(
    PaymentRepositoryToken,
    PaymentMysqlDrizzleRepository
  )
  container.registerSingleton(
    WebhookEventRepositoryToken,
    WebhookEventMysqlDrizzleRepository
  )
  container.registerSingleton(
    SubscriptionRepositoryToken,
    SubscriptionMysqlDrizzleRepository
  )
  container.registerSingleton(
    InvoiceRepositoryToken,
    InvoiceMysqlDrizzleRepository
  )
  container.registerSingleton(
    ProductRepositoryToken,
    ProductMysqlDrizzleRepository
  )
  container.registerSingleton(PriceRepositoryToken, PriceMysqlDrizzleRepository)

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
