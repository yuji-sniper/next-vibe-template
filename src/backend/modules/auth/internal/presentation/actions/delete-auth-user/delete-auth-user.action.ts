"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { DeleteAuthUserHandler } from "../../handlers/delete-auth-user/delete-auth-user.handler"
import { DeleteAuthUserHandlerToken } from "../../handlers/delete-auth-user/delete-auth-user.handler"

export type DeleteAuthUserActionResponse = ActionResponse<void>

export const deleteAuthUserAction =
  async (): Promise<DeleteAuthUserActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<DeleteAuthUserHandler>(
        DeleteAuthUserHandlerToken
      )
      return handler.handle()
    })
  }
