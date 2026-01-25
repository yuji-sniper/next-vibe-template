import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { AdminRepository } from "@/backend/modules/auth-admin/domain/auth-admin/admin.repository"
import { AuthAdminDeleteFailedError } from "@/backend/modules/auth-admin/domain/auth-admin/auth-admin.errors"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/get-db"
import { admins } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/schemas"

@injectable()
export class AdminDrizzleRepository implements AdminRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async delete(adminId: string): Promise<void> {
    const db = this.getDb.handle()
    const result = await db
      .delete(admins)
      .where(eq(admins.id, adminId))
      .returning({ id: admins.id })

    if (result.length === 0) {
      throw new AuthAdminDeleteFailedError()
    }
  }
}
