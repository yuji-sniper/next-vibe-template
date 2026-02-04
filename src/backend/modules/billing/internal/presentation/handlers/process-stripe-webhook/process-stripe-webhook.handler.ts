import { inject, injectable } from "tsyringe"
import {
  WebhookEventAlreadyProcessedError,
  WebhookProcessingFailedError,
  WebhookVerificationFailedError
} from "@/backend/modules/billing/public/errors/webhook-event.errors"
import type { ProcessStripeWebhookUseCasePort } from "@/backend/modules/billing/public/ports/process-stripe-webhook.usecase.port"
import { ProcessStripeWebhookUseCasePortToken } from "@/backend/modules/billing/public/ports/process-stripe-webhook.usecase.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export type ProcessStripeWebhookHandlerInput = {
  payload: string
  signature: string
}

export type ProcessStripeWebhookHandlerResult = Result<{
  received: true
}>

export const ProcessStripeWebhookHandlerToken = Symbol(
  "ProcessStripeWebhookHandler"
)

export interface ProcessStripeWebhookHandler {
  handle(
    input: ProcessStripeWebhookHandlerInput
  ): Promise<ProcessStripeWebhookHandlerResult>
}

@injectable()
export class ProcessStripeWebhookHandlerImpl
  implements ProcessStripeWebhookHandler
{
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(ProcessStripeWebhookUseCasePortToken)
    private readonly processStripeWebhookUseCase: ProcessStripeWebhookUseCasePort
  ) {}

  async handle(
    input: ProcessStripeWebhookHandlerInput
  ): Promise<ProcessStripeWebhookHandlerResult> {
    try {
      await this.processStripeWebhookUseCase.handle({
        payload: input.payload,
        signature: input.signature
      })

      return {
        ok: true,
        data: { received: true }
      }
    } catch (e: unknown) {
      if (e instanceof WebhookVerificationFailedError) {
        this.logger.warn("Webhook signature verification failed")
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.WEBHOOK_VERIFICATION_FAILED,
            status: 400,
            message: "Webhook signature verification failed"
          }
        }
      }

      if (e instanceof WebhookEventAlreadyProcessedError) {
        return {
          ok: true,
          data: { received: true }
        }
      }

      if (e instanceof WebhookProcessingFailedError) {
        this.logger.error("Failed to process webhook", {
          error: e instanceof Error ? e.message : String(e)
        })
        return {
          ok: false,
          error: {
            code: BILLING_ERROR_CODES.WEBHOOK_PROCESSING_FAILED,
            status: 500,
            message: "Failed to process webhook"
          }
        }
      }

      this.logger.error("Unexpected error in ProcessStripeWebhookHandler", {
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR,
          status: 500,
          message: "Internal server error"
        }
      }
    }
  }
}
