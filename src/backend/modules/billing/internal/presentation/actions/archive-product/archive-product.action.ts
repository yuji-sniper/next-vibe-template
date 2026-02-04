"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { ArchiveProductHandler } from "../../handlers/archive-product/archive-product.handler"
import { ArchiveProductHandlerToken } from "../../handlers/archive-product/archive-product.handler"

export type ArchiveProductActionRequest = {
  productId: string
}

export type ArchiveProductActionResponse = ActionResponse<void>

export const archiveProductAction = async (
  request: ArchiveProductActionRequest
): Promise<ArchiveProductActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<ArchiveProductHandler>(
      ArchiveProductHandlerToken
    )
    return handler.handle(request)
  })
}
