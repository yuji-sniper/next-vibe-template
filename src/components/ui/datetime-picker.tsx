"use client"

import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/shadcn/utils"

type DateTimePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  disabled
}: DateTimePickerProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined)
      return
    }

    const hours = value?.getHours() ?? 9
    const minutes = value?.getMinutes() ?? 0
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    onChange(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value
    if (!timeValue) return

    const [hours, minutes] = timeValue.split(":").map(Number)
    const newDate = value ? new Date(value) : new Date()
    newDate.setHours(hours, minutes, 0, 0)
    onChange(newDate)
  }

  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : ""

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="size-4" />
            {value ? format(value, "yyyy/MM/dd", { locale: ja }) : "日付を選択"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            locale={ja}
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        disabled={disabled}
        className="w-[130px]"
      />
    </div>
  )
}
