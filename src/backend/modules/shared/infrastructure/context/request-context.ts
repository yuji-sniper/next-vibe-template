import { inject, injectable } from "tsyringe"
import type { RequestContextPort } from "@/backend/modules/shared/application/ports/context/request-context.port"
import { AlsContext } from "@/backend/modules/shared/infrastructure/node/als/als-context"

const REQUEST_ID_KEY = "REQUEST_ID"
const USER_ID_KEY = "USER_ID"

@injectable()
export class RequestContext implements RequestContextPort {
  constructor(
    @inject(AlsContext)
    private readonly alsContext: AlsContext
  ) {}

  getRequestId(): string | undefined {
    return this.alsContext.get<string>(REQUEST_ID_KEY)
  }

  setRequestId(requestId: string): void {
    this.alsContext.set(REQUEST_ID_KEY, requestId)
  }

  getUserId(): string | undefined {
    return this.alsContext.get<string>(USER_ID_KEY)
  }

  setUserId(userId: string): void {
    this.alsContext.set(USER_ID_KEY, userId)
  }
}
