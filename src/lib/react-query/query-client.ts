import { QueryClient } from "@tanstack/react-query"

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * 例) staleTime:5分, gcTime:10分の場合
         * 別画面から戻ってくるまでの時間が、
         * - 5分以内（fresh）: キャッシュを描画、マウント時の自動refetchなし
         * - 5〜10分（stale・未GC）: まずキャッシュを描画し、バックグラウンドでrefetch→refetch完了後に描画更新
         * - 10分超（GC済み）: キャッシュなし→Loading→フェッチ完了後に描画
         */
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  // Server: サーバーでは同じQueryClientを使い回すと別ユーザーのデータが混ざる危険性があるので、常に新しいQueryClientを作成する
  if (typeof window === "undefined") {
    return createQueryClient()
  }

  // Browser: ブラウザでは同じQueryClientを使い回すことで、ページ遷移や再レンダー時にキャッシュを保持できる
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient()
  }

  return browserQueryClient
}
