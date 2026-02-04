import type { AuthUser } from "../../domain/auth-user/auth-user"

export interface GetAuthUserPortOutput {
  authUser: AuthUser | null
}

export interface GetAuthUserPort {
  handle(): Promise<GetAuthUserPortOutput>
}

export const GetAuthUserPortToken = Symbol("GetAuthUserPort")
