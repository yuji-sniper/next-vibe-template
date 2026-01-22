export class AuthUserUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized")
    this.name = "AuthUserUnauthorizedError"
  }
}
