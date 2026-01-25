"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleDeleteAuthUser } from "../../handlers/delete-auth-user/delete-auth-user.handler"

export type DeleteAuthUserActionResponse = ActionResponse<void>

export const deleteAuthUserAction =
  async (): Promise<DeleteAuthUserActionResponse> => {
    return await handleDeleteAuthUser()
  }
