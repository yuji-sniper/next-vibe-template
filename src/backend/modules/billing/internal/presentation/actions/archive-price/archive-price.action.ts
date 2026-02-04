"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { ArchivePriceHandler } from "../../handlers/archive-price/archive-price.handler"
import { ArchivePriceHandlerToken } from "../../handlers/archive-price/archive-price.handler"

export type ArchivePriceActionRequest = {
  priceId: string
}

export type ArchivePriceActionResponse = ActionResponse<void>

export const archivePriceAction = async (
  request: ArchivePriceActionRequest
): Promise<ArchivePriceActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<ArchivePriceHandler>(
      ArchivePriceHandlerToken
    )
    return handler.handle(request)
  })
}
