"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  CancelNotificationHandler,
  CancelNotificationHandlerInput
} from "../../handlers/cancel-notification/cancel-notification.handler"
import { CancelNotificationHandlerToken } from "../../handlers/cancel-notification/cancel-notification.handler"

export type CancelNotificationActionRequest = CancelNotificationHandlerInput

export type CancelNotificationActionResponse = ActionResponse<{
  notification: {
    id: string
    title: string
    status: number
  }
}>

export const cancelNotificationAction = async (
  request: CancelNotificationActionRequest
): Promise<CancelNotificationActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<CancelNotificationHandler>(
      CancelNotificationHandlerToken
    )
    return handler.handle(request)
  })
}
