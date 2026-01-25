export interface DeleteAuthAdminUseCasePort {
  handle(): Promise<void>
}

export const DeleteAuthAdminUseCasePortToken = Symbol(
  "DeleteAuthAdminUseCasePort"
)
