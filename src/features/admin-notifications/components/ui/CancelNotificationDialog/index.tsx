"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

type CancelNotificationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  notificationTitle: string
  isCanceling: boolean
  onCancel: () => void
}

export const CancelNotificationDialog = ({
  open,
  onOpenChange,
  notificationTitle,
  isCanceling,
  onCancel
}: CancelNotificationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>通知をキャンセルしますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{notificationTitle}
            」のキャンセルを実行します。この操作は取り消せません。予約された送信はキャンセルされます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCanceling}>戻る</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onCancel}
            disabled={isCanceling}
          >
            {isCanceling ? "キャンセル中..." : "キャンセルする"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
