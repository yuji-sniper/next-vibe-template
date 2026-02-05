"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { NotificationListItemDto } from "@/backend/modules/notification/public/ports/find-notifications.usecase.port"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  FindNotificationsHandler,
  FindNotificationsHandlerInput
} from "../../handlers/find-notifications/find-notifications.handler"
import { FindNotificationsHandlerToken } from "../../handlers/find-notifications/find-notifications.handler"

export type FindNotificationsActionRequest = FindNotificationsHandlerInput

export type FindNotificationsActionResponse = ActionResponse<{
  notifications: NotificationListItemDto[]
  total: number
}>

export const findNotificationsAction = async (
  request: FindNotificationsActionRequest
): Promise<FindNotificationsActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindNotificationsHandler>(
      FindNotificationsHandlerToken
    )
    return handler.handle(request)
  })
}
