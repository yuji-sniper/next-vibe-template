export const AUTH_ERROR_CODES = {
  UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  DELETE_FAILED: "AUTH_DELETE_FAILED"
} as const
export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES]
