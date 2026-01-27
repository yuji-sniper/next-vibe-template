export interface RequireAuthAdminPortOutput {
  adminId: string
}

export interface RequireAuthAdminPort {
  handle(): Promise<RequireAuthAdminPortOutput>
}

export const RequireAuthAdminPortToken = Symbol("RequireAuthAdminPort")
