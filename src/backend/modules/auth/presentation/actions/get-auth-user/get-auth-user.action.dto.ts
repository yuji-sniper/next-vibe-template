import type { ActionResponse } from "@/backend/modules/shared"

export type GetAuthUserActionResponse = ActionResponse<{
  authUser: {
    id: string
    email: string
    name: string
  }
}>
