export type ArchiveStripePricePortInput = {
  stripePriceId: string
}

export interface ArchiveStripePricePort {
  handle(input: ArchiveStripePricePortInput): Promise<void>
}

export const ArchiveStripePricePortToken = Symbol("ArchiveStripePricePort")
