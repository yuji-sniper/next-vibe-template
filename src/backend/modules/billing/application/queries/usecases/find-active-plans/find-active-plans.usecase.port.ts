export type Plan = {
  product: {
    id: string
    name: string
    description: string | null
    features: string[] | null
    displayOrder: number
  }
  prices: {
    id: string
    stripePriceId: string
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
  }[]
}

export type FindActivePlansUseCaseOutput = {
  plans: Plan[]
}

export interface FindActivePlansUseCasePort {
  handle(): Promise<FindActivePlansUseCaseOutput>
}

export const FindActivePlansUseCasePortToken = Symbol(
  "FindActivePlansUseCasePort"
)
