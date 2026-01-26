export class WebhookEvent {
  private constructor(
    public readonly id: string,
    public readonly stripeEventId: string,
    public readonly eventType: string,
    public processed: boolean,
    public readonly createdAt: Date
  ) {}

  static create(params: {
    id: string
    stripeEventId: string
    eventType: string
  }): WebhookEvent {
    return new WebhookEvent(
      params.id,
      params.stripeEventId,
      params.eventType,
      false,
      new Date()
    )
  }

  static reconstruct(params: {
    id: string
    stripeEventId: string
    eventType: string
    processed: boolean
    createdAt: Date
  }): WebhookEvent {
    return new WebhookEvent(
      params.id,
      params.stripeEventId,
      params.eventType,
      params.processed,
      params.createdAt
    )
  }

  markAsProcessed(): void {
    this.processed = true
  }
}
