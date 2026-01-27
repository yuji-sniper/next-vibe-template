"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  type PriceFormValues,
  priceFormSchema
} from "@/features/admin-products/types/price-form"

type PriceFormProps = {
  onSubmit: (values: PriceFormValues) => void
  onCancel: () => void
  isPending: boolean
}

export const PriceForm = ({
  onSubmit,
  onCancel,
  isPending
}: PriceFormProps) => {
  const form = useForm({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      unitAmount: 0 as number,
      currency: "jpy",
      type: "one_time" as const,
      recurringInterval: undefined as "month" | "year" | undefined,
      recurringIntervalCount: 1,
      displayName: ""
    }
  })

  const watchType = form.watch("type")

  const handleFormSubmit = (data: {
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval?: "month" | "year"
    recurringIntervalCount: number
    displayName?: string
  }) => {
    onSubmit({
      ...data,
      recurringInterval:
        data.type === "recurring" ? data.recurringInterval : undefined,
      recurringIntervalCount:
        data.type === "recurring" ? data.recurringIntervalCount : 1
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表示名</FormLabel>
              <FormControl>
                <Input placeholder="例: 月額プラン、年額プラン" {...field} />
              </FormControl>
              <FormDescription>価格の表示名（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                金額 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ¥
                  </span>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1000"
                    className="pl-8"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === "" ? 0 : Number(value))
                    }}
                    value={field.value || ""}
                  />
                </div>
              </FormControl>
              <FormDescription>円単位で入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                タイプ <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="タイプを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="one_time">単発決済</SelectItem>
                  <SelectItem value="recurring">サブスクリプション</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                単発決済またはサブスクリプションを選択
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === "recurring" && (
          <>
            <FormField
              control={form.control}
              name="recurringInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    課金間隔 <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="課金間隔を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="month">月</SelectItem>
                      <SelectItem value="year">年</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    課金の周期を選択してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurringIntervalCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>課金間隔数</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="1"
                      className="w-32"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? 1 : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    例: 3ヶ月ごとの場合は「3」を入力（デフォルト: 1）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "作成中..." : "価格を作成"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
