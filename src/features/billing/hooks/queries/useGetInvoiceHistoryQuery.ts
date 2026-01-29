"use client"

import { useQuery } from "@tanstack/react-query"
import { getInvoiceHistoryQuery } from "../../queries/get-invoice-history"
import { invoiceHistoryKey } from "../../queries/keys"

export const useGetInvoiceHistoryQuery = () => {
  return useQuery({
    queryKey: invoiceHistoryKey(),
    queryFn: getInvoiceHistoryQuery
  })
}
