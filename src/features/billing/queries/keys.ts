export const paymentHistoryBaseKey = ["payment-history"] as const
export const paymentHistoryKey = () => [...paymentHistoryBaseKey] as const
