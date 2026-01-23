"use client"

import { useQuery } from "@tanstack/react-query"
import { getAuthUserQuery } from "../../queries/get-auth-user"
import { authUserKey } from "../../queries/keys"

export const useGetAuthUserQuery = (params: {
  redirectIfUnauthorized?: boolean
}) => {
  return useQuery({
    queryKey: authUserKey,
    queryFn: () =>
      getAuthUserQuery({
        redirectIfUnauthorized: params.redirectIfUnauthorized
      })
  })
}
