import { NextResponse } from "next/server"
import { handleProcessStripeWebhook } from "@/backend/modules/billing/presentation/handlers/process-stripe-webhook/process-stripe-webhook.handler"

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  const result = await handleProcessStripeWebhook({ payload, signature })

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
