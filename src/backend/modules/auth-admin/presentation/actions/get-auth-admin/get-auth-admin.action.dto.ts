import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"

export type GetAuthAdminActionResponse = ActionResponse<{
  authAdmin: {
    id: string
    email: string
    name: string
  }
}>
