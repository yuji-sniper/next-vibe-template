export class WebhookVerificationFailedError extends Error {
  constructor() {
    super("Webhook signature verification failed")
    this.name = "WebhookVerificationFailedError"
  }
}

export class WebhookProcessingFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to process webhook")
    this.name = "WebhookProcessingFailedError"
  }
}

export class WebhookEventAlreadyProcessedError extends Error {
  constructor() {
    super("Webhook event already processed")
    this.name = "WebhookEventAlreadyProcessedError"
  }
}
