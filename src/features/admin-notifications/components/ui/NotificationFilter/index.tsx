"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  type NotificationFilterStatus,
  NotificationStatus
} from "../../../types/notification"

const valueMap: Record<string, NotificationFilterStatus> = {
  all: "all",
  [String(NotificationStatus.SCHEDULED)]: NotificationStatus.SCHEDULED,
  [String(NotificationStatus.COMPLETED)]: NotificationStatus.COMPLETED,
  [String(NotificationStatus.CANCELLED)]: NotificationStatus.CANCELLED
}

type NotificationFilterProps = {
  value: NotificationFilterStatus
  onChange: (value: NotificationFilterStatus) => void
}

export const NotificationFilter = ({
  value,
  onChange
}: NotificationFilterProps) => {
  const handleChange = (val: string) => {
    const mapped = valueMap[val]
    if (mapped !== undefined) {
      onChange(mapped)
    }
  }

  return (
    <Select value={String(value)} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="ステータス" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべて</SelectItem>
        <SelectItem value={String(NotificationStatus.SCHEDULED)}>
          予約済み
        </SelectItem>
        <SelectItem value={String(NotificationStatus.COMPLETED)}>
          送信完了
        </SelectItem>
        <SelectItem value={String(NotificationStatus.CANCELLED)}>
          キャンセル
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
