export const AUTH_ERROR_CODES = {
  UNAUTHORIZED: "AUTH_UNAUTHORIZED"
} as const
export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES]
