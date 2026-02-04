"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { UpdateProductHandler } from "../../handlers/update-product/update-product.handler"
import { UpdateProductHandlerToken } from "../../handlers/update-product/update-product.handler"

export type UpdateProductActionRequest = {
  productId: string
  name?: string
  description?: string
  active?: boolean
  features?: string[]
  displayOrder?: number
  metadata?: Record<string, string>
}

export type UpdateProductActionResponse = ActionResponse<{
  product: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    features: string[] | null
    displayOrder: number
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}>

export const updateProductAction = async (
  request: UpdateProductActionRequest
): Promise<UpdateProductActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<UpdateProductHandler>(
      UpdateProductHandlerToken
    )
    return handler.handle(request)
  })
}
