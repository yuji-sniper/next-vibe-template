import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/backend/modules/auth/internal/infrastructure/auth/better-auth/auth"

export const { GET, POST } = toNextJsHandler(auth)
