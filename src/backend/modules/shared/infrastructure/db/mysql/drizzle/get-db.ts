import { inject, injectable } from "tsyringe"
import { db } from "@/backend/bootstrap/db/client"
import type {
  DbTransaction,
  GetDbPort
} from "@/backend/modules/shared/application/ports/db/get-db.port"
import { AlsContext } from "../../../node/als/als-context"
import { MYSQL_DRIZZLE_TRANSACTION_KEY } from "./transactor"

@injectable()
export class GetDb implements GetDbPort {
  constructor(
    @inject(AlsContext)
    private readonly alsContext: AlsContext
  ) {}

  handle() {
    const tx = this.alsContext.get<DbTransaction>(MYSQL_DRIZZLE_TRANSACTION_KEY)
    if (tx) {
      return tx
    }

    return db
  }
}
