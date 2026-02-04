import { NextResponse } from "next/server"
import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ProcessStripeWebhookHandler } from "@/backend/modules/billing/internal/presentation/handlers/process-stripe-webhook/process-stripe-webhook.handler"
import { ProcessStripeWebhookHandlerToken } from "@/backend/modules/billing/internal/presentation/handlers/process-stripe-webhook/process-stripe-webhook.handler"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  const result = await withRequestContext(async () => {
    const handler = await resolveContainer<ProcessStripeWebhookHandler>(
      ProcessStripeWebhookHandlerToken
    )
    return handler.handle({ payload, signature })
  })

  if (result.ok) {
    return NextResponse.json(
      { received: result.data.received },
      { status: 200 }
    )
  }

  return NextResponse.json(
    { error: result.error.message },
    { status: result.error.status }
  )
}
