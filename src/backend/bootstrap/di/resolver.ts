import type { InjectionToken } from "tsyringe"
import { getContainer } from "./container"

export const resolveContainer = async <T>(
  token: InjectionToken<T>
): Promise<T> => {
  const container = await getContainer()
  return container.resolve(token)
}
