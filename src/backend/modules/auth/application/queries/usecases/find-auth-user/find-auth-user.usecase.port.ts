export interface FindAuthUserUseCasePortOutput {
  authUser: {
    id: string
    email: string
    name: string
    image?: string
  }
}

export interface FindAuthUserUseCasePort {
  handle(): Promise<FindAuthUserUseCasePortOutput>
}

export const FindAuthUserUseCasePortToken = Symbol("FindAuthUserUseCasePort")
