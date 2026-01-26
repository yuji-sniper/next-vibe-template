"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleUpdateProduct } from "../../handlers/update-product/update-product.handler"

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
  return await handleUpdateProduct(request)
}
