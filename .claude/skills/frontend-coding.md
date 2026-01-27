---
name: frontend-coding
description: Next.js App Routerベースのフロントエンド実装スキル。UIコンポーネント、ページ、レイアウト、フォーム、React Queryフック、i18n対応の実装時に使用。backend/配下は除外。Radix UI + Tailwind CSS + TypeScript + next-intl + React Query + Better-Auth のパターンに従う。
---

# Frontend Coding

Next.js 16 + React 19 + TypeScript のフロントエンド実装ガイド。

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── (user)/[locale]/    # ユーザー向けページ
│   │   ├── (authenticated)/ # 認証後ページ
│   │   │   └── {page}/
│   │   │       ├── page.tsx
│   │   │       └── _components/  # ページ固有コンポーネント
│   │   │           ├── container.tsx      # ロジック層
│   │   │           └── presentational.tsx # 表示層
│   │   └── (public)/        # 公開ページ
│   └── (admin)/admin/      # 管理者向けページ
├── components/             # 共通UIコンポーネント
│   ├── ui/                 # Radix UIベース
│   └── layout/             # レイアウトコンポーネント
├── features/               # 機能別フォルダ（複数ページで共有）
│   └── {feature}/
│       ├── types/          # 型定義
│       ├── queries/        # React Query設定
│       ├── hooks/queries/  # カスタムフック
│       └── components/
│           ├── ui/         # プレゼンテーション
│           └── layout/     # レイアウト
├── i18n/                   # 国際化設定
├── lib/                    # ユーティリティ・設定
├── providers/              # Reactプロバイダ
├── messages/               # i18n メッセージ (ja.json, en.json)
├── shared/errors/          # 共通エラー定義
└── hooks/                  # グローバルフック
```

## コンポーネント実装パターン

### UIコンポーネント (components/ui/)

```tsx
"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/shadcn/utils"

const componentVariants = cva("base-styles", {
  variants: {
    variant: {
      default: "...",
      destructive: "..."
    },
    size: {
      default: "h-9 px-4",
      sm: "h-8 px-3",
      lg: "h-10 px-6"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

type Props = React.ComponentProps<"div"> &
  VariantProps<typeof componentVariants>

function Component({ className, variant, size, ...props }: Props) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

### 機能コンポーネント (features/{feature}/components/)

**UI層（プレゼンテーション）:**

```tsx
// features/{feature}/components/ui/FeatureButton/index.tsx
"use client"

import { Button } from "@/components/ui/button"

type Props = {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export const FeatureButton = ({ onClick, disabled, loading }: Props) => {
  return (
    <Button onClick={onClick} disabled={disabled || loading}>
      {loading ? "処理中..." : "実行"}
    </Button>
  )
}
```

**Container層（ロジック）:**

```tsx
// features/{feature}/components/layout/FeatureContainer/index.tsx
"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { getQueryClient } from "@/lib/react-query/query-client"
import { FeatureButton } from "../../ui/FeatureButton"

export const FeatureContainer = () => {
  const t = useTranslations("feature")
  const locale = useLocale()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => { /* API呼び出し */ },
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: ["feature-key"] })
      router.push(`/${locale}/success`)
    }
  })

  return (
    <FeatureButton
      onClick={() => mutation.mutate()}
      loading={mutation.isPending}
    />
  )
}
```

## ページ固有コンポーネント（コンテナ・プレゼンテーショナルパターン）

ページ固有のコンポーネントは `_components` フォルダに配置し、**コンテナ・プレゼンテーショナルパターン**を使用する。

```
app/(user)/[locale]/(authenticated)/settings/
├── page.tsx                    # サーバーコンポーネント
└── _components/
    ├── container.tsx           # ロジック層（状態管理、API呼び出し）
    └── presentational.tsx      # 表示層（UIレンダリング）
```

### コンポーネント配置の使い分け

| 配置場所 | 用途 |
|---------|------|
| `app/.../page/_components/` | ページ固有のコンポーネント |
| `features/{feature}/components/` | 複数ページで共有するコンポーネント |
| `components/ui/` | 汎用UIコンポーネント |

### container.tsx（ロジック層）

```tsx
// app/(user)/[locale]/(authenticated)/settings/_components/container.tsx
"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"
import { getQueryClient } from "@/lib/react-query/query-client"
import { SettingsPresentational } from "./presentational"

export function SettingsContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // API呼び出し
    },
    onSuccess: () => {
      getQueryClient().clear()
      router.push(`/${locale}/sign-in`)
    }
  })

  return (
    <SettingsPresentational
      isDialogOpen={isDialogOpen}
      isDeleting={deleteMutation.isPending}
      onOpenDialog={() => setIsDialogOpen(true)}
      onCloseDialog={() => setIsDialogOpen(false)}
      onDelete={() => deleteMutation.mutate()}
    />
  )
}
```

### presentational.tsx（表示層）

```tsx
// app/(user)/[locale]/(authenticated)/settings/_components/presentational.tsx
"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type SettingsPresentationalProps = {
  isDialogOpen: boolean
  isDeleting: boolean
  onOpenDialog: () => void
  onCloseDialog: () => void
  onDelete: () => void
}

export function SettingsPresentational({
  isDialogOpen,
  isDeleting,
  onOpenDialog,
  onCloseDialog,
  onDelete
}: SettingsPresentationalProps) {
  const t = useTranslations("settings")

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-2xl font-bold">{t("heading")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("deleteAccount.title")}</CardTitle>
          <CardDescription>{t("deleteAccount.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onOpenDialog}>
            {t("deleteAccount.button")}
          </Button>
        </CardContent>
      </Card>
      {/* AlertDialog は省略 */}
    </div>
  )
}
```

### page.tsx からの呼び出し

```tsx
// app/(user)/[locale]/(authenticated)/settings/page.tsx
import { setRequestLocale } from "next-intl/server"
import { SettingsContainer } from "./_components/container"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SettingsContainer />
}
```

## ページ実装パターン

### サーバーコンポーネント（認証なし）

```tsx
// app/(user)/[locale]/(public)/example/page.tsx
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ExamplePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <div>コンテンツ</div>
}
```

### サーバーコンポーネント（認証あり・プリフェッチ）

```tsx
// app/(user)/[locale]/(authenticated)/dashboard/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"
import { featureKey, getFeatureQuery } from "@/features/example/queries/get-feature"
import { DashboardContainer } from "@/features/example/components/layout/DashboardContainer"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("dashboard")
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: featureKey,
    queryFn: getFeatureQuery
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1>{t("title")}</h1>
      <DashboardContainer />
    </HydrationBoundary>
  )
}
```

## React Query パターン

### QueryClient の取得

**重要:** `useQueryClient()` フックの代わりに `getQueryClient()` を使用する。

```tsx
// ❌ Bad: useQueryClient() を使用
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useFeatureMutation = () => {
  const queryClient = useQueryClient()  // 不要なhook呼び出し

  return useMutation({
    mutationFn: featureMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKey })
    }
  })
}

// ✅ Good: getQueryClient() を使用
import { useMutation } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/react-query/query-client"

export const useFeatureMutation = () => {
  return useMutation({
    mutationFn: featureMutation,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: featureKey })
    }
  })
}
```

`getQueryClient()` はブラウザではシングルトンを返すため、Provider経由で取得する `useQueryClient()` と同じインスタンスが得られる。コードがシンプルになり、hook呼び出しを減らせる。

### Query定義

```tsx
// features/{feature}/queries/get-feature.ts
import { getFeatureAction } from "@/backend/features/{feature}/actions/get-feature"
import { ServerError } from "@/utils/error/server-error"

export const featureKey = ["feature"] as const

type Props = {
  orError?: boolean
}

export const getFeatureQuery = async ({ orError = true }: Props = {}) => {
  const res = await getFeatureAction()

  if (!res.ok) {
    if (!orError) {
      return { data: undefined }
    }
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return res.data
}
```

### Query Hook

```tsx
// features/{feature}/hooks/queries/use-get-feature-query.ts
import { useQuery } from "@tanstack/react-query"
import { featureKey, getFeatureQuery } from "../../queries/get-feature"

type Props = {
  orError?: boolean
}

export const useGetFeatureQuery = (props: Props = {}) => {
  return useQuery({
    queryKey: featureKey,
    queryFn: () => getFeatureQuery({ orError: props.orError })
  })
}
```

## i18n 実装

### メッセージ定義

```json
// messages/ja.json
{
  "feature": {
    "title": "機能タイトル",
    "description": "説明文",
    "button": {
      "submit": "送信",
      "cancel": "キャンセル"
    }
  }
}
```

### 使用方法

```tsx
// サーバーコンポーネント
import { getTranslations } from "next-intl/server"
const t = await getTranslations("feature")
t("title") // "機能タイトル"

// クライアントコンポーネント
import { useTranslations, useLocale } from "next-intl"
const t = useTranslations("feature")
const locale = useLocale()
```

## スタイリング規約

### cn() ユーティリティ

```tsx
import { cn } from "@/lib/shadcn/utils"

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)} />
```

### data-slot 属性

テストやセレクタ用にコンポーネントを識別:

```tsx
<div data-slot="feature-card">
  <h2 data-slot="feature-card-title">{title}</h2>
</div>
```

### Tailwind クラス順序

1. レイアウト（flex, grid, block）
2. サイズ（w-, h-, min-, max-）
3. スペーシング（p-, m-, gap-）
4. ボーダー・背景
5. テキスト
6. 状態（hover:, focus:, disabled:）

## エラーハンドリング

### ErrorAlert コンポーネント

```tsx
import { ErrorAlert } from "@/components/ui/error-alert"

{errors.length > 0 && <ErrorAlert messages={errors} />}
```

### ServerError クラス

```tsx
import { ServerError, ValidationServerError } from "@/utils/error/server-error"

// 一般エラー
throw new ServerError("ERROR_CODE", 500, "エラーメッセージ")

// バリデーションエラー
throw new ValidationServerError("VALIDATION_ERROR", 400, "入力エラー", {
  field: ["エラー詳細"]
})
```

## 認証パターン

### 認証クライアント

```tsx
import { authClient } from "@/lib/better-auth/auth-client"

// OAuth サインイン
await authClient.signIn.social({
  provider: "google",
  callbackURL: `/${locale}/home`
})

// サインアウト
await authClient.signOut()
```

### 認証ガード（レイアウト）

```tsx
// app/(user)/[locale]/(authenticated)/layout.tsx
import { redirect } from "next/navigation"
import { getQueryClient } from "@/lib/react-query/query-client"
import { authUserKey, getAuthUserQuery } from "@/features/auth/queries/get-auth-user"

export const dynamic = "force-dynamic"

export default async function AuthenticatedLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const queryClient = getQueryClient()

  const { authUser } = await queryClient.fetchQuery({
    queryKey: authUserKey,
    queryFn: () => getAuthUserQuery({ orError: false })
  })

  if (!authUser) {
    redirect(`/${locale}/sign-in`)
  }

  return <>{children}</>
}
```

## 実装完了後の必須ステップ

**実装が完了したら必ず以下を実行:**

```bash
pnpm type:check
```

エラーが出た場合は、すべてのエラーを解消するまで修正を続ける。型エラーが残った状態で実装完了としない。

## チェックリスト

新規実装時の確認事項:

- [ ] `"use client"` の有無を確認
- [ ] ページ固有コンポーネントは `_components/` に配置（container.tsx + presentational.tsx）
- [ ] 共有コンポーネントは `features/{feature}/components/` に配置
- [ ] 型定義は features/{feature}/types/ に配置
- [ ] i18n 対応（ja.json, en.json に翻訳追加）
- [ ] data-slot 属性でコンポーネント識別
- [ ] cn() でクラス合成
- [ ] エラーハンドリング実装
- [ ] React Query でデータフェッチ（必要時）
- [ ] アクセシビリティ対応（aria-* 属性）
- [ ] `pnpm type:check` が通ること（必須）
