import type { DependencyContainer } from "tsyringe"
import {
  ArchivePriceHandlerImpl,
  ArchivePriceHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/archive-price/archive-price.handler"
import {
  ArchiveProductHandlerImpl,
  ArchiveProductHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/archive-product/archive-product.handler"
import {
  CancelSubscriptionHandlerImpl,
  CancelSubscriptionHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/cancel-subscription/cancel-subscription.handler"
import {
  ChangeSubscriptionPlanHandlerImpl,
  ChangeSubscriptionPlanHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/change-subscription-plan/change-subscription-plan.handler"
import {
  CreateCheckoutSessionHandlerImpl,
  CreateCheckoutSessionHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/create-checkout-session/create-checkout-session.handler"
import {
  CreatePriceHandlerImpl,
  CreatePriceHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/create-price/create-price.handler"
import {
  CreateProductHandlerImpl,
  CreateProductHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/create-product/create-product.handler"
import {
  FindActivePlansHandlerImpl,
  FindActivePlansHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-active-plans/find-active-plans.handler"
import {
  FindInvoiceHistoryHandlerImpl,
  FindInvoiceHistoryHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-invoice-history/find-invoice-history.handler"
import {
  FindPaymentHistoryHandlerImpl,
  FindPaymentHistoryHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-payment-history/find-payment-history.handler"
import {
  FindPriceByIdHandlerImpl,
  FindPriceByIdHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-price-by-id/find-price-by-id.handler"
import {
  FindPricesByProductIdHandlerImpl,
  FindPricesByProductIdHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-prices-by-product-id/find-prices-by-product-id.handler"
import {
  FindProductByIdHandlerImpl,
  FindProductByIdHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-product-by-id/find-product-by-id.handler"
import {
  FindProductsHandlerImpl,
  FindProductsHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-products/find-products.handler"
import {
  FindSubscriptionHandlerImpl,
  FindSubscriptionHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/find-subscription/find-subscription.handler"
import {
  ProcessStripeWebhookHandlerImpl,
  ProcessStripeWebhookHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/process-stripe-webhook/process-stripe-webhook.handler"
import {
  UpdateProductHandlerImpl,
  UpdateProductHandlerToken
} from "@/backend/modules/billing/internal/presentation/handlers/update-product/update-product.handler"

export const initPresentationDependency = (container: DependencyContainer) => {
  // Product Handlers
  container.registerSingleton(
    CreateProductHandlerToken,
    CreateProductHandlerImpl
  )
  container.registerSingleton(
    UpdateProductHandlerToken,
    UpdateProductHandlerImpl
  )
  container.registerSingleton(
    ArchiveProductHandlerToken,
    ArchiveProductHandlerImpl
  )
  container.registerSingleton(FindProductsHandlerToken, FindProductsHandlerImpl)
  container.registerSingleton(
    FindProductByIdHandlerToken,
    FindProductByIdHandlerImpl
  )

  // Price Handlers
  container.registerSingleton(CreatePriceHandlerToken, CreatePriceHandlerImpl)
  container.registerSingleton(ArchivePriceHandlerToken, ArchivePriceHandlerImpl)
  container.registerSingleton(
    FindPriceByIdHandlerToken,
    FindPriceByIdHandlerImpl
  )
  container.registerSingleton(
    FindPricesByProductIdHandlerToken,
    FindPricesByProductIdHandlerImpl
  )

  // Plan Handlers
  container.registerSingleton(
    FindActivePlansHandlerToken,
    FindActivePlansHandlerImpl
  )

  // Subscription Handlers
  container.registerSingleton(
    FindSubscriptionHandlerToken,
    FindSubscriptionHandlerImpl
  )
  container.registerSingleton(
    CancelSubscriptionHandlerToken,
    CancelSubscriptionHandlerImpl
  )
  container.registerSingleton(
    ChangeSubscriptionPlanHandlerToken,
    ChangeSubscriptionPlanHandlerImpl
  )

  // Checkout Handlers
  container.registerSingleton(
    CreateCheckoutSessionHandlerToken,
    CreateCheckoutSessionHandlerImpl
  )

  // Payment Handlers
  container.registerSingleton(
    FindPaymentHistoryHandlerToken,
    FindPaymentHistoryHandlerImpl
  )

  // Invoice Handlers
  container.registerSingleton(
    FindInvoiceHistoryHandlerToken,
    FindInvoiceHistoryHandlerImpl
  )

  // Webhook Handlers
  container.registerSingleton(
    ProcessStripeWebhookHandlerToken,
    ProcessStripeWebhookHandlerImpl
  )
}
