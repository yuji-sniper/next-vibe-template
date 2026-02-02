"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authAdminClient } from "@/lib/better-auth/auth-admin-client"
import { getQueryClient } from "@/lib/react-query/query-client"

export function useSignOutAdmin() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      await authAdminClient.signOut()
    },
    onSuccess: () => {
      getQueryClient().clear()
      router.push("/sign-in")
    }
  })

  return {
    signOut: () => mutation.mutate(),
    isPending: mutation.isPending
  }
}
