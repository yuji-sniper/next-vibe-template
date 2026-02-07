import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import { DB_CONFIG } from "../config"

let pool: mysql.Pool | null = null

/**
 * MySQL接続プールを取得
 * Lambda環境でのコネクション再利用に対応
 */
function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      // Lambda環境向け設定
      connectionLimit: 1,
      maxIdle: 1,
      idleTimeout: 30000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true }
    })
  }
  return pool
}

/**
 * Drizzle ORMインスタンスを取得
 */
export function getDb() {
  return drizzle(getPool())
}

/**
 * コネクションプールを終了
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
