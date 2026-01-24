"use client"

import { useTranslations } from "next-intl"

export default function NotFoundPage() {
  const t = useTranslations("errors.notFound")

  return <div>{t("message")}</div>
}
