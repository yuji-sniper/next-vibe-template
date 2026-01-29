export class SubscriptionNotFoundError extends Error {
  constructor() {
    super("Subscription not found")
    this.name = "SubscriptionNotFoundError"
  }
}

export class SubscriptionAlreadyExistsError extends Error {
  constructor() {
    super("Subscription already exists")
    this.name = "SubscriptionAlreadyExistsError"
  }
}

export class SubscriptionCancelFailedError extends Error {
  constructor() {
    super("Failed to cancel subscription")
    this.name = "SubscriptionCancelFailedError"
  }
}

export class SubscriptionUpdateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to update subscription")
    this.name = "SubscriptionUpdateFailedError"
  }
}

export class SubscriptionCheckoutSessionFailedError extends Error {
  constructor() {
    super("Failed to create subscription checkout session")
    this.name = "SubscriptionCheckoutSessionFailedError"
  }
}
