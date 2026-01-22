interface Ok<T> {
  ok: true
  data: T
}

interface Err {
  ok: false
  error: {
    code: string
    status: number
    message: string
    details?: Record<string, unknown>
  }
}

export type ActionResponse<T> = Ok<T> | Err
