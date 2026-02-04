"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { GetAuthAdminHandler } from "../../handlers/get-auth-admin/get-auth-admin.handler"
import { GetAuthAdminHandlerToken } from "../../handlers/get-auth-admin/get-auth-admin.handler"

export type GetAuthAdminActionResponse = ActionResponse<{
  authAdmin: {
    id: string
    email: string
    name: string
  }
}>

export const getAuthAdminAction =
  async (): Promise<GetAuthAdminActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<GetAuthAdminHandler>(
        GetAuthAdminHandlerToken
      )
      return handler.handle()
    })
  }
