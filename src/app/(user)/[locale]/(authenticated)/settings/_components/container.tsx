"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"
import { useDeleteAuthUserMutation } from "@/features/auth/hooks/mutations/useDeleteAuthUserMutation"
import { SettingsPresentational } from "./presentational"

export function SettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteAccountMutation = useDeleteAuthUserMutation()

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDeleteAccount = async () => {
    await deleteAccountMutation.mutateAsync()
    queryClient.clear()
    router.push(`/${locale}/sign-in`)
  }

  return (
    <SettingsPresentational
      isDialogOpen={isDialogOpen}
      isDeleting={deleteAccountMutation.isPending}
      onOpenDialog={handleOpenDialog}
      onCloseDialog={handleCloseDialog}
      onDeleteAccount={handleDeleteAccount}
    />
  )
}
