import type { AuthAdmin } from "../../../domain/auth-admin/auth-admin"

export interface GetAuthAdminPortOutput {
  authAdmin: AuthAdmin
}

export interface GetAuthAdminPort {
  handle(): Promise<GetAuthAdminPortOutput>
}

export const GetAuthAdminPortToken = Symbol("GetAuthAdminPort")
