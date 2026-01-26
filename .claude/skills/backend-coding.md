---
name: backend-coding
trigger: /backend-coding
description: Next.jsプロジェクトのバックエンド実装スキル。クリーンアーキテクチャ + DDD + tsyringe DIパターンに基づく実装。src/backend/modules/配下のドメイン、ユースケース、リポジトリ、ハンドラー、Server Actionの実装時に使用。Drizzle ORM + PostgreSQL + Better-Auth + Zodバリデーションのパターンに従う。
---

# Backend Coding

Next.js 16 + TypeScript のバックエンド実装ガイド（クリーンアーキテクチャ + DDD）。

## ディレクトリ構造

```
src/backend/
├── bootstrap/
│   └── container.ts              # DI コンテナ初期化
└── modules/
    ├── shared/                   # 共有モジュール
    │   ├── di/
    │   │   └── infrastructure.di.ts
    │   ├── application/
    │   │   └── ports/
    │   │       └── db/
    │   │           └── transactor.port.ts
    │   ├── domain/
    │   │   └── value-objects/
    │   │       └── *.vo.ts
    │   ├── infrastructure/
    │   │   ├── db/
    │   │   │   └── postgresql/
    │   │   │       └── drizzle/
    │   │   │           ├── client.ts
    │   │   │           ├── get-db.ts
    │   │   │           ├── transactor.ts
    │   │   │           └── schemas/
    │   │   └── node/
    │   │       └── als/
    │   │           └── als-context.ts
    │   └── presentation/
    │       ├── actions/types/
    │       │   └── action-response.ts
    │       └── handlers/types/
    │           └── result.ts
    │
    └── {module}/                 # ドメインモジュール
        ├── di/
        │   ├── index.ts
        │   ├── application.di.ts
        │   └── infrastructure.di.ts
        ├── application/
        │   ├── queries/
        │   │   ├── ports/
        │   │   │   └── *.port.ts
        │   │   └── usecases/
        │   │       └── {usecase}/
        │   │           ├── *.usecase.ts
        │   │           └── *.usecase.port.ts
        │   └── commands/
        │       └── usecases/
        │           └── {usecase}/
        │               ├── *.usecase.ts
        │               └── *.usecase.port.ts
        ├── domain/
        │   └── {entity}/
        │       ├── {entity}.ts
        │       ├── {entity}.errors.ts
        │       └── {entity}.repository.ts
        ├── infrastructure/
        │   ├── auth/
        │   │   └── better-auth/
        │   │       └── *.adapter.ts
        │   └── repositories/
        │       └── *.drizzle.repository.ts
        └── presentation/
            ├── actions/
            │   └── {action}/
            │       └── {action}.action.ts
            └── handlers/
                └── {handler}/
                    └── {handler}.handler.ts
```

## レイヤー構成

```
Presentation Layer (actions/handlers)
    ↓
Application Layer (usecases/ports)
    ↓
Domain Layer (entities/value-objects/errors)
    ↓
Infrastructure Layer (adapters/repositories)
```

## 実装パターン

### 1. Server Action

```typescript
// modules/{module}/presentation/actions/{action}/{action}.action.ts
"use server"

import { actionHandler } from "../../../handlers/{handler}/{handler}.handler"

export const exampleAction = async () => {
  return actionHandler()
}
```

### 2. Handler

```typescript
// modules/{module}/presentation/handlers/{handler}/{handler}.handler.ts
import { container } from "@/backend/bootstrap/container"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { ExampleUseCase } from "../../application/queries/usecases/example/example.usecase"
import { ExampleError } from "../../domain/example/example.errors"

type ResponseData = {
  example: { id: string; name: string } | undefined
}

export const exampleHandler = async (): Promise<Result<ResponseData>> => {
  const useCase = container.resolve(ExampleUseCase)

  try {
    const result = await useCase.execute()
    return {
      ok: true,
      data: { example: result ? { id: result.id, name: result.name } : undefined }
    }
  } catch (error) {
    if (error instanceof ExampleError) {
      return {
        ok: false,
        error: {
          code: "EXAMPLE_ERROR",
          status: 400,
          message: error.message
        }
      }
    }
    throw error
  }
}
```

### 3. UseCase

```typescript
// modules/{module}/application/queries/usecases/{usecase}/{usecase}.usecase.ts
import { inject, injectable } from "tsyringe"
import type { ExamplePort, EXAMPLE_PORT_TOKEN } from "../ports/example.port"
import type { Example } from "../../../domain/example/example"

@injectable()
export class ExampleUseCase {
  constructor(
    @inject(EXAMPLE_PORT_TOKEN)
    private readonly examplePort: ExamplePort
  ) {}

  async execute(): Promise<Example | undefined> {
    return this.examplePort.getExample()
  }
}
```

### 4. Port（インターフェース）

```typescript
// modules/{module}/application/queries/ports/example.port.ts
import type { Example } from "../../../domain/example/example"

export const EXAMPLE_PORT_TOKEN = Symbol("ExamplePort")

export interface ExamplePort {
  getExample(): Promise<Example | undefined>
}
```

### 5. UseCase Port

```typescript
// modules/{module}/application/queries/usecases/{usecase}/{usecase}.usecase.port.ts
import type { Example } from "../../../../domain/example/example"

export interface ExampleUseCasePort {
  execute(): Promise<Example | undefined>
}
```

### 6. Domain Entity

```typescript
// modules/{module}/domain/{entity}/{entity}.ts
import { Email } from "@/backend/modules/shared/domain/value-objects/email.vo"

type Props = {
  id: string
  name: string
  email: Email
  createdAt: Date
}

export class Example {
  private constructor(private readonly props: Props) {}

  static create(props: Props): Example {
    const now = new Date()
    return new Customer(
      props.id,
      props.name,
      now,
      now
    )
  }

  static reconstruct(props: Props): Example {
    return new Example(props)
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get email(): Email {
    return this.props.email
  }

  get createdAt(): Date {
    return this.props.createdAt
  }
}
```

### 7. Domain Errors

```typescript
// modules/{module}/domain/{entity}/{entity}.errors.ts
export class ExampleNotFoundError extends Error {
  constructor() {
    super("Example not found")
    this.name = "ExampleNotFoundError"
  }
}

export class ExampleCreateFailedError extends Error {
  constructor() {
    super("Failed to create example")
    this.name = "ExampleCreateFailedError"
  }
}
```

### 8. Repository Interface

```typescript
// modules/{module}/domain/{entity}/{entity}.repository.ts
import type { Example } from "./{entity}"

export const EXAMPLE_REPOSITORY_TOKEN = Symbol("ExampleRepository")

export interface ExampleRepository {
  findById(id: string): Promise<Example | undefined>
  save(example: Example): Promise<void>
  delete(id: string): Promise<void>
}
```

### 9. Infrastructure Adapter

```typescript
// modules/{module}/infrastructure/repositories/{entity}.drizzle.repository.ts
import { injectable, inject } from "tsyringe"
import { eq } from "drizzle-orm"
import { GetDb, GET_DB_TOKEN } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/get-db"
import { examples } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/schemas/examples"
import { Email } from "@/backend/modules/shared/domain/value-objects/email.vo"
import { Example } from "../../domain/example/example"
import type { ExampleRepository } from "../../domain/example/example.repository"

@injectable()
export class ExampleDrizzleRepository implements ExampleRepository {
  constructor(
    @inject(GET_DB_TOKEN)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Example | undefined> {
    const db = this.getDb.execute()
    const result = await db
      .select()
      .from(examples)
      .where(eq(examples.id, id))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    const row = result[0]
    return Example.reconstruct({
      id: row.id,
      name: row.name,
      email: Email.create(row.email),
      createdAt: row.createdAt
    })
  }

  async save(example: Example): Promise<void> {
    const db = this.getDb.execute()
    await db.insert(examples).values({
      id: example.id,
      name: example.name,
      email: example.email.value,
      createdAt: example.createdAt
    })
  }

  async delete(id: string): Promise<void> {
    const db = this.getDb.execute()
    await db.delete(examples).where(eq(examples.id, id))
  }
}
```

### 10. Value Object

```typescript
// modules/shared/domain/value-objects/{name}.vo.ts
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    if (!Email.EMAIL_REGEX.test(value)) {
      throw new Error(`Invalid email format: ${value}`)
    }
    return new Email(value)
  }

  get value(): string {
    return this._value
  }

  equals(other: Email): boolean {
    return this._value === other._value
  }
}
```

### 11. DI Registration

```typescript
// modules/{module}/di/application.di.ts
import { container } from "tsyringe"
import { ExampleUseCase } from "../application/queries/usecases/example/example.usecase"

export const initApplicationDependency = () => {
  container.register(ExampleUseCase, { useClass: ExampleUseCase })
}
```

```typescript
// modules/{module}/di/infrastructure.di.ts
import { container } from "tsyringe"
import { EXAMPLE_PORT_TOKEN } from "../application/queries/ports/example.port"
import { EXAMPLE_REPOSITORY_TOKEN } from "../domain/example/example.repository"
import { ExampleDrizzleRepository } from "../infrastructure/repositories/example.drizzle.repository"

export const initInfrastructureDependency = () => {
  container.register(EXAMPLE_PORT_TOKEN, { useClass: ExampleDrizzleRepository })
  container.register(EXAMPLE_REPOSITORY_TOKEN, { useClass: ExampleDrizzleRepository })
}
```

```typescript
// modules/{module}/di/index.ts
import { initApplicationDependency } from "./application.di"
import { initInfrastructureDependency } from "./infrastructure.di"

export const initExampleDependency = () => {
  initInfrastructureDependency()
  initApplicationDependency()
}
```

## Drizzle Schema

```typescript
// modules/shared/infrastructure/db/postgresql/drizzle/schemas/{table}.ts
import { pgTable, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core"

export const examples = pgTable("examples", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  count: integer("count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})

// リレーション例
export const childTable = pgTable("child_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: text("parent_id")
    .notNull()
    .references(() => examples.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow()
})
```

## Result 型

```typescript
// modules/shared/presentation/handlers/types/result.ts
export type Result<T> =
  | { ok: true; data: T }
  | {
      ok: false
      error: {
        code: string
        status: number
        message: string
        details?: Record<string, string[]>
      }
    }
```

## トランザクション

```typescript
// トランザクションを使用する場合
import { inject, injectable } from "tsyringe"
import { DbTransactor, DB_TRANSACTOR_TOKEN } from "@/backend/modules/shared/infrastructure/db/postgresql/drizzle/transactor"

@injectable()
export class TransactionalUseCase {
  constructor(
    @inject(DB_TRANSACTOR_TOKEN)
    private readonly transactor: DbTransactor,
    @inject(EXAMPLE_REPOSITORY_TOKEN)
    private readonly repository: ExampleRepository
  ) {}

  async execute(): Promise<void> {
    await this.transactor.transaction(async () => {
      // トランザクション内の処理
      await this.repository.save(example1)
      await this.repository.save(example2)
    })
  }
}
```

## 新規モジュール作成手順

1. `modules/{module}/` ディレクトリを作成
2. domain/ にエンティティ、エラー、リポジトリインターフェースを定義
3. application/queries/ports/ または application/commands/ports/ にポートを定義
4. application/*/usecases/{usecase}/ にユースケースを実装
5. infrastructure/repositories/ にリポジトリ実装を追加
6. di/ に依存性登録を追加
7. bootstrap/container.ts に init 関数を追加
8. presentation/handlers/ にハンドラーを実装
9. presentation/actions/ に Server Action を実装

## スキーマ追加時

1. `modules/shared/infrastructure/db/postgresql/drizzle/schemas/` にスキーマファイル作成
2. マイグレーション生成: `pnpm drizzle-kit:generate`
3. マイグレーション適用: `pnpm drizzle-kit:migrate`

## 実装完了後の必須ステップ

```bash
pnpm type:check
```

エラーが出た場合は、すべてのエラーを解消するまで修正を続ける。

## チェックリスト

新規実装時の確認事項:

- [ ] Server Action に `"use server"` 指定
- [ ] UseCase に `@injectable()` デコレータ
- [ ] ポートは Symbol トークンで定義
- [ ] Domain Entity は `reconstruct()` で生成
- [ ] Domain Error は `this.name` を設定
- [ ] Repository は GetDb 経由で DB アクセス
- [ ] DI 登録を忘れずに追加
- [ ] Handler で適切なエラーハンドリング
- [ ] Result 型でレスポンスを返却
- [ ] `pnpm type:check` が通ること（必須）
