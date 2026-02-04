"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  CreateNotificationHandler,
  CreateNotificationHandlerInput
} from "../../handlers/create-notification/create-notification.handler"
import { CreateNotificationHandlerToken } from "../../handlers/create-notification/create-notification.handler"

export type CreateNotificationActionRequest = CreateNotificationHandlerInput

export type CreateNotificationActionResponse = ActionResponse<{
  notification: {
    id: string
    title: string
    subject: string
    sendAt: Date
    audienceType: number
    status: number
  }
}>

export const createNotificationAction = async (
  request: CreateNotificationActionRequest
): Promise<CreateNotificationActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<CreateNotificationHandler>(
      CreateNotificationHandlerToken
    )
    return handler.handle(request)
  })
}
