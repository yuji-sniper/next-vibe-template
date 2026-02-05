"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  UpdateNotificationHandler,
  UpdateNotificationHandlerInput
} from "../../handlers/update-notification/update-notification.handler"
import { UpdateNotificationHandlerToken } from "../../handlers/update-notification/update-notification.handler"

export type UpdateNotificationActionRequest = UpdateNotificationHandlerInput

export type UpdateNotificationActionResponse = ActionResponse<{
  notification: {
    id: string
    title: string
    subject: string
    sendAt: Date
    audienceType: number
    status: number
  }
}>

export const updateNotificationAction = async (
  request: UpdateNotificationActionRequest
): Promise<UpdateNotificationActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<UpdateNotificationHandler>(
      UpdateNotificationHandlerToken
    )
    return handler.handle(request)
  })
}
