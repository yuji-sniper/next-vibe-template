import { and, eq, gt, sql } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { z } from "zod"
import { AudienceType, PAGE_SIZE } from "../config"
import { users } from "../db/schemas"
import type { NotificationRecord, UserRecord } from "../types"

/**
 * AudiencePayload のスキーマ定義
 */
const segmentPayloadSchema = z.object({
  /** 対象プラン（例: "pro", "basic"） */
  plan: z.string().optional(),
  /** 作成日の開始（ISO形式） */
  createdAtFrom: z.string().datetime().optional(),
  /** 作成日の終了（ISO形式） */
  createdAtTo: z.string().datetime().optional()
})

const singlePayloadSchema = z.object({
  /** 対象ユーザーID */
  userId: z.string().min(1)
})

type SegmentPayload = z.infer<typeof segmentPayloadSchema>
type SinglePayload = z.infer<typeof singlePayloadSchema>

/**
 * ユーザー抽出サービス
 * audience_type に応じた対象ユーザー抽出を行う
 */
export class UserExtractor {
  constructor(private readonly db: MySql2Database) {}

  /**
   * 対象ユーザーをカーソル方式でページング抽出
   * @param notification 通知情報
   * @param cursor 前回の最後のユーザーID（初回はnull）
   * @returns 抽出したユーザーリスト
   */
  async extractUsers(
    notification: NotificationRecord,
    cursor: string | null
  ): Promise<UserRecord[]> {
    switch (notification.audienceType) {
      case AudienceType.ALL:
        return this.extractAllUsers(cursor)

      case AudienceType.SEGMENT: {
        const segmentResult = segmentPayloadSchema.safeParse(
          notification.audiencePayload
        )
        if (!segmentResult.success) {
          console.error(
            "Invalid segment payload:",
            segmentResult.error.flatten()
          )
          return []
        }
        return this.extractSegmentUsers(segmentResult.data, cursor)
      }

      case AudienceType.SINGLE: {
        const singleResult = singlePayloadSchema.safeParse(
          notification.audiencePayload
        )
        if (!singleResult.success) {
          console.error(
            "Invalid single payload:",
            singleResult.error.flatten()
          )
          return []
        }
        return this.extractSingleUser(singleResult.data)
      }

      default:
        console.warn(
          `Unknown audience type: ${notification.audienceType}, falling back to ALL`
        )
        return this.extractAllUsers(cursor)
    }
  }

  /**
   * 全ユーザーを抽出（AudienceType.ALL）
   */
  private async extractAllUsers(cursor: string | null): Promise<UserRecord[]> {
    const conditions = cursor ? gt(users.id, cursor) : undefined

    const result = await this.db
      .select({
        id: users.id,
        email: users.email
      })
      .from(users)
      .where(conditions)
      .orderBy(users.id)
      .limit(PAGE_SIZE)

    return result
  }

  /**
   * セグメント条件でユーザーを抽出（AudienceType.SEGMENT）
   */
  private async extractSegmentUsers(
    payload: SegmentPayload,
    cursor: string | null
  ): Promise<UserRecord[]> {
    const conditions: ReturnType<typeof gt>[] = []

    // カーソル条件
    if (cursor) {
      conditions.push(gt(users.id, cursor))
    }

    // セグメント条件を追加
    // Note: 現在のusersスキーマにはplanカラムがないため、
    // 将来的な拡張に備えてコメントアウト
    // if (payload.plan) {
    //   conditions.push(eq(users.plan, payload.plan))
    // }

    // 作成日範囲条件
    if (payload.createdAtFrom) {
      conditions.push(
        sql`${users.createdAt} >= ${new Date(payload.createdAtFrom)}`
      )
    }
    if (payload.createdAtTo) {
      conditions.push(
        sql`${users.createdAt} <= ${new Date(payload.createdAtTo)}`
      )
    }

    const result = await this.db
      .select({
        id: users.id,
        email: users.email
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(users.id)
      .limit(PAGE_SIZE)

    return result
  }

  /**
   * 単一ユーザーを抽出（AudienceType.SINGLE）
   */
  private async extractSingleUser(payload: SinglePayload): Promise<UserRecord[]> {
    const result = await this.db
      .select({
        id: users.id,
        email: users.email
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    return result
  }
}
