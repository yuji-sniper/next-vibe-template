"use client"

import { useEffect } from "react"

export default function AdminErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>エラーが発生しました。</h2>
      <button type="button" onClick={() => reset()}>
        再読み込み
      </button>
    </div>
  )
}
