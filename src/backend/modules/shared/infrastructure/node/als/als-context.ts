import type { AsyncLocalStorage } from "node:async_hooks"

export class AlsContext {
  constructor(private readonly als: AsyncLocalStorage<Map<string, unknown>>) {}

  run<T>(callback: () => Promise<T>): Promise<T> {
    return this.als.run(new Map<string, unknown>(), callback)
  }

  get<T>(key: string): T | undefined {
    return this.als.getStore()?.get(key) as T | undefined
  }

  set<T>(key: string, value: T): void {
    this.als.getStore()?.set(key, value)
  }
}
