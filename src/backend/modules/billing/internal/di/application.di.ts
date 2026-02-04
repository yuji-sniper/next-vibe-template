import type { DependencyContainer } from "tsyringe"
import { ArchivePriceUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/archive-price/archive-price.usecase"
import { ArchiveProductUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/archive-product/archive-product.usecase"
import { CancelSubscriptionUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/cancel-subscription/cancel-subscription.usecase"
import { ChangeSubscriptionPlanUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/change-subscription-plan/change-subscription-plan.usecase"
import { CreateCheckoutSessionUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/create-checkout-session/create-checkout-session.usecase"
import { CreatePriceUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/create-price/create-price.usecase"
import { CreateProductUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/create-product/create-product.usecase"
import { ProcessStripeWebhookUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/process-stripe-webhook/process-stripe-webhook.usecase"
import { UpdateProductUseCase } from "@/backend/modules/billing/internal/application/commands/usecases/update-product/update-product.usecase"
import { FindActivePlansUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-active-plans/find-active-plans.usecase"
import { FindInvoiceHistoryUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-invoice-history/find-invoice-history.usecase"
import { FindPaymentHistoryUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-payment-history/find-payment-history.usecase"
import { FindPriceByIdUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-price-by-id/find-price-by-id.usecase"
import { FindPricesByProductIdUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-prices-by-product-id/find-prices-by-product-id.usecase"
import { FindProductByIdUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-product-by-id/find-product-by-id.usecase"
import { FindProductsUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-products/find-products.usecase"
import { FindSubscriptionUseCase } from "@/backend/modules/billing/internal/application/queries/usecases/find-subscription/find-subscription.usecase"
import { ArchivePriceUseCasePortToken } from "@/backend/modules/billing/public/ports/archive-price.usecase.port"
import { ArchiveProductUseCasePortToken } from "@/backend/modules/billing/public/ports/archive-product.usecase.port"
import { CancelSubscriptionUseCasePortToken } from "@/backend/modules/billing/public/ports/cancel-subscription.usecase.port"
import { ChangeSubscriptionPlanUseCasePortToken } from "@/backend/modules/billing/public/ports/change-subscription-plan.usecase.port"
import { CreateCheckoutSessionUseCasePortToken } from "@/backend/modules/billing/public/ports/create-checkout-session.usecase.port"
import { CreatePriceUseCasePortToken } from "@/backend/modules/billing/public/ports/create-price.usecase.port"
import { CreateProductUseCasePortToken } from "@/backend/modules/billing/public/ports/create-product.usecase.port"
import { FindActivePlansUseCasePortToken } from "@/backend/modules/billing/public/ports/find-active-plans.usecase.port"
import { FindInvoiceHistoryUseCasePortToken } from "@/backend/modules/billing/public/ports/find-invoice-history.usecase.port"
import { FindPaymentHistoryUseCasePortToken } from "@/backend/modules/billing/public/ports/find-payment-history.usecase.port"
import { FindPriceByIdUseCasePortToken } from "@/backend/modules/billing/public/ports/find-price-by-id.usecase.port"
import { FindPricesByProductIdUseCasePortToken } from "@/backend/modules/billing/public/ports/find-prices-by-product-id.usecase.port"
import { FindProductByIdUseCasePortToken } from "@/backend/modules/billing/public/ports/find-product-by-id.usecase.port"
import { FindProductsUseCasePortToken } from "@/backend/modules/billing/public/ports/find-products.usecase.port"
import { FindSubscriptionUseCasePortToken } from "@/backend/modules/billing/public/ports/find-subscription.usecase.port"
import { ProcessStripeWebhookUseCasePortToken } from "@/backend/modules/billing/public/ports/process-stripe-webhook.usecase.port"
import { UpdateProductUseCasePortToken } from "@/backend/modules/billing/public/ports/update-product.usecase.port"

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
