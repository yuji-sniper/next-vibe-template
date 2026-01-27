"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleArchiveProduct } from "../../handlers/archive-product/archive-product.handler"

export type ArchiveProductActionRequest = {
  productId: string
}

export type ArchiveProductActionResponse = ActionResponse<void>

export const archiveProductAction = async (
  request: ArchiveProductActionRequest
): Promise<ArchiveProductActionResponse> => {
  return await handleArchiveProduct(request)
}
