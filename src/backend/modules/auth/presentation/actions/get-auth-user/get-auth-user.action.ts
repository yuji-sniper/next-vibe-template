"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { GetAuthUserHandler } from "../../handlers/get-auth-user/get-auth-user.handler"
import { GetAuthUserHandlerToken } from "../../handlers/get-auth-user/get-auth-user.handler"

export type GetAuthUserActionResponse = ActionResponse<{
  authUser: {
    id: string
    email: string
    name: string
  }
}>

export const getAuthUserAction =
  async (): Promise<GetAuthUserActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<GetAuthUserHandler>(
        GetAuthUserHandlerToken
      )
      return handler.handle()
    })
  }
