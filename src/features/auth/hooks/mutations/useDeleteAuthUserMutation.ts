"use client"

import { useMutation } from "@tanstack/react-query"
import { deleteAuthUserMutation } from "../../mutations/delete-auth-user"

export const useDeleteAuthUserMutation = () => {
  return useMutation({
    mutationFn: deleteAuthUserMutation
  })
}
