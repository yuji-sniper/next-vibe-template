export const paymentHistoryBaseKey = ["payment-history"] as const
export const paymentHistoryKey = () => [...paymentHistoryBaseKey] as const

export const invoiceHistoryBaseKey = ["invoice-history"] as const
export const invoiceHistoryKey = () => [...invoiceHistoryBaseKey] as const
