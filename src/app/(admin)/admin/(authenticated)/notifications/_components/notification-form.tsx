"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/datetime-picker"
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
import { Textarea } from "@/components/ui/textarea"
import { AudienceType } from "@/features/admin-notifications/types/notification"
import {
  type NotificationFormValues,
  notificationFormSchema
} from "@/features/admin-notifications/types/notification-form"

type NotificationFormProps = {
  mode?: "create" | "edit"
  defaultValues?: Partial<NotificationFormValues>
  onSubmit: (values: NotificationFormValues) => void
  isPending: boolean
  submitLabel?: string
}

export const NotificationForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "予約する"
}: NotificationFormProps) => {
  const form = useForm({
    resolver: zodResolver(notificationFormSchema),
    mode: "onChange",
    defaultValues: {
      title: defaultValues?.title ?? "",
      subject: defaultValues?.subject ?? "",
      bodyText: defaultValues?.bodyText ?? "",
      bodyHtml: defaultValues?.bodyHtml ?? "",
      sendAt: defaultValues?.sendAt ?? undefined,
      audienceType: defaultValues?.audienceType ?? undefined,
      audiencePayload: defaultValues?.audiencePayload ?? undefined
    }
  })

  const watchAudienceType = form.watch("audienceType")

  const handleFormSubmit = (data: NotificationFormValues) => {
    const audiencePayload =
      data.audienceType === AudienceType.ALL ? undefined : data.audiencePayload

    onSubmit({
      ...data,
      audiencePayload
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                タイトル（管理用） <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="2024年1月キャンペーン" {...field} />
              </FormControl>
              <FormDescription>管理画面での識別用タイトル</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                メール件名 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="【重要】サービスメンテナンスのお知らせ"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                本文（テキスト） <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="メール本文を入力"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyHtml"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文（HTML）</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="HTML形式のメール本文（任意）"
                  className="min-h-32 font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                HTML形式のメール本文を入力できます（任意）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sendAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                送信日時 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <DateTimePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>未来の日時を指定してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audienceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                送信対象 <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="送信対象を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={AudienceType.ALL.toString()}>
                    全ユーザー
                  </SelectItem>
                  <SelectItem value={AudienceType.SEGMENT.toString()}>
                    セグメント指定
                  </SelectItem>
                  <SelectItem value={AudienceType.SINGLE.toString()}>
                    個別指定
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchAudienceType === AudienceType.SEGMENT && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">セグメント条件</h4>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="audiencePayload.plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プラン</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="プラン名を入力"
                        {...field}
                        value={field.value?.toString() ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="audiencePayload.createdAfter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>登録日（以降）</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value?.toString() ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="audiencePayload.createdBefore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>登録日（以前）</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value?.toString() ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {watchAudienceType === AudienceType.SINGLE && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="text-sm font-medium">個別指定</h4>
            <FormField
              control={form.control}
              name="audiencePayload.userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ユーザーID <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ユーザーIDを入力"
                      {...field}
                      value={field.value?.toString() ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "予約中..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
