import { inArray } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { users } from "../db/schemas"
import type { UserRecord } from "../types"

/**
 * ユーザー情報リポジトリ
 * ユーザーID一覧からメールアドレスを取得
 */
export class UserRepository {
  constructor(private readonly db: MySql2Database) {}

  /**
   * ユーザーID一覧からユーザー情報を取得
   * @param userIds ユーザーIDの配列
   * @returns ユーザー情報の配列
   */
  async findByIds(userIds: string[]): Promise<UserRecord[]> {
    if (userIds.length === 0) {
      return []
    }

    const result = await this.db
      .select({
        id: users.id,
        email: users.email
      })
      .from(users)
      .where(inArray(users.id, userIds))

    return result
  }
}
