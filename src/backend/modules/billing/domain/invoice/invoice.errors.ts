export class InvoiceNotFoundError extends Error {
  constructor() {
    super("Invoice not found")
    this.name = "InvoiceNotFoundError"
  }
}

export class InvoiceAlreadyExistsError extends Error {
  constructor() {
    super("Invoice already exists")
    this.name = "InvoiceAlreadyExistsError"
  }
}

export class InvoiceProcessingFailedError extends Error {
  constructor() {
    super("Failed to process invoice")
    this.name = "InvoiceProcessingFailedError"
  }
}
