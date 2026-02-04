import { inject, injectable } from "tsyringe"
import { db } from "@/backend/bootstrap/db/client"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { AlsContext } from "../../../node/als/als-context"

export const MYSQL_DRIZZLE_TRANSACTION_KEY = "MYSQL_DRIZZLE_TRANSACTION_KEY"

@injectable()
export class DbTransactor implements Transactor {
  constructor(
    @inject(AlsContext)
    private readonly alsContext: AlsContext
  ) {}

  async execute<T>(callback: () => Promise<T>): ReturnType<typeof callback> {
    return db.transaction(async (tx) => {
      return await this.alsContext.run(async () => {
        this.alsContext.set(MYSQL_DRIZZLE_TRANSACTION_KEY, tx)
        return await callback()
      })
    })
  }
}
