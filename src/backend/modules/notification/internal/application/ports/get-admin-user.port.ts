export interface GetAdminUserPortOutput {
  adminUserId: string
  email: string
}

export interface GetAdminUserPort {
  handle(): Promise<GetAdminUserPortOutput>
}

export const GetAdminUserPortToken = Symbol("GetAdminUserPort")
