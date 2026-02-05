export interface CancelNotificationUseCasePortInput {
  id: string
}

export interface CancelNotificationUseCasePortOutput {
  notification: {
    id: string
    title: string
    status: number
  }
}

export interface CancelNotificationUseCasePort {
  handle(
    input: CancelNotificationUseCasePortInput
  ): Promise<CancelNotificationUseCasePortOutput>
}

export const CancelNotificationUseCasePortToken = Symbol(
  "CancelNotificationUseCasePort"
)
