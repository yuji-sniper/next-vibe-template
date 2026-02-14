import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.coerce.number().default(3306),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_NAME_TEST: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_SECRET_ADMIN: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    AWS_REGION: z.string(),
    AWS_ROLE_ARN: z.string(),
    AWS_SCHEDULER_ROLE_ARN_NOTIFICATION: z.string(),
    AWS_SCHEDULER_GROUP_NAME_NOTIFICATION: z.string(),
    AWS_LAMBDA_ARN_NOTIFICATION_FANOUT: z.string()
  },
  client: {
    NEXT_PUBLIC_SERVICE_NAME: z.string(),
    NEXT_PUBLIC_SERVICE_NAME_ADMIN: z.string(),
    NEXT_PUBLIC_HOST: z.string(),
    NEXT_PUBLIC_HOST_ADMIN: z.string(),
    NEXT_PUBLIC_ORIGIN: z.string(),
    NEXT_PUBLIC_ORIGIN_ADMIN: z.string(),
    NEXT_PUBLIC_SUPPORT_EMAIL: z.email(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN: z.string()
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVICE_NAME: process.env.NEXT_PUBLIC_SERVICE_NAME,
    NEXT_PUBLIC_SERVICE_NAME_ADMIN: process.env.NEXT_PUBLIC_SERVICE_NAME_ADMIN,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    NEXT_PUBLIC_HOST_ADMIN: process.env.NEXT_PUBLIC_HOST_ADMIN,
    NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,
    NEXT_PUBLIC_ORIGIN_ADMIN: process.env.NEXT_PUBLIC_ORIGIN_ADMIN,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_ADMIN
  }
})
