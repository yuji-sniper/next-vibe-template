import { toNextJsHandler } from "better-auth/next-js"
import { authAdmin } from "@/backend/modules/auth-admin/infrastructure/auth/better-auth/auth"

export const { GET, POST } = toNextJsHandler(authAdmin)
