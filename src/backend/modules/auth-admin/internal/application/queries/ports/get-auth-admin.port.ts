export interface GetAuthAdminPortOutput {
  authAdmin: {
    id: string
  } | null
}

export interface GetAuthAdminPort {
  handle(): Promise<GetAuthAdminPortOutput>
}

export const GetAuthAdminPortToken = Symbol("GetAuthAdminPort")
