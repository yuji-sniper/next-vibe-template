import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { AuthUserDeleteFailedError } from "@/backend/modules/auth/domain/auth-user/auth-user.errors"
import type { UserRepository } from "@/backend/modules/auth/domain/auth-user/user.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/get-db"
import { users } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/schemas"

@injectable()
export class UserDrizzleRepository implements UserRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async delete(userId: string): Promise<void> {
    const db = this.getDb.handle()
    const result = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    if (result.length === 0) {
      throw new AuthUserDeleteFailedError()
    }
  }
}
