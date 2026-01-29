"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useDeleteAuthUserMutation } from "@/features/auth/hooks/mutations/useDeleteAuthUserMutation"
import { getQueryClient } from "@/lib/react-query/query-client"
import { AccountSettingsPresentational } from "./presentational"

export function AccountSettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()

  const deleteAccountMutation = useDeleteAuthUserMutation()

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync()
      getQueryClient().clear()
      router.push(`/${locale}/sign-in`)
    } catch {
      toast.error("アカウントの削除に失敗しました")
    }
  }

  return (
    <AccountSettingsPresentational
      isDialogOpen={isDialogOpen}
      isDeleting={deleteAccountMutation.isPending}
      onOpenDialog={handleOpenDialog}
      onCloseDialog={handleCloseDialog}
      onDeleteAccount={handleDeleteAccount}
    />
  )
}
