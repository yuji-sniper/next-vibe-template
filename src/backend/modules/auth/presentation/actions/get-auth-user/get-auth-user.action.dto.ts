import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"

export type GetAuthUserActionResponse = ActionResponse<{
  authUser: {
    id: string
    email: string
    name: string
  }
}>
