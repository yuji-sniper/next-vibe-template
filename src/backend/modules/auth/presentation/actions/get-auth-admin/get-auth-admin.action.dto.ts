import type { ActionResponse } from "@/backend/modules/shared"

export type GetAuthAdminActionResponse = ActionResponse<{
  authAdmin: {
    id: string
    email: string
    name: string
  }
}>
