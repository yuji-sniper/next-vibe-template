export class AuthUserUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized")
    this.name = "AuthUserUnauthorizedError"
  }
}

export class AuthUserDeleteFailedError extends Error {
  constructor() {
    super("Failed to delete user")
    this.name = "AuthUserDeleteFailedError"
  }
}
