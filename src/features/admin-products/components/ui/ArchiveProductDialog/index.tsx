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

type ArchiveProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  isArchiving: boolean
  onConfirm: () => void
}

export const ArchiveProductDialog = ({
  open,
  onOpenChange,
  productName,
  isArchiving,
  onConfirm
}: ArchiveProductDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>商品をアーカイブ</AlertDialogTitle>
          <AlertDialogDescription>
            「{productName}」をアーカイブしますか？この操作は取り消せます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isArchiving}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isArchiving}
          >
            {isArchiving ? "アーカイブ中..." : "アーカイブ"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
