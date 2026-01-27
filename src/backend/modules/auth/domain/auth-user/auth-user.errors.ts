import { UnauthorizedError } from "@/backend/modules/shared/domain/errors/unauthorized.error"

export class AuthUserUnauthorizedError extends UnauthorizedError {
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
