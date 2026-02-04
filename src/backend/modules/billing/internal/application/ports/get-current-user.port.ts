export interface GetCurrentUserPortOutput {
  userId: string
  email: string
}

export interface GetCurrentUserPort {
  handle(): Promise<GetCurrentUserPortOutput>
}

export const GetCurrentUserPortToken = Symbol("GetCurrentUserPort")
