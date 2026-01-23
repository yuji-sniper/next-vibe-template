export const AUTH_ADMIN_ERROR_CODES = {
  UNAUTHORIZED: "AUTH_ADMIN_UNAUTHORIZED"
} as const
export type AuthAdminErrorCode =
  (typeof AUTH_ADMIN_ERROR_CODES)[keyof typeof AUTH_ADMIN_ERROR_CODES]
