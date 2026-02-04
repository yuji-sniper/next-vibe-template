export interface GetCurrentAdminPortOutput {
  adminId: string | null
}

export interface GetCurrentAdminPort {
  handle(): Promise<GetCurrentAdminPortOutput>
}

export const GetCurrentAdminPortToken = Symbol("GetCurrentAdminPort")
