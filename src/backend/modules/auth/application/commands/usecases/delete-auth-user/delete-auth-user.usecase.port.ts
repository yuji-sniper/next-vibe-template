export interface DeleteAuthUserUseCasePort {
  handle(): Promise<void>
}

export const DeleteAuthUserUseCasePortToken = Symbol(
  "DeleteAuthUserUseCasePort"
)
