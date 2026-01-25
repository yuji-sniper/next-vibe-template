import type { DependencyContainer } from "tsyringe"
import { CreateCheckoutSessionUseCase } from "@/backend/modules/billing/application/commands/usecases/create-checkout-session/create-checkout-session.usecase"
import { CreateCheckoutSessionUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/create-checkout-session/create-checkout-session.usecase.port"
import { ProcessWebhookUseCase } from "@/backend/modules/billing/application/commands/usecases/process-webhook/process-webhook.usecase"
import { ProcessWebhookUseCasePortToken } from "@/backend/modules/billing/application/commands/usecases/process-webhook/process-webhook.usecase.port"
import { FindPaymentHistoryUseCase } from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase"
import { FindPaymentHistoryUseCasePortToken } from "@/backend/modules/billing/application/queries/usecases/find-payment-history/find-payment-history.usecase.port"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    CreateCheckoutSessionUseCasePortToken,
    CreateCheckoutSessionUseCase
  )
  container.registerSingleton(
    ProcessWebhookUseCasePortToken,
    ProcessWebhookUseCase
  )
  container.registerSingleton(
    FindPaymentHistoryUseCasePortToken,
    FindPaymentHistoryUseCase
  )
}
