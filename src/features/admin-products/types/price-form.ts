import { z } from "zod"

export const priceFormSchema = z
  .object({
    unitAmount: z
      .number()
      .int("金額は整数で入力してください")
      .min(1, "金額は1以上を入力してください"),
    currency: z.string(),
    type: z.enum(["one_time", "recurring"]),
    recurringInterval: z.enum(["month", "year"]).optional(),
    recurringIntervalCount: z
      .number()
      .int("課金間隔数は整数で入力してください")
      .min(1, "課金間隔数は1以上を入力してください"),
    displayName: z
      .string()
      .max(255, "表示名は255文字以内で入力してください")
      .optional()
      .or(z.literal(""))
  })
  .superRefine((data, ctx) => {
    if (data.type === "recurring" && !data.recurringInterval) {
      ctx.addIssue({
        code: "custom",
        message: "サブスクリプションの場合、課金間隔は必須です",
        path: ["recurringInterval"]
      })
    }
  })

export type PriceFormValues = z.infer<typeof priceFormSchema>
