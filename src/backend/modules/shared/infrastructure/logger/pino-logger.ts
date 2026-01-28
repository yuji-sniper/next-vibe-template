import pino from "pino"
import { inject, injectable } from "tsyringe"
import type { RequestContextPort } from "@/backend/modules/shared/application/ports/context/request-context.port"
import { RequestContextPortToken } from "@/backend/modules/shared/application/ports/context/request-context.port"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"

@injectable()
export class PinoLogger implements LoggerPort {
  private readonly logger: pino.Logger

  constructor(
    @inject(RequestContextPortToken)
    private readonly requestContext: RequestContextPort
  ) {
    this.logger = pino({
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined
    })
  }

  private getBaseContext(): Record<string, unknown> {
    const base: Record<string, unknown> = {}
    const requestId = this.requestContext.getRequestId()
    const userId = this.requestContext.getUserId()

    if (requestId) base.requestId = requestId
    if (userId) base.userId = userId

    return base
  }

  private mergeContext(
    context?: Record<string, unknown>
  ): Record<string, unknown> {
    return { ...this.getBaseContext(), ...context }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(this.mergeContext(context), message)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(this.mergeContext(context), message)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(this.mergeContext(context), message)
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(this.mergeContext(context), message)
  }

  child(bindings: Record<string, unknown>): LoggerPort {
    return new ChildLogger(this, bindings)
  }
}

class ChildLogger implements LoggerPort {
  constructor(
    private readonly parent: PinoLogger,
    private readonly bindings: Record<string, unknown>
  ) {}

  debug(message: string, context?: Record<string, unknown>): void {
    this.parent.debug(message, { ...this.bindings, ...context })
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.parent.info(message, { ...this.bindings, ...context })
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.parent.warn(message, { ...this.bindings, ...context })
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.parent.error(message, { ...this.bindings, ...context })
  }

  child(bindings: Record<string, unknown>): LoggerPort {
    return new ChildLogger(this.parent, { ...this.bindings, ...bindings })
  }
}
