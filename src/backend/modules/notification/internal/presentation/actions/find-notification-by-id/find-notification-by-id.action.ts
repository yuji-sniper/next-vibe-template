"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { NotificationDetailDto } from "@/backend/modules/notification/public/ports/find-notification-by-id.usecase.port"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  FindNotificationByIdHandler,
  FindNotificationByIdHandlerInput
} from "../../handlers/find-notification-by-id/find-notification-by-id.handler"
import { FindNotificationByIdHandlerToken } from "../../handlers/find-notification-by-id/find-notification-by-id.handler"

export type FindNotificationByIdActionRequest = FindNotificationByIdHandlerInput

export type FindNotificationByIdActionResponse = ActionResponse<{
  notification: NotificationDetailDto
}>

export const findNotificationByIdAction = async (
  request: FindNotificationByIdActionRequest
): Promise<FindNotificationByIdActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindNotificationByIdHandler>(
      FindNotificationByIdHandlerToken
    )
    return handler.handle(request)
  })
}
