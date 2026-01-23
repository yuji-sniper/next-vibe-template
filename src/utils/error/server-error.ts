import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

export class ServerError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly message: string,
    readonly details?: Record<string, unknown>
  ) {
    super()
    this.name = "ServerError"
  }
}

export class ValidationServerError extends ServerError {
  constructor(fieldErrors: Record<string, string>) {
    super(
      COMMON_ERROR_CODES.UNPROCESSABLE_ENTITY,
      422,
      "Validation error",
      fieldErrors
    )
    this.name = "ValidationServerError"
  }
}
