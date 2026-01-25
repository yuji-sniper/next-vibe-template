import { NextResponse } from "next/server"
import { resolveContainer } from "@/backend/bootstrap/container"
import {
  type ProcessWebhookUseCasePort,
  ProcessWebhookUseCasePortToken
} from "@/backend/modules/billing/application/commands/usecases/process-webhook/process-webhook.usecase.port"
import {
  WebhookEventAlreadyProcessedError,
  WebhookVerificationFailedError,
  WebhookProcessingFailedError
} from "@/backend/modules/billing/domain/webhook-event/webhook-event.errors"

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    const usecase = await resolveContainer<ProcessWebhookUseCasePort>(
      ProcessWebhookUseCasePortToken
    )

    await usecase.handle({ payload, signature })

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    if (error instanceof WebhookVerificationFailedError) {
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      )
    }

    if (error instanceof WebhookEventAlreadyProcessedError) {
      // 既に処理済みのイベントは成功として扱う
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (error instanceof WebhookProcessingFailedError) {
      return NextResponse.json(
        { error: "Failed to process webhook" },
        { status: 500 }
      )
    }

    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
