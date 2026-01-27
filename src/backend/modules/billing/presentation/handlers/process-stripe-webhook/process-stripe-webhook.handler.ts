import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type ProcessStripeWebhookUseCasePort,
  ProcessStripeWebhookUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/process-stripe-webhook/process-stripe-webhook.usecase.port"
import {
  WebhookEventAlreadyProcessedError,
  WebhookProcessingFailedError,
  WebhookVerificationFailedError
} from "@/backend/modules/billing/domain/webhook-event/webhook-event.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { BILLING_ERROR_CODES } from "@/shared/errors/billing.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

type ProcessStripeWebhookHandlerInput = {
  payload: string
  signature: string
}

type ProcessStripeWebhookHandlerResult = Result<{
  received: true
}>

export const handleProcessStripeWebhook = async (
  input: ProcessStripeWebhookHandlerInput
): Promise<ProcessStripeWebhookHandlerResult> => {
  const usecase = await resolveContainer<ProcessStripeWebhookUseCasePort>(
    ProcessStripeWebhookUseCasePortToken
  )

  try {
    await usecase.handle({
      payload: input.payload,
      signature: input.signature
    })

    return {
      ok: true,
      data: { received: true }
    }
  } catch (e: unknown) {
    console.error(e)

    if (e instanceof WebhookVerificationFailedError) {
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
      // 既に処理済みのイベントは成功として扱う
      return {
        ok: true,
        data: { received: true }
      }
    }

    if (e instanceof WebhookProcessingFailedError) {
      return {
        ok: false,
        error: {
          code: BILLING_ERROR_CODES.WEBHOOK_PROCESSING_FAILED,
          status: 500,
          message: "Failed to process webhook"
        }
      }
    }

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
