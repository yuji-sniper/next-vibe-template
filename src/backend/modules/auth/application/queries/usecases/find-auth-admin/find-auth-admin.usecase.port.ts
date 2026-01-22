export interface FindAuthAdminUseCasePortOutput {
  authAdmin: {
    id: string
    email: string
    name: string
  }
}

export interface FindAuthAdminUseCasePort {
  handle(): Promise<FindAuthAdminUseCasePortOutput>
}

export const FindAuthAdminUseCasePortToken = Symbol("FindAuthAdminUseCasePort")
