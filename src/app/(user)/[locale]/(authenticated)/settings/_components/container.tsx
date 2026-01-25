"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"
import { SettingsPresentational } from "./presentational"

export function SettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // TODO: バックエンドのアカウント削除APIを実装後に呼び出す
      // 現在はプレースホルダーとして実装
      throw new Error("アカウント削除APIは未実装です")
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
