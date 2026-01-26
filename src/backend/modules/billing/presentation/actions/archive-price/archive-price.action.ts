"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleArchivePrice } from "../../handlers/archive-price/archive-price.handler"

export type ArchivePriceActionRequest = {
  priceId: string
}

export type ArchivePriceActionResponse = ActionResponse<void>

export const archivePriceAction = async (
  request: ArchivePriceActionRequest
): Promise<ArchivePriceActionResponse> => {
  return await handleArchivePrice(request)
}
