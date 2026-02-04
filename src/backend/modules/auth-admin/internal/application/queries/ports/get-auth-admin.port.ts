import type { AuthAdmin } from "@/backend/modules/auth-admin/internal/domain/auth-admin/auth-admin"

export interface GetAuthAdminPortOutput {
  authAdmin: AuthAdmin | null
}

export interface GetAuthAdminPort {
  handle(): Promise<GetAuthAdminPortOutput>
}

export const GetAuthAdminPortToken = Symbol("GetAuthAdminPort")
