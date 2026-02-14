"use client"

import { BellIcon } from "lucide-react"

export const NotificationEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <BellIcon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">通知はまだありません</h3>
      <p className="text-sm text-muted-foreground">
        通知を作成するには「新規作成」ボタンをクリックしてください。
      </p>
    </div>
  )
}
