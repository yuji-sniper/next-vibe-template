"use client"

import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NotificationFormValues } from "@/features/admin-notifications/types/notification-form"
import { NotificationForm } from "../../_components/notification-form"

type NotificationCreatePresentationalProps = {
  onSubmit: (values: NotificationFormValues) => void
  onCancel: () => void
  isPending: boolean
}

export const NotificationCreatePresentational = ({
  onSubmit,
  onCancel,
  isPending
}: NotificationCreatePresentationalProps) => {
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeftIcon className="size-4" />
          お知らせ一覧に戻る
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>お知らせ作成</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationForm onSubmit={onSubmit} isPending={isPending} />
        </CardContent>
      </Card>
    </div>
  )
}
