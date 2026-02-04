export class AuthAdminUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized")
    this.name = "AuthAdminUnauthorizedError"
  }
}

export class AuthAdminDeleteFailedError extends Error {
  constructor() {
    super("Failed to delete admin")
    this.name = "AuthAdminDeleteFailedError"
  }
}
