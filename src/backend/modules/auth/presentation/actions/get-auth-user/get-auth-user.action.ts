"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleGetAuthUser } from "../../handlers/get-auth-user/get-auth-user.handler"

export type GetAuthUserActionResponse = ActionResponse<{
  authUser: {
    id: string
    email: string
    name: string
  }
}>

export const getAuthUserAction =
  async (): Promise<GetAuthUserActionResponse> => {
    return await handleGetAuthUser()
  }
