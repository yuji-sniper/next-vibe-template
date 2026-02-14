import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { UserRepository } from "@/backend/modules/auth/internal/domain/auth-user/user.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { users } from "../schemas"

@injectable()
export class UserMysqlDrizzleRepository implements UserRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async delete(userId: string): Promise<boolean> {
    const db = this.getDb.handle()
    const [result] = await db.delete(users).where(eq(users.id, userId))

    return result.affectedRows > 0
  }
}
