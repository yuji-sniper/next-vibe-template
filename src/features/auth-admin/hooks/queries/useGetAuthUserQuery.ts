"use client"

import { useQuery } from "@tanstack/react-query"
import { getAuthAdminQuery } from "../../queries/get-auth-admin"
import { authAdminKey } from "../../queries/keys"

export const useGetAuthAdminQuery = (params: {
  redirectIfUnauthorized?: boolean
}) => {
  return useQuery({
    queryKey: authAdminKey,
    queryFn: () =>
      getAuthAdminQuery({
        redirectIfUnauthorized: params.redirectIfUnauthorized
      })
  })
}
