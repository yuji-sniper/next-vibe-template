import { Suspense } from "react"
import { AdminSignInContainer } from "./_components/container"

export default function AdminSignInPage() {
  // TODO: フォールバック用のコンポーネントを追加
  return (
    <Suspense>
      <AdminSignInContainer />
    </Suspense>
  )
}
