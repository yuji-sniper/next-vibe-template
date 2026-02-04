export interface ProcessStripeWebhookUseCasePortInput {
  payload: string
  signature: string
}

export interface ProcessStripeWebhookUseCasePort {
  handle(input: ProcessStripeWebhookUseCasePortInput): Promise<void>
}

export const ProcessStripeWebhookUseCasePortToken = Symbol(
  "ProcessStripeWebhookUseCasePort"
)
