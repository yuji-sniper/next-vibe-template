import { z } from "zod"

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "商品名は必須です")
    .max(255, "商品名は255文字以内で入力してください"),
  description: z
    .string()
    .max(5000, "説明は5000文字以内で入力してください")
    .optional()
    .or(z.literal("")),
  features: z.array(z.string()).optional(),
  displayOrder: z
    .number()
    .int("表示順は整数で入力してください")
    .min(0, "表示順は0以上で入力してください")
    .optional(),
  active: z.boolean().optional()
})

export type ProductFormValues = z.infer<typeof productFormSchema>
