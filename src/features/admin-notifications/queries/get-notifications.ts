import { findNotificationsAction } from "@/backend/modules/notification/internal/presentation/actions/find-notifications/find-notifications.action"
import { ServerError } from "@/utils/error/server-error"
import type {
  NotificationListItem,
  NotificationStatus
} from "../types/notification"

export type GetNotificationsQueryParams = {
  status?: NotificationStatus
  limit?: number
  offset?: number
}

export type GetNotificationsQueryResult = {
  notifications: NotificationListItem[]
  total: number
}

export const getNotificationsQuery = async (
  params: GetNotificationsQueryParams = {}
): Promise<GetNotificationsQueryResult> => {
  const res = await findNotificationsAction({
    status: params.status,
    limit: params.limit,
    offset: params.offset
  })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  const notifications: NotificationListItem[] = res.data.notifications.map(
    (n) => ({
      id: n.id,
      title: n.title,
      subject: n.subject,
      sendAt: n.sendAt.toString(),
      audienceType: n.audienceType,
      status: n.status,
      createdAt: n.createdAt.toString()
    })
  )

  return { notifications, total: res.data.total }
}
