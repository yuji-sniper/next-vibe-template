"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleGetAuthAdmin } from "../../handlers/get-auth-admin/get-auth-admin.handler"

export type GetAuthAdminActionResponse = ActionResponse<{
  authAdmin: {
    id: string
    email: string
    name: string
  }
}>

export const getAuthAdminAction =
  async (): Promise<GetAuthAdminActionResponse> => {
    return await handleGetAuthAdmin()
  }
