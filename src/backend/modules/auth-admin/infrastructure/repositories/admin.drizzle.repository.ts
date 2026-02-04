import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { AdminRepository } from "@/backend/modules/auth-admin/domain/auth-admin/admin.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { admins } from "../db/mysql/drizzle/schemas"

@injectable()
export class AdminDrizzleRepository implements AdminRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async delete(adminId: string): Promise<boolean> {
    const db = this.getDb.handle()
    const [result] = await db.delete(admins).where(eq(admins.id, adminId))

    return result.affectedRows > 0
  }
}
