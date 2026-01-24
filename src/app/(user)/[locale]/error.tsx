"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("errors.general")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>{t("title")}</h2>
      <button type="button" onClick={() => reset()}>
        {t("retry")}
      </button>
    </div>
  )
}
