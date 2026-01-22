import type { AuthUser } from "../../../domain/auth-user/auth-user"

export interface GetAuthUserPortOutput {
  authUser: AuthUser
}

export interface GetAuthUserPort {
  handle(): Promise<GetAuthUserPortOutput>
}

export const GetAuthUserPortToken = Symbol("GetAuthUserPort")
