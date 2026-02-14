import type { Metadata } from "next"
import { NotificationDetailContainer } from "./_components/container"

type Props = {
  params: Promise<{ notificationId: string }>
}

export const metadata: Metadata = {
  title: "お知らせ詳細",
  description: "お知らせ詳細ページです。"
}

export default async function NotificationDetailPage({ params }: Props) {
  const { notificationId } = await params

  return <NotificationDetailContainer notificationId={notificationId} />
}
