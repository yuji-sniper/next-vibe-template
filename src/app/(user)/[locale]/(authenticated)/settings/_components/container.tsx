"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"
import { deleteAuthUserAction } from "@/backend/modules/auth/presentation/actions/delete-auth-user/delete-auth-user.action"
import { SettingsPresentational } from "./presentational"

export function SettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const result = await deleteAuthUserAction()
      if (!result.ok) {
        throw new Error(result.error.message)
      }
    },
    onSuccess: () => {
      queryClient.clear()
      router.push(`/${locale}/sign-in`)
    }
  })

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
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
