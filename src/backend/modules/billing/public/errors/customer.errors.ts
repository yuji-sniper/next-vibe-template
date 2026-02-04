export class CustomerNotFoundError extends Error {
  constructor() {
    super("Customer not found")
    this.name = "CustomerNotFoundError"
  }
}

export class CustomerCreateFailedError extends Error {
  constructor() {
    super("Failed to create customer")
    this.name = "CustomerCreateFailedError"
  }
}
