"use server"

import { handleGetAuthAdmin } from "../../handlers/get-auth-admin/get-auth-admin.handler"
import type { GetAuthAdminActionResponse } from "./get-auth-admin.action.dto"

export const getAuthAdminAction =
  async (): Promise<GetAuthAdminActionResponse> => {
    return await handleGetAuthAdmin()
  }
