export type ArchivePriceUseCaseInput = {
  priceId: string
}

export interface ArchivePriceUseCasePort {
  handle(input: ArchivePriceUseCaseInput): Promise<void>
}

export const ArchivePriceUseCasePortToken = Symbol("ArchivePriceUseCasePort")
