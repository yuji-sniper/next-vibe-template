"use server"

import { handleGetAuthUser } from "../../handlers/get-auth-user/get-auth-user.handler"
import type { GetAuthUserActionResponse } from "./get-auth-user.action.dto"

export const getAuthUserAction =
  async (): Promise<GetAuthUserActionResponse> => {
    return await handleGetAuthUser()
  }
