import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"

export class AuthAdminUnauthorizedError extends UnauthorizedError {
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
