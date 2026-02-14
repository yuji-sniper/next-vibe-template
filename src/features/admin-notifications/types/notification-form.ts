import { z } from "zod"
import { AudienceType } from "./notification"

export const notificationFormSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(255, "タイトルは255文字以内で入力してください"),
  subject: z.string().min(1, "件名は必須です"),
  bodyText: z.string().min(1, "本文は必須です"),
  bodyHtml: z.string().optional().or(z.literal("")),
  sendAt: z
    .date({ error: "送信日時は必須です" })
    .refine(
      (date) => date > new Date(),
      "送信日時は未来の日時を指定してください"
    ),
  audienceType: z.enum(AudienceType, {
    error: "送信対象は必須です"
  }),
  audiencePayload: z.record(z.string(), z.unknown()).optional()
})

export type NotificationFormValues = z.infer<typeof notificationFormSchema>
