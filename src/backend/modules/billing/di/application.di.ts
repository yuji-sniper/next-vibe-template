import type { DependencyContainer } from "tsyringe"
import { ArchivePriceUseCase } from "@/backend/modules/billing/application/commands/usecases/archive-price/archive-price.usecase"
import { ArchivePriceUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/archive-price/archive-price.usecase.port"
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
import { CreateSubscriptionCheckoutSessionUseCase } from "@/backend/modules/billing/application/commands/usecases/create-subscription-checkout-session/create-subscription-checkout-session.usecase"
import { CreateSubscriptionCheckoutSessionUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/create-subscription-checkout-session/create-subscription-checkout-session.usecase.port"
import { ProcessStripeWebhookUseCase } from "@/backend/modules/billing/application/commands/usecases/process-stripe-webhook/process-stripe-webhook.usecase"
import { ProcessStripeWebhookUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/process-stripe-webhook/process-stripe-webhook.usecase.port"
import { UpdateProductUseCase } from "@/backend/modules/billing/application/commands/usecases/update-product/update-product.usecase"
import { UpdateProductUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/update-product/update-product.usecase.port"
import { FindPaymentHistoryUseCase } from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase"
import { FindPaymentHistoryUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase.port"
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
    CreateSubscriptionCheckoutSessionUseCasePortToken,
    CreateSubscriptionCheckoutSessionUseCase
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
}
