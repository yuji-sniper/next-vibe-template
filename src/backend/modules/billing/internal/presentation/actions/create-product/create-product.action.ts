"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { CreateProductHandler } from "../../handlers/create-product/create-product.handler"
import { CreateProductHandlerToken } from "../../handlers/create-product/create-product.handler"

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
  return withRequestContext(async () => {
    const handler = await resolveContainer<CreateProductHandler>(
      CreateProductHandlerToken
    )
    return handler.handle(request)
  })
}
