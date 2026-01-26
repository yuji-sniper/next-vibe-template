import type { z } from "zod"

/**
 * Zodエラーを { "path.to.field": "error message" } 形式に変換
 */
export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {}

  for (const issue of error.issues) {
    const path = issue.path.join(".")
    // 同じパスに複数エラーがある場合は最初のエラーのみ
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message
    }
  }

  return fieldErrors
}
