interface Ok<T> {
  ok: true
  data: T
}

interface ValidationErr {
  ok: false
  error: {
    code: string
    status: 422
    message: string
    fieldErrors: Record<string, string>
  }
}

interface OtherErr {
  ok: false
  error: {
    code: string
    status: Exclude<number, 422>
    message: string
    details?: Record<string, unknown>
  }
}

export type Err = ValidationErr | OtherErr

export type Result<T> = Ok<T> | Err
