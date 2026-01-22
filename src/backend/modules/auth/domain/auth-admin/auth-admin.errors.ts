export class AuthAdminUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized")
    this.name = "AuthAdminUnauthorizedError"
  }
}
