import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { env } from "@/env"
import * as schema from "./schemas"

const isRemoteHost =
  env.DATABASE_HOST !== "localhost" && env.DATABASE_HOST !== "127.0.0.1"

const pool = mysql.createPool({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  database:
    process.env.NODE_ENV === "test"
      ? env.DATABASE_NAME_TEST
      : env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD,
  ssl: isRemoteHost
    ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
    : undefined,
  // サーバーレスでは関数インスタンスが大量に起動されるため、各インスタンスが数本ずつ接続を持つとすぐにDB接続上限に達してしまうため、1つの接続のみを保持する
  connectionLimit: 1,
  // リクエスト処理後も接続を1本キープしておくことで、次のリクエストが来たときに再接続する手間を省く
  maxIdle: 1,
  // アイドル中の接続が勝手に切れないよう、定期的に信号を送る
  enableKeepAlive: true
})

export const db = drizzle({ client: pool, schema, mode: "default" })

export type Db = typeof db
