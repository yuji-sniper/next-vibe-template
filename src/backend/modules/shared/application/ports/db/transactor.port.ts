export interface Transactor {
  execute<T>(callback: () => Promise<T>): ReturnType<typeof callback>
}

export const TransactorToken = Symbol("Transactor")
