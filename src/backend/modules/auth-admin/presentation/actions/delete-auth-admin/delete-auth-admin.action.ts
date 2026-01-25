"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleDeleteAuthAdmin } from "../../handlers/delete-auth-admin/delete-auth-admin.handler"

export type DeleteAuthAdminActionResponse = ActionResponse<void>

export const deleteAuthAdminAction =
  async (): Promise<DeleteAuthAdminActionResponse> => {
    return await handleDeleteAuthAdmin()
  }
