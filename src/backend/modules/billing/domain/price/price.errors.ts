export class PriceNotFoundError extends Error {
  constructor(priceId?: string) {
    super(priceId ? `Price not found: ${priceId}` : "Price not found")
    this.name = "PriceNotFoundError"
  }
}

export class PriceCreateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to create price")
    this.name = "PriceCreateFailedError"
  }
}

export class PriceArchiveFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to archive price")
    this.name = "PriceArchiveFailedError"
  }
}
