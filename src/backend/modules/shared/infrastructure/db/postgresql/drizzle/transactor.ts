import { inject, injectable } from "tsyringe"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { AlsContext } from "../../../node/als/als-context"
import { db } from "./client"

export const PG_DRIZZLE_TRANSACTION_KEY = "PG_DRIZZLE_TRANSACTION_KEY"

@injectable()
export class DbTransactor implements Transactor {
  constructor(
    @inject(AlsContext)
    private readonly alsContext: AlsContext
  ) {}

  async execute<T>(callback: () => Promise<T>): ReturnType<typeof callback> {
    return db.transaction(async (tx) => {
      return await this.alsContext.run(async () => {
        this.alsContext.set(PG_DRIZZLE_TRANSACTION_KEY, tx)
        return await callback()
      })
    })
  }
}
