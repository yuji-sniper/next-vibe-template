"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

type SettingsPresentationalProps = {
  isDialogOpen: boolean
  isDeleting: boolean
  onOpenDialog: () => void
  onCloseDialog: () => void
  onDeleteAccount: () => void
}

export function SettingsPresentational({
  isDialogOpen,
  isDeleting,
  onOpenDialog,
  onCloseDialog,
  onDeleteAccount
}: SettingsPresentationalProps) {
  const t = useTranslations("settings")

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-2xl font-bold">{t("heading")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("deleteAccount.title")}</CardTitle>
          <CardDescription>{t("deleteAccount.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onOpenDialog}>
            {t("deleteAccount.button")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("deleteAccount.dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteAccount.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                {t("deleteAccount.dialog.cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("deleteAccount.dialog.deleting")
                : t("deleteAccount.dialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
