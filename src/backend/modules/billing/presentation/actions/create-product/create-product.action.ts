"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleCreateProduct } from "../../handlers/create-product/create-product.handler"

export type CreateProductActionRequest = {
  name: string
  description?: string
  features?: string[]
  displayOrder?: number
  metadata?: Record<string, string>
}

export type CreateProductActionResponse = ActionResponse<{
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

export const createProductAction = async (
  request: CreateProductActionRequest
): Promise<CreateProductActionResponse> => {
  return await handleCreateProduct(request)
}
