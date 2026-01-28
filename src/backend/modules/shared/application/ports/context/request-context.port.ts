export interface RequestContextPort {
  getRequestId(): string | undefined
  setRequestId(requestId: string): void
  getUserId(): string | undefined
  setUserId(userId: string): void
}

export const RequestContextPortToken = Symbol("RequestContextPort")
