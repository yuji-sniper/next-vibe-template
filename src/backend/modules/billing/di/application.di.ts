import type { DependencyContainer } from "tsyringe"
import { ArchivePriceUseCase } from "@/backend/modules/billing/application/commands/usecases/archive-price/archive-price.usecase"
import { ArchivePriceUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/archive-price/archive-price.usecase.port"
import { ArchiveProductUseCase } from "@/backend/modules/billing/application/commands/usecases/archive-product/archive-product.usecase"
import { ArchiveProductUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/archive-product/archive-product.usecase.port"
import { CancelSubscriptionUseCase } from "@/backend/modules/billing/application/commands/usecases/cancel-subscription/cancel-subscription.usecase"
import { CancelSubscriptionUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/cancel-subscription/cancel-subscription.usecase.port"
import { ChangeSubscriptionPlanUseCase } from "@/backend/modules/billing/application/commands/usecases/change-subscription-plan/change-subscription-plan.usecase"
import { ChangeSubscriptionPlanUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/change-subscription-plan/change-subscription-plan.usecase.port"
import { CreateCheckoutSessionUseCase } from "@/backend/modules/billing/application/commands/usecases/create-checkout-session/create-checkout-session.usecase"
import { CreateCheckoutSessionUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/create-checkout-session/create-checkout-session.usecase.port"
import { CreatePriceUseCase } from "@/backend/modules/billing/application/commands/usecases/create-price/create-price.usecase"
import { CreatePriceUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/create-price/create-price.usecase.port"
import { CreateProductUseCase } from "@/backend/modules/billing/application/commands/usecases/create-product/create-product.usecase"
import { CreateProductUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/create-product/create-product.usecase.port"
import { ProcessStripeWebhookUseCase } from "@/backend/modules/billing/application/commands/usecases/process-stripe-webhook/process-stripe-webhook.usecase"
import { ProcessStripeWebhookUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/process-stripe-webhook/process-stripe-webhook.usecase.port"
import { UpdateProductUseCase } from "@/backend/modules/billing/application/commands/usecases/update-product/update-product.usecase"
import { UpdateProductUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/update-product/update-product.usecase.port"
import { FindActivePlansUseCase } from "@/backend/modules/billing/application/queries/usecases/find-active-plans/find-active-plans.usecase"
import { FindActivePlansUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-active-plans/find-active-plans.usecase.port"
import { FindInvoiceHistoryUseCase } from "@/backend/modules/billing/application/queries/usecases/find-invoice-history/find-invoice-history.usecase"
import { FindInvoiceHistoryUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-invoice-history/find-invoice-history.usecase.port"
import { FindPaymentHistoryUseCase } from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase"
import { FindPaymentHistoryUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase.port"
import { FindPriceByIdUseCase } from "@/backend/modules/billing/application/queries/usecases/find-price-by-id/find-price-by-id.usecase"
import { FindPriceByIdUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-price-by-id/find-price-by-id.usecase.port"
import { FindPricesByProductIdUseCase } from "@/backend/modules/billing/application/queries/usecases/find-prices-by-product-id/find-prices-by-product-id.usecase"
import { FindPricesByProductIdUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-prices-by-product-id/find-prices-by-product-id.usecase.port"
import { FindProductByIdUseCase } from "@/backend/modules/billing/application/queries/usecases/find-product-by-id/find-product-by-id.usecase"
import { FindProductByIdUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-product-by-id/find-product-by-id.usecase.port"
import { FindProductsUseCase } from "@/backend/modules/billing/application/queries/usecases/find-products/find-products.usecase"
import { FindProductsUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-products/find-products.usecase.port"
import { FindSubscriptionUseCase } from "@/backend/modules/billing/application/queries/usecases/find-subscription/find-subscription.usecase"
import { FindSubscriptionUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-subscription/find-subscription.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    CreateCheckoutSessionUseCasePortToken,
    CreateCheckoutSessionUseCase
  )
  container.registerSingleton(
    ProcessStripeWebhookUseCasePortToken,
    ProcessStripeWebhookUseCase
  )
  container.registerSingleton(
    FindPaymentHistoryUseCasePortToken,
    FindPaymentHistoryUseCase
  )
  container.registerSingleton(
    CancelSubscriptionUseCasePortToken,
    CancelSubscriptionUseCase
  )
  container.registerSingleton(
    ChangeSubscriptionPlanUseCasePortToken,
    ChangeSubscriptionPlanUseCase
  )
  container.registerSingleton(
    FindSubscriptionUseCasePortToken,
    FindSubscriptionUseCase
  )
  container.registerSingleton(
    CreateProductUseCasePortToken,
    CreateProductUseCase
  )
  container.registerSingleton(
    UpdateProductUseCasePortToken,
    UpdateProductUseCase
  )
  container.registerSingleton(CreatePriceUseCasePortToken, CreatePriceUseCase)
  container.registerSingleton(ArchivePriceUseCasePortToken, ArchivePriceUseCase)
  container.registerSingleton(
    ArchiveProductUseCasePortToken,
    ArchiveProductUseCase
  )
  container.registerSingleton(FindProductsUseCasePortToken, FindProductsUseCase)
  container.registerSingleton(
    FindProductByIdUseCasePortToken,
    FindProductByIdUseCase
  )
  container.registerSingleton(
    FindPricesByProductIdUseCasePortToken,
    FindPricesByProductIdUseCase
  )
  container.registerSingleton(
    FindPriceByIdUseCasePortToken,
    FindPriceByIdUseCase
  )
  container.registerSingleton(
    FindActivePlansUseCasePortToken,
    FindActivePlansUseCase
  )
  container.registerSingleton(
    FindInvoiceHistoryUseCasePortToken,
    FindInvoiceHistoryUseCase
  )
}
