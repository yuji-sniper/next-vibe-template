export interface ProcessWebhookUseCasePortInput {
  payload: string
  signature: string
}

export interface ProcessWebhookUseCasePort {
  handle(input: ProcessWebhookUseCasePortInput): Promise<void>
}

export const ProcessWebhookUseCasePortToken = Symbol(
  "ProcessWebhookUseCasePort"
)
