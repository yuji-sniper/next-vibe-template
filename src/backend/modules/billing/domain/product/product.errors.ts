export class ProductNotFoundError extends Error {
  constructor(productId?: string) {
    super(productId ? `Product not found: ${productId}` : "Product not found")
    this.name = "ProductNotFoundError"
  }
}

export class ProductCreateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to create product")
    this.name = "ProductCreateFailedError"
  }
}

export class ProductUpdateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to update product")
    this.name = "ProductUpdateFailedError"
  }
}

export class ProductArchiveFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to archive product")
    this.name = "ProductArchiveFailedError"
  }
}

export class ProductNotSyncedError extends Error {
  constructor(productId?: string) {
    super(
      productId
        ? `Product not synced with Stripe: ${productId}`
        : "Product not synced with Stripe"
    )
    this.name = "ProductNotSyncedError"
  }
}

export class ProductCannotArchiveViaUpdateError extends Error {
  constructor() {
    super("Cannot archive product via update. Use archive endpoint instead.")
    this.name = "ProductCannotArchiveViaUpdateError"
  }
}
