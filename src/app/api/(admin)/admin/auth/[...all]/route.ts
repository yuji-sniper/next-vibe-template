import { toNextJsHandler } from "better-auth/next-js"
import { authAdmin } from "@/backend/modules/auth-admin/infrastructure/auth/better-auth/auth-admin"

export const { GET, POST } = toNextJsHandler(authAdmin)
