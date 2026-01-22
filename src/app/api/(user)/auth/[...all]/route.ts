import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/backend/modules/auth/infrastructure/auth/better-auth/auth"

export const { GET, POST } = toNextJsHandler(auth)
