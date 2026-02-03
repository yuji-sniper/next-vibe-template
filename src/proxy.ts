import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import createMiddleware from "next-intl/middleware"

import { env } from "./env"
import { routing } from "./i18n/routing"

/**
 * i18nミドルウェア
 */
const intlMiddleware = createMiddleware(routing)

/**
 * ホストとappディレクトリのパスのマッピング
 */
const hostPathMap: Record<string, string> = {
  [env.NEXT_PUBLIC_HOST]: "/",
  [env.NEXT_PUBLIC_HOST_ADMIN]: "/admin"
}

/**
 * CORSヘッダーを追加
 */
function setCorsHeaders(response: NextResponse, host: string | null) {
  const allowedHosts = Object.keys(hostPathMap)

  if (host && allowedHosts.includes(host)) {
    const origin =
      process.env.NODE_ENV !== "production" ? "*" : `https://${host}`

    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    )
  }

  return response
}

/**
 * サブドメインルーティング用Proxy
 *
 * - admin.example.com/workflows → /admin/workflows にリライト
 * - admin.example.com/api/workflows → /api/admin/workflows にリライト
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const pathname = request.nextUrl.pathname

  // OPTIONSリクエスト（preflight）への対応
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 })
    return setCorsHeaders(response, host)
  }

  // robots.txt, sitemap.xml はi18nルーティングをスキップ
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    const response = NextResponse.next()
    return setCorsHeaders(response, host)
  }

  // ユーザー向けホストの場合、i18nルーティングを適用
  if (host === env.NEXT_PUBLIC_HOST) {
    // APIルートは除外
    if (pathname.startsWith("/api/")) {
      const response = NextResponse.next()
      return setCorsHeaders(response, host)
    }

    // i18nミドルウェアを適用
    const response = intlMiddleware(request)
    return setCorsHeaders(response, host)
  }

  for (const [allowedHost, allowedPath] of Object.entries(hostPathMap)) {
    if (host !== allowedHost) continue

    // 既に /admin または /api/admin パスの場合はスキップ
    if (
      pathname.startsWith(`${allowedPath}/`) ||
      pathname === `${allowedPath}`
    ) {
      const response = NextResponse.next()
      return setCorsHeaders(response, host)
    }

    // /api/* → /api/admin/* にリライト
    if (pathname.startsWith("/api/")) {
      // 既に /api/admin/ の場合はスキップ
      if (pathname.startsWith(`/api${allowedPath}/`)) {
        const response = NextResponse.next()
        return setCorsHeaders(response, host)
      }
      const url = request.nextUrl.clone()
      url.pathname = `/api${allowedPath}${pathname.slice(4)}` // /api を /api/admin に置換
      const response = NextResponse.rewrite(url)
      return setCorsHeaders(response, host)
    }

    // /* → /admin/* にリライト（API以外）
    const url = request.nextUrl.clone()
    url.pathname = `${allowedPath}${pathname}`
    const response = NextResponse.rewrite(url)
    return setCorsHeaders(response, host)
  }

  const response = NextResponse.next()
  return setCorsHeaders(response, host)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}
