export class CheckoutSessionFailedError extends Error {
  constructor() {
    super("Failed to create checkout session")
    this.name = "CheckoutSessionFailedError"
  }
}
