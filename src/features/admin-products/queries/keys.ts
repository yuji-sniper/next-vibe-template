export const adminProductsKey = ["admin-products"] as const

export const adminProductsWithFilterKey = (activeOnly?: boolean) =>
  ["admin-products", { activeOnly }] as const
