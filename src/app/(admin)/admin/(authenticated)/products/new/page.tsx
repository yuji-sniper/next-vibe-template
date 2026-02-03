import type { Metadata } from "next"
import { ProductCreateContainer } from "./_components/container"

export const metadata: Metadata = {
  title: "商品新規作成",
  description: "商品新規作成ページです。"
}

export default function ProductCreatePage() {
  return <ProductCreateContainer />
}
