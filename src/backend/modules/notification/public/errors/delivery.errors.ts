export class DeliveryNotFoundError extends Error {
  constructor(deliveryId?: number) {
    super(
      deliveryId ? `Delivery not found: ${deliveryId}` : "Delivery not found"
    )
    this.name = "DeliveryNotFoundError"
  }
}

export class DeliveryBulkInsertFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to bulk insert deliveries")
    this.name = "DeliveryBulkInsertFailedError"
  }
}

export class DeliveryUpdateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to update delivery")
    this.name = "DeliveryUpdateFailedError"
  }
}
