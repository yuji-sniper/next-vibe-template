"use client"

import { useQuery } from "@tanstack/react-query"
import { getAuthAdminQuery } from "../../queries/get-auth-admin"
import { authAdminKey } from "../../queries/keys"

export const useGetAuthAdminQuery = () => {
  return useQuery({
    queryKey: authAdminKey,
    queryFn: () => getAuthAdminQuery()
  })
}
