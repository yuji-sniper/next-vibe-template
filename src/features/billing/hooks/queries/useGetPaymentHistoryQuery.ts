"use client"

import { useQuery } from "@tanstack/react-query"
import { getPaymentHistoryQuery } from "../../queries/get-payment-history"
import { paymentHistoryKey } from "../../queries/keys"

export const useGetPaymentHistoryQuery = () => {
  return useQuery({
    queryKey: paymentHistoryKey(),
    queryFn: getPaymentHistoryQuery
  })
}
