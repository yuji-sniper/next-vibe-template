export type ArchiveProductUseCaseInput = {
  productId: string
}

export interface ArchiveProductUseCasePort {
  handle(input: ArchiveProductUseCaseInput): Promise<void>
}

export const ArchiveProductUseCasePortToken = Symbol(
  "ArchiveProductUseCasePort"
)
