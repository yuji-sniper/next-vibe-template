export class PaymentNotFoundError extends Error {
  constructor() {
    super("Payment not found")
    this.name = "PaymentNotFoundError"
  }
}

export class PaymentCreateFailedError extends Error {
  constructor() {
    super("Failed to create payment")
    this.name = "PaymentCreateFailedError"
  }
}

export class PaymentUpdateFailedError extends Error {
  constructor() {
    super("Failed to update payment")
    this.name = "PaymentUpdateFailedError"
  }
}
