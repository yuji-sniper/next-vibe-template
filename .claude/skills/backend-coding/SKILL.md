---
name: backend-coding
trigger: /backend-coding
description: Next.jsプロジェクトのバックエンド実装スキル。クリーンアーキテクチャ + DDD + tsyringe DIパターンに基づく実装。src/backend/modules/配下のドメイン、ユースケース、リポジトリ、ハンドラー、Server Actionの実装時に使用。Drizzle ORM + MySQL + Better-Auth + Zodバリデーションのパターンに従う。
---

# Backend Coding

Next.js 16 + TypeScript のバックエンド実装ガイド（クリーンアーキテクチャ + DDD）。

## ディレクトリ構造

```
src/backend/
├── bootstrap/
│   ├── db/
│   │   └── schemas/
│   │       └── index.ts              # 全モジュールのスキーマを集約
│   └── di/
│       └── container.ts              # DI コンテナ初期化
└── modules/
    ├── shared/                       # 共有モジュール
    │   ├── di/
    │   │   └── infrastructure.di.ts
    │   ├── application/
    │   │   └── ports/
    │   │       ├── context/
    │   │       │   └── request-context.port.ts
    │   │       ├── db/
    │   │       │   └── transactor.port.ts
    │   │       ├── logger/
    │   │       │   └── logger.port.ts        # ロガーポート
    │   │       └── uuid/
    │   │           └── uuid-v7-generator.port.ts
    │   ├── domain/
    │   │   └── value-objects/
    │   │       └── *.vo.ts
    │   ├── infrastructure/
    │   │   ├── db/
    │   │   │   └── mysql/
    │   │   │       └── drizzle/
    │   │   │           ├── client.ts
    │   │   │           ├── get-db.ts
    │   │   │           └── transactor.ts
    │   │   ├── logger/
    │   │   │   └── pino-logger.ts            # Pinoロガー実装
    │   │   ├── node/
    │   │   │   └── als/
    │   │   │       └── als-context.ts
    │   │   └── uuid/
    │   │       └── uuid-v7-generator.ts
    │   └── presentation/
    │       ├── actions/types/
    │       │   └── action-response.ts
    │       ├── handlers/types/
    │       │   └── result.ts
    │       └── middleware/
    │           └── with-request-context.ts   # リクエストコンテキストミドルウェア
    │
    └── {module}/                     # ドメインモジュール
        ├── internal/                 # モジュール内部実装
        │   ├── di/
        │   │   ├── index.ts
        │   │   ├── application.di.ts
        │   │   ├── infrastructure.di.ts
        │   │   └── presentation.di.ts
        │   ├── application/
        │   │   ├── ports/
        │   │   │   └── *.port.ts           # 内部ポート（認証・外部サービス連携など全て）
        │   │   ├── queries/
        │   │   │   └── usecases/
        │   │   │       └── {usecase}/
        │   │   │           ├── {usecase}.usecase.ts
        │   │   │           └── {usecase}.query-service.port.ts  # クエリサービスポート（必要な場合）
        │   │   └── commands/
        │   │       └── usecases/
        │   │           └── {usecase}/
        │   │               └── {usecase}.usecase.ts
        │   ├── domain/
        │   │   └── {entity}/
        │   │       ├── {entity}.ts
        │   │       └── {entity}.repository.ts
        │   ├── infrastructure/
        │   │   ├── db/
        │   │   │   └── mysql/
        │   │   │       └── drizzle/
        │   │   │           ├── schemas/
        │   │   │           │   ├── index.ts
        │   │   │           │   └── {table}.ts
        │   │   │           ├── repositories/
        │   │   │           │   └── {entity}.mysql-drizzle.repository.ts
        │   │   │           └── query-services/
        │   │   │               └── {query}.mysql-drizzle.query-service.ts  # クエリサービス実装（必要な場合）
        │   │   ├── modules/
        │   │   │   └── {other-module}/
        │   │   │       └── *.adapter.ts    # モジュール間アダプター
        │   │   └── {external-service}/
        │   │       └── *.adapter.ts        # 外部サービスアダプター
        │   └── presentation/
        │       ├── actions/
        │       │   └── {action}/
        │       │       └── {action}.action.ts
        │       └── handlers/
        │           └── {handler}/
        │               └── {handler}.handler.ts
        │
        └── public/                   # モジュール外部公開
            ├── errors/
            │   └── {entity}.errors.ts      # ドメインエラー
            └── ports/
                └── {usecase}.usecase.port.ts  # ユースケースポート
```

## internal/ と public/ の分離

### internal/（モジュール内部）
- **di/** - 依存性注入の設定
- **application/** - ユースケース実装、内部ポート（認証・外部サービス連携など全て `ports/` に配置）
- **domain/** - エンティティ、リポジトリインターフェース
- **infrastructure/** - DB schemas、リポジトリ実装、アダプター
- **presentation/** - actions、handlers

### public/（外部公開）
- **errors/** - ドメインエラークラス（他モジュールやPresentation層から参照される）
- **ports/** - ユースケースポート（Input/Output/Interface/Token）

**重要:** エラーとユースケースポートは `public/` に配置し、他モジュールから参照可能にする。

## レイヤー構成

```
Presentation Layer (actions/handlers)
    ↓
Application Layer (usecases/ports)
    ↓
Domain Layer (entities/value-objects)
    ↓
Infrastructure Layer (adapters/repositories)
```

## 実装パターン

### 1. Server Action

**Action は「薄いラッパー」として機能し、`withRequestContext` でラップして Handler を呼び出す。バリデーションは Handler で行う。**

```typescript
// modules/{module}/internal/presentation/actions/{action}/{action}.action.ts
"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  ExampleHandler,
  ExampleHandlerInput
} from "@/backend/modules/{module}/internal/presentation/handlers/example/example.handler"
import { ExampleHandlerToken } from "@/backend/modules/{module}/internal/presentation/handlers/example/example.handler"

// Handler の入力型を再利用
export type ExampleActionRequest = ExampleHandlerInput

export type ExampleActionResponse = ActionResponse<{
  example: { id: string; name: string }
}>

// Action は withRequestContext でラップして Handler を呼び出す
export const exampleAction = async (
  request: ExampleActionRequest
): Promise<ExampleActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<ExampleHandler>(ExampleHandlerToken)
    return handler.handle(request)
  })
}
```

### 2. Handler

**Handler はクラスベースで実装し、LoggerPort を DI 注入する。Zod でバリデーションを行い、UseCase を呼び出し、エラーを Result 型に変換してログ出力する。**

```typescript
// modules/{module}/internal/presentation/handlers/{handler}/{handler}.handler.ts
import { inject, injectable } from "tsyringe"
import { z } from "zod"
import type { ExampleUseCasePort } from "@/backend/modules/{module}/public/ports/example.usecase.port"
import { ExampleUseCasePortToken } from "@/backend/modules/{module}/public/ports/example.usecase.port"
import { ExampleNotFoundError } from "@/backend/modules/{module}/public/errors/example.errors"
import type { LoggerPort } from "@/backend/modules/shared/application/ports/logger/logger.port"
import { LoggerPortToken } from "@/backend/modules/shared/application/ports/logger/logger.port"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { EXAMPLE_ERROR_CODES } from "@/shared/errors/example.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

// Zod スキーマ定義（Handler 内で定義）
const exampleSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email().optional()
})

// z.input でスキーマの入力型を取得（Action から参照可能にするため export）
export type ExampleHandlerInput = z.input<typeof exampleSchema>

export type ExampleHandlerResult = Result<{
  example: { id: string; name: string }
}>

// Handler の Token と Interface を定義（DI 登録用）
export const ExampleHandlerToken = Symbol("ExampleHandler")

export interface ExampleHandler {
  handle(input: ExampleHandlerInput): Promise<ExampleHandlerResult>
}

@injectable()
export class ExampleHandlerImpl implements ExampleHandler {
  constructor(
    @inject(LoggerPortToken)
    private readonly logger: LoggerPort,
    @inject(ExampleUseCasePortToken)
    private readonly exampleUseCase: ExampleUseCasePort
  ) {}

  async handle(input: ExampleHandlerInput): Promise<ExampleHandlerResult> {
    // 1. バリデーション
    const parsed = exampleSchema.safeParse(input)

    if (!parsed.success) {
      return {
        ok: false,
        error: {
          code: COMMON_ERROR_CODES.VALIDATION_ERROR,
          status: 422,
          message: "Validation failed",
          fieldErrors: formatZodErrors(parsed.error)  // { "path.to.field": "error message" }
        }
      }
    }

    try {
      // 2. UseCase 実行
      const output = await this.exampleUseCase.handle({
        name: parsed.data.name,
        email: parsed.data.email
      })
      return {
        ok: true,
        data: { example: output.example }
      }
    } catch (e: unknown) {
      // 3. Domain Error を Result 型に変換
      if (e instanceof ExampleNotFoundError) {
        return {
          ok: false,
          error: {
            code: EXAMPLE_ERROR_CODES.NOT_FOUND,
            status: 404,
            message: "Example not found"
          }
        }
      }

      // 4. 予期しないエラーはログ出力してモジュール固有のエラーコードで返す
      this.logger.error("Failed to handle example", {
        name: parsed.data.name,
        error: e instanceof Error ? e.message : String(e)
      })

      return {
        ok: false,
        error: {
          code: EXAMPLE_ERROR_CODES.CREATE_FAILED,
          status: 500,
          message: "Failed to create example"
        }
      }
    }
  }
}
```

### 3. UseCase Port（public/ports/）

**重要: UseCase Port は `public/ports/` に配置し、外部から参照可能にする。**
**UseCase の Output はドメイン型（Entity クラス）を直接返さず、DTO形式（プリミティブ型）で返す。**

```typescript
// modules/{module}/public/ports/{usecase}.usecase.port.ts

export interface CreateExampleUseCasePortInput {
  name: string
  email: string
}

// ✅ 正しい: DTO形式（プリミティブ型）で定義
export interface CreateExampleUseCasePortOutput {
  example: {
    id: string
    name: string
    status: string
    createdAt: Date
    updatedAt: Date
  }
}

// ❌ 間違い: ドメイン型を直接返す
// export interface CreateExampleUseCasePortOutput {
//   example: Example  // Domain Entity を直接返さない
// }

export interface CreateExampleUseCasePort {
  handle(
    input: CreateExampleUseCasePortInput
  ): Promise<CreateExampleUseCasePortOutput>
}

export const CreateExampleUseCasePortToken = Symbol("CreateExampleUseCasePort")
```

### 4. Port（外部サービス連携用・internal/application/ports/）

```typescript
// modules/{module}/internal/application/ports/create-example.port.ts

export interface CreateExamplePortInput {
  name: string
  email: string
}

export interface CreateExamplePortOutput {
  externalId: string
  createdAt: Date
}

export interface CreateExamplePort {
  handle(input: CreateExamplePortInput): Promise<CreateExamplePortOutput>
}

export const CreateExamplePortToken = Symbol("CreateExamplePort")
```

### 5. UseCase 実装（internal/application/）

```typescript
// modules/{module}/internal/application/commands/usecases/{usecase}/{usecase}.usecase.ts
import { inject, injectable } from "tsyringe"
import type { ExampleRepository } from "@/backend/modules/{module}/internal/domain/example/example.repository"
import { ExampleRepositoryToken } from "@/backend/modules/{module}/internal/domain/example/example.repository"
import type { CreateExamplePort } from "@/backend/modules/{module}/internal/application/ports/create-example.port"
import { CreateExamplePortToken } from "@/backend/modules/{module}/internal/application/ports/create-example.port"
import type { GetCurrentUserPort } from "@/backend/modules/{module}/internal/application/ports/get-current-user.port"
import { GetCurrentUserPortToken } from "@/backend/modules/{module}/internal/application/ports/get-current-user.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { Example } from "@/backend/modules/{module}/internal/domain/example/example"
import { ExampleNotFoundError } from "@/backend/modules/{module}/public/errors/example.errors"
import type {
  CreateExampleUseCasePort,
  CreateExampleUseCasePortInput,
  CreateExampleUseCasePortOutput
} from "@/backend/modules/{module}/public/ports/create-example.usecase.port"

@injectable()
export class CreateExampleUseCase implements CreateExampleUseCasePort {
  constructor(
    @inject(GetCurrentUserPortToken)
    private readonly getCurrentUser: GetCurrentUserPort,
    @inject(ExampleRepositoryToken)
    private readonly exampleRepository: ExampleRepository,
    @inject(CreateExamplePortToken)
    private readonly createExample: CreateExamplePort,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(
    input: CreateExampleUseCasePortInput
  ): Promise<CreateExampleUseCasePortOutput> {
    // 1. 認証ユーザー取得
    const { userId } = await this.getCurrentUser.handle()

    // 2. 外部サービス連携
    const result = await this.createExample.handle({
      name: input.name,
      email: input.email
    })

    // 3. Domain Entity 作成
    const example = Example.create({
      id: this.uuidV7Generator.generate(),
      userId,
      externalId: result.externalId,
      name: input.name
    })

    // 4. Repository で永続化
    await this.exampleRepository.save(example)

    // 5. DTO形式で返す（Domain Entity を直接返さない）
    return {
      example: {
        id: example.id,
        name: example.name,
        status: example.status,
        createdAt: example.createdAt,
        updatedAt: example.updatedAt
      }
    }
  }
}
```

### 6. Domain Entity（internal/domain/）

```typescript
// modules/{module}/internal/domain/{entity}/{entity}.ts

// 状態定数（型安全な列挙型）
export const EXAMPLE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending"
} as const

export type ExampleStatus = (typeof EXAMPLE_STATUS)[keyof typeof EXAMPLE_STATUS]

export class Example {
  private constructor(
    public readonly id: string,           // 不変
    public readonly userId: string,        // 不変
    public readonly externalId: string,    // 不変
    public name: string,                   // 変更可能
    public status: ExampleStatus,          // 変更可能
    public readonly createdAt: Date,       // 不変
    public updatedAt: Date                 // 変更可能
  ) {}

  // 新規作成（デフォルト値を適用）
  static create(params: {
    id: string
    userId: string
    externalId: string
    name: string
    status?: ExampleStatus
  }): Example {
    const now = new Date()
    return new Example(
      params.id,
      params.userId,
      params.externalId,
      params.name,
      params.status ?? EXAMPLE_STATUS.ACTIVE,
      now,
      now
    )
  }

  // DB再構成（すべてのパラメータ必須）
  static reconstruct(params: {
    id: string
    userId: string
    externalId: string
    name: string
    status: ExampleStatus
    createdAt: Date
    updatedAt: Date
  }): Example {
    return new Example(
      params.id,
      params.userId,
      params.externalId,
      params.name,
      params.status,
      params.createdAt,
      params.updatedAt
    )
  }

  // ビジネスロジック（状態変更メソッド）
  updateName(name: string): void {
    this.name = name
    this.updatedAt = new Date()
  }

  updateStatus(status: ExampleStatus): void {
    this.status = status
    this.updatedAt = new Date()
  }

  activate(): void {
    this.status = EXAMPLE_STATUS.ACTIVE
    this.updatedAt = new Date()
  }

  deactivate(): void {
    this.status = EXAMPLE_STATUS.INACTIVE
    this.updatedAt = new Date()
  }
}
```

### 7. Domain Errors（public/errors/）

**重要: エラーは `public/errors/` に配置し、他モジュールやPresentation層から参照可能にする。**

```typescript
// modules/{module}/public/errors/{entity}.errors.ts

export class ExampleNotFoundError extends Error {
  constructor() {
    super("Example not found")
    this.name = "ExampleNotFoundError"
  }
}

export class ExampleAlreadyExistsError extends Error {
  constructor() {
    super("Example already exists")
    this.name = "ExampleAlreadyExistsError"
  }
}

export class ExampleCreateFailedError extends Error {
  constructor() {
    super("Failed to create example")
    this.name = "ExampleCreateFailedError"
  }
}

export class ExampleUpdateFailedError extends Error {
  constructor() {
    super("Failed to update example")
    this.name = "ExampleUpdateFailedError"
  }
}
```

### 8. Repository Interface（internal/domain/）

```typescript
// modules/{module}/internal/domain/{entity}/{entity}.repository.ts
import type { Example } from "./example"

export const ExampleRepositoryToken = Symbol("ExampleRepository")

export interface ExampleRepository {
  findById(id: string): Promise<Example | null>
  findByUserId(userId: string): Promise<Example | null>
  findByExternalId(externalId: string): Promise<Example | null>
  save(example: Example): Promise<void>
  delete(id: string): Promise<void>
}
```

### 9. Drizzle Repository 実装（internal/infrastructure/db/mysql/drizzle/repositories/）

```typescript
// modules/{module}/internal/infrastructure/db/mysql/drizzle/repositories/{entity}.mysql-drizzle.repository.ts
import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import { Example } from "@/backend/modules/{module}/internal/domain/example/example"
import type { ExampleRepository } from "@/backend/modules/{module}/internal/domain/example/example.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { examples } from "@/backend/modules/{module}/internal/infrastructure/db/mysql/drizzle/schemas"

@injectable()
export class ExampleMysqlDrizzleRepository implements ExampleRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Example | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(examples)
      .where(eq(examples.id, id))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return Example.reconstruct(result[0])
  }

  async findByUserId(userId: string): Promise<Example | null> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(examples)
      .where(eq(examples.userId, userId))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return Example.reconstruct(result[0])
  }

  async save(example: Example): Promise<void> {
    const db = this.getDb.handle()
    await db
      .insert(examples)
      .values({
        id: example.id,
        userId: example.userId,
        externalId: example.externalId,
        name: example.name,
        status: example.status,
        createdAt: example.createdAt,
        updatedAt: example.updatedAt
      })
      .onDuplicateKeyUpdate({
        set: {
          name: example.name,
          status: example.status,
          updatedAt: example.updatedAt
        }
      })
  }

  async delete(id: string): Promise<void> {
    const db = this.getDb.handle()
    await db.delete(examples).where(eq(examples.id, id))
  }
}
```

### 10. Infrastructure Adapter（外部サービス）

```typescript
// modules/{module}/internal/infrastructure/{service}/{action}.{service}.adapter.ts
import { injectable } from "tsyringe"
import { ExampleCreateFailedError } from "@/backend/modules/{module}/public/errors/example.errors"
import type {
  CreateExamplePort,
  CreateExamplePortInput,
  CreateExamplePortOutput
} from "@/backend/modules/{module}/internal/application/ports/create-example.port"
import { externalClient } from "@/backend/modules/{module}/internal/infrastructure/{service}/external-client"

@injectable()
export class CreateExampleExternalAdapter implements CreateExamplePort {
  async handle(input: CreateExamplePortInput): Promise<CreateExamplePortOutput> {
    try {
      const result = await externalClient.create({
        name: input.name,
        email: input.email
      })

      return {
        externalId: result.id,
        createdAt: new Date(result.created_at)
      }
    } catch (error) {
      if (error instanceof ExampleCreateFailedError) {
        throw error
      }
      throw new ExampleCreateFailedError()
    }
  }
}
```

### 11. モジュール間 Adapter

```typescript
// modules/{module}/internal/infrastructure/modules/{other-module}/{action}.{other-module}.adapter.ts
import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/public/ports/get-auth-user.usecase.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/public/ports/get-auth-user.usecase.port"
import type {
  GetCurrentUserPort,
  GetCurrentUserPortOutput
} from "@/backend/modules/{module}/internal/application/ports/get-current-user.port"

@injectable()
export class GetCurrentUserAuthModuleAdapter implements GetCurrentUserPort {
  constructor(
    @inject(GetAuthUserPortToken)
    private readonly getAuthUser: GetAuthUserPort
  ) {}

  async handle(): Promise<GetCurrentUserPortOutput> {
    const { authUser } = await this.getAuthUser.handle()

    return {
      userId: authUser.id,
      email: authUser.email.value
    }
  }
}
```

### 12. Value Object

```typescript
// modules/shared/domain/value-objects/{name}.vo.ts

export class Email {
  private static readonly regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(public readonly value: string) {
    if (!Email.regex.test(value)) {
      throw new Error("Invalid email")
    }
  }
}
```

### 13. DI Registration

```typescript
// modules/{module}/internal/di/infrastructure.di.ts
import type { DependencyContainer } from "tsyringe"
import { ExampleRepositoryToken } from "@/backend/modules/{module}/internal/domain/example/example.repository"
import { ExampleMysqlDrizzleRepository } from "@/backend/modules/{module}/internal/infrastructure/db/mysql/drizzle/repositories/example.mysql-drizzle.repository"
import { CreateExamplePortToken } from "@/backend/modules/{module}/internal/application/ports/create-example.port"
import { CreateExampleExternalAdapter } from "@/backend/modules/{module}/internal/infrastructure/{service}/create-example.{service}.adapter"
import { GetCurrentUserPortToken } from "@/backend/modules/{module}/internal/application/ports/get-current-user.port"
import { GetCurrentUserAuthModuleAdapter } from "@/backend/modules/{module}/internal/infrastructure/modules/auth/get-current-user.auth-module.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  // Repositories
  container.registerSingleton(ExampleRepositoryToken, ExampleMysqlDrizzleRepository)

  // External Module Adapters
  container.registerSingleton(
    GetCurrentUserPortToken,
    GetCurrentUserAuthModuleAdapter
  )

  // External Service Adapters
  container.registerSingleton(
    CreateExamplePortToken,
    CreateExampleExternalAdapter
  )
}
```

```typescript
// modules/{module}/internal/di/application.di.ts
import type { DependencyContainer } from "tsyringe"
import { CreateExampleUseCasePortToken } from "@/backend/modules/{module}/public/ports/create-example.usecase.port"
import { CreateExampleUseCase } from "@/backend/modules/{module}/internal/application/commands/usecases/create-example/create-example.usecase"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    CreateExampleUseCasePortToken,
    CreateExampleUseCase
  )
}
```

```typescript
// modules/{module}/internal/di/presentation.di.ts
import type { DependencyContainer } from "tsyringe"
import {
  ExampleHandlerImpl,
  ExampleHandlerToken
} from "@/backend/modules/{module}/internal/presentation/handlers/example/example.handler"

export const initPresentationDependency = (container: DependencyContainer) => {
  container.registerSingleton(ExampleHandlerToken, ExampleHandlerImpl)
}
```

```typescript
// modules/{module}/internal/di/index.ts
import type { DependencyContainer } from "tsyringe"
import { initApplicationDependency } from "./application.di"
import { initInfrastructureDependency } from "./infrastructure.di"
import { initPresentationDependency } from "./presentation.di"

export const initExampleDependency = (container: DependencyContainer) => {
  // infrastructure
  initInfrastructureDependency(container)
  // application
  initApplicationDependency(container)
  // presentation
  initPresentationDependency(container)
}
```

## Drizzle Schema

**注意:** タイムスタンプ型は `timestamp` または `datetime` を使用する（既存モジュールに合わせる）。デフォルト値は `.default(sql\`CURRENT_TIMESTAMP(3)\`)` を使用する（`.defaultNow()` は使わない）。

```typescript
// modules/{module}/internal/infrastructure/db/mysql/drizzle/schemas/{table}.ts
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  foreignKey,
  index,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { users } from "@/backend/modules/auth/internal/infrastructure/db/mysql/drizzle/schemas"

// 外部キー制約名の定数化（外部キーがある場合）
export const EXAMPLES_CONSTRAINTS = {
  USER_ID_FOREIGN_KEY: "examples_user_id_users_id_fk"
} as const

export const examples = mysqlTable(
  "examples",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    externalId: text("external_id").notNull().unique(),
    name: text("name").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .$onUpdate(() => new Date())
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: EXAMPLES_CONSTRAINTS.USER_ID_FOREIGN_KEY
    }).onDelete("cascade"),
    index("idx_examples_user_id").on(table.userId),
    index("idx_examples_external_id").on(table.externalId)
  ]
)

export const examplesRelations = relations(examples, ({ one }) => ({
  user: one(users, {
    fields: [examples.userId],
    references: [users.id]
  })
}))
```

```typescript
// modules/{module}/internal/infrastructure/db/mysql/drizzle/schemas/index.ts
export * from "./examples"
```

## Result 型

```typescript
// modules/shared/presentation/handlers/types/result.ts
interface Ok<T> {
  ok: true
  data: T
}

interface ValidationErr {
  ok: false
  error: {
    code: string
    status: 422
    message: string
    fieldErrors: Record<string, string>
  }
}

interface OtherErr {
  ok: false
  error: {
    code: string
    status: Exclude<number, 422>
    message: string
    details?: Record<string, unknown>
  }
}

export type Err = ValidationErr | OtherErr

export type Result<T> = Ok<T> | Err
```

## ActionResponse 型

```typescript
// modules/shared/presentation/actions/types/action-response.ts
export type ActionResponse<T> =
  | { ok: true; data: T }
  | {
      ok: false
      error: {
        code: string
        status: number
        message: string
        details?: Record<string, unknown>
      }
    }
```

## トランザクション

```typescript
// トランザクションを使用する UseCase
import { inject, injectable } from "tsyringe"
import type { Transactor } from "@/backend/modules/shared/application/ports/db/transactor.port"
import { TransactorToken } from "@/backend/modules/shared/application/ports/db/transactor.port"
import type { ExampleRepository } from "@/backend/modules/{module}/internal/domain/example/example.repository"
import { ExampleRepositoryToken } from "@/backend/modules/{module}/internal/domain/example/example.repository"

@injectable()
export class TransactionalUseCase {
  constructor(
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(ExampleRepositoryToken)
    private readonly exampleRepository: ExampleRepository
  ) {}

  async handle(): Promise<void> {
    // トランザクション外の処理（外部API呼び出しなど）
    const externalResult = await this.callExternalApi()

    // トランザクション内の処理（DB操作）
    await this.transactor.execute(async () => {
      await this.exampleRepository.save(example1)
      await this.exampleRepository.save(example2)
      // Repository は ALS から自動的にトランザクションを取得
    })
  }
}
```

## Webhook 処理パターン

```typescript
// Webhook UseCase のパターン
@injectable()
export class ProcessWebhookUseCase {
  constructor(
    @inject(TransactorToken)
    private readonly transactor: Transactor,
    @inject(WebhookEventRepositoryToken)
    private readonly webhookEventRepository: WebhookEventRepository,
    @inject(ProcessWebhookPortToken)
    private readonly processWebhook: ProcessWebhookPort,
    @inject(UuidV7GeneratorPortToken)
    private readonly uuidV7Generator: UuidV7GeneratorPort
  ) {}

  async handle(input: { payload: string; signature: string }): Promise<void> {
    // 1. 署名検証 & イベントパース（トランザクション外）
    const { event } = await this.processWebhook.handle({
      payload: input.payload,
      signature: input.signature
    })

    // 2. DB操作はトランザクション内で実行
    await this.transactor.execute(async () => {
      await this.processEvent(event)
    })
  }

  private async processEvent(event: WebhookEvent): Promise<void> {
    // 重複チェック
    const existingEvent = await this.webhookEventRepository.findByExternalEventId(
      event.id
    )
    if (existingEvent?.processed) {
      throw new WebhookEventAlreadyProcessedError()
    }

    // イベント記録
    const webhookEvent = WebhookEvent.create({
      id: existingEvent?.id ?? this.uuidV7Generator.generate(),
      externalEventId: event.id,
      eventType: event.type
    })
    if (!existingEvent) {
      await this.webhookEventRepository.save(webhookEvent)
    }

    // イベント種別による分岐
    try {
      switch (event.type) {
        case "example.created":
          await this.handleExampleCreated(event)
          break
        case "example.updated":
          await this.handleExampleUpdated(event)
          break
        default:
          break
      }

      // 処理済みフラグ更新
      webhookEvent.markAsProcessed()
      await this.webhookEventRepository.save(webhookEvent)
    } catch {
      throw new WebhookProcessingFailedError()
    }
  }
}
```

## ロギング

Handler でエラーをログ出力する際は、`LoggerPort` を DI 注入して使用する。

```typescript
// modules/shared/application/ports/logger/logger.port.ts
export interface LoggerPort {
  debug(message: string, context?: Record<string, unknown>): void
  info(message: string, context?: Record<string, unknown>): void
  warn(message: string, context?: Record<string, unknown>): void
  error(message: string, context?: Record<string, unknown>): void
  child(bindings: Record<string, unknown>): LoggerPort
}

export const LoggerPortToken = Symbol("LoggerPort")
```

### ログ出力のベストプラクティス

```typescript
// ✅ 正しい: エラー内容とコンテキストを含める
this.logger.error("Failed to create product", {
  name: input.name,
  error: e instanceof Error ? e.message : String(e)
})

// ❌ 間違い: コンテキストなしでログ出力
this.logger.error("Failed to create product")
```

### リクエストコンテキスト

`withRequestContext` を使用すると、ログに `requestId` と `userId` が自動的に付与される。

```typescript
// modules/shared/presentation/middleware/with-request-context.ts
export const withRequestContext = async <T>(
  callback: () => Promise<T>
): Promise<T> => {
  const alsContext = await resolveContainer<AlsContext>(AlsContext)
  const uuidGenerator = await resolveContainer<UuidV7GeneratorPort>(
    UuidV7GeneratorPortToken
  )

  return alsContext.run(async () => {
    const requestContext = await resolveContainer<RequestContextPort>(
      RequestContextPortToken
    )
    requestContext.setRequestId(uuidGenerator.generate())
    return callback()
  })
}
```

## Better-Auth 統合

```typescript
// modules/auth/internal/infrastructure/auth/better-auth/auth.ts
import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { oneTap } from "better-auth/plugins"
import { db } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/client"
import { env } from "@/env"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql"
  }),
  baseURL: env.NEXT_PUBLIC_ORIGIN,
  socialProviders: {
    google: {
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [oneTap()],
  user: {
    modelName: "users",
    additionalFields: {
      storageKey: { type: "string" },
      tokenBalance: { type: "number", default: 0 }
    }
  },
  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
  verification: { modelName: "verifications" }
})
```

```typescript
// Better-Auth Adapter
import { headers } from "next/headers"
import { AuthUserUnauthorizedError } from "@/backend/modules/auth/public/errors/auth-user.errors"
import type {
  GetAuthUserPort,
  GetAuthUserPortOutput
} from "@/backend/modules/auth/public/ports/get-auth-user.usecase.port"
import { AuthUser } from "@/backend/modules/auth/internal/domain/auth-user/auth-user"
import { auth } from "./auth"

export class GetAuthUserBetterAuthAdapter implements GetAuthUserPort {
  async handle(): Promise<GetAuthUserPortOutput> {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      throw new AuthUserUnauthorizedError()
    }

    return {
      authUser: AuthUser.reconstruct({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image ?? undefined
      })
    }
  }
}
```

## UUID v7 生成

```typescript
// modules/shared/infrastructure/uuid/uuid-v7-generator.ts
import { injectable } from "tsyringe"
import { v7 } from "uuid"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"

@injectable()
export class UuidV7Generator implements UuidV7GeneratorPort {
  generate(): string {
    return v7()
  }
}
```

## 新規モジュール作成手順

1. `modules/{module}/internal/` と `modules/{module}/public/` ディレクトリを作成
2. `public/errors/` にドメインエラーを定義
3. `internal/domain/` にエンティティ、リポジトリインターフェースを定義
4. `internal/application/ports/` に内部ポートを定義（認証・外部サービス連携など全て）
5. `public/ports/` にユースケースポートを定義（外部公開用）
6. `internal/application/*/usecases/{usecase}/` にユースケースを実装
7. `internal/infrastructure/db/mysql/drizzle/repositories/` にリポジトリ実装を追加
8. `internal/infrastructure/modules/` にモジュール間アダプターを追加
9. `internal/infrastructure/{service}/` に外部サービスアダプターを追加
10. `internal/di/` に依存性登録を追加
11. `bootstrap/di/container.ts` に init 関数を追加
12. `internal/presentation/handlers/` にハンドラーを実装
13. `internal/presentation/actions/` に Server Action を実装

## スキーマ追加時

1. `modules/{module}/internal/infrastructure/db/mysql/drizzle/schemas/` にスキーマファイル作成
2. `schemas/index.ts` にエクスポートを追加
3. `bootstrap/db/schemas/index.ts` にモジュールのスキーマをエクスポート追加
4. **マイグレーションは実行しない**（ユーザーが手動で実行する）
5. 実装完了時に以下のコマンドを出力する:

```bash
# マイグレーション生成・適用コマンド
pnpm drizzle:gen --name {わかりやすいファイル名}
pnpm drizzle:migrate
```

**注意:** `{わかりやすいファイル名}` は実装内容に応じた名前に置き換える（例: `add-notifications-table`, `add-user-preferences`）

## 実装完了後の必須ステップ

```bash
pnpm type:check
```

エラーが出た場合は、すべてのエラーを解消するまで修正を続ける。

## importパスのルール

- **エイリアスパス（`@/backend/...`）を使用する**
- 相対パス（`../../`）は使用しない
- これによりファイル移動時のリファクタリングが容易になる

```typescript
// ✅ 正しい
import { Product } from "@/backend/modules/billing/internal/domain/product/product"
import type { ProductRepository } from "@/backend/modules/billing/internal/domain/product/product.repository"
import { ProductNotFoundError } from "@/backend/modules/billing/public/errors/product.errors"

// ❌ 間違い
import { Product } from "../../domain/product/product"
```

## 不要なマッピングをしない

レイヤー間でデータを受け渡す際、型が構造的に一致している場合は冗長なマッピングを行わず、そのまま渡す。マッピングは型変換やフィールドの取捨選択が必要な場合にのみ行う。

```typescript
// ❌ NG: UseCase の出力型と Handler の返却型が一致しているのに冗長なマッピング
return {
  ok: true,
  data: {
    id: output.id,
    name: output.name,
    status: output.status,
    // ... 全フィールドを手動でコピー
  }
}

// ✅ OK: 型が一致している場合はそのまま渡す
return {
  ok: true,
  data: output
}
```

**マッピングが必要なケース:**
- Date → string（`toISOString()`）のような型変換がある場合
- Domain Entity → DTO のように一部のフィールドだけを抽出する場合
- フィールド名を変更する場合

## 型アサーション（as）を避ける

型アサーション（`as`）は型安全性を損なうため、可能な限り使用しない。

**例外として許容されるケース:**
- Repository の `Entity.reconstruct()` 呼び出しで、DBから取得した文字列をドメインの列挙型にマッピングする場合

```typescript
// ❌ NG: 型アサーションを使用
const products = res.data.products as Product[]

// ✅ OK: 明示的なマッピングで型変換
const products: Product[] = res.data.products.map((p) => ({
  id: p.id,
  name: p.name,
  // ...
}))

// ✅ OK（例外）: Repository での Entity.reconstruct() 呼び出し時のドメイン型マッピング
return Example.reconstruct({
  status: row.status as ExampleStatus,  // DBの文字列 → ドメイン列挙型
})
```

## バリューオブジェクト（VO）の判断基準

以下の場合にVOを作成する：

1. **バリデーションロジックがある場合** - Email、電話番号など
2. **複数の値を組み合わせる場合** - 住所（都道府県+市区町村+番地）
3. **ドメイン固有の振る舞いがある場合** - 金額計算、日付範囲

以下の場合はVOを作成しない：

- 単純なプリミティブ型（string, number, boolean）
- 既にconst型で定義済みの列挙型（`PriceType`, `RecurringInterval`など）
- 既存のエンティティで単純なstringとして扱われているもの（currency など）

```typescript
// VOにする価値がある例
export class Email {
  private static readonly regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(public readonly value: string) {
    if (!Email.regex.test(value)) {
      throw new Error("Invalid email")
    }
  }
}

// VOにしない例（const型で十分）
export type PriceType = "one_time" | "recurring"
export type RecurringInterval = "month" | "year"
```

## Drizzle Schema の JSON 型指定

JSON カラムには `$type<>()` で型を指定する：

```typescript
import { json, mysqlTable } from "drizzle-orm/mysql-core"

export const products = mysqlTable("products", {
  // JSON カラムの型指定
  metadata: json("metadata").$type<Record<string, string> | null>(),
  features: json("features").$type<string[] | null>(),
})
```

## Repository の Entity.reconstruct() での nullable 処理

DB から取得した nullable カラムのデフォルト値処理：

```typescript
// Repository 内での Entity.reconstruct() 呼び出し
return Product.reconstruct({
  displayOrder: row.displayOrder ?? 0,  // nullable → デフォルト値を設定
  // ...
})
```

## Query Service パターン

複雑なクエリ（JOIN、集計など）でリポジトリパターンが適さない場合、Query Service を使用する。

### Query Service Port（queries/usecases/ に同居）

```typescript
// modules/{module}/internal/application/queries/usecases/{query}/{query}.query-service.port.ts

export type FindExamplesQueryServicePortInput = {
  activeOnly?: boolean
}

export type FindExamplesQueryServicePortRow = {
  id: string
  name: string
  relatedCount: number
}

export type FindExamplesQueryServicePortOutput = {
  examples: FindExamplesQueryServicePortRow[]
}

export interface FindExamplesQueryServicePort {
  handle(
    input: FindExamplesQueryServicePortInput
  ): Promise<FindExamplesQueryServicePortOutput>
}

export const FindExamplesQueryServicePortToken = Symbol(
  "FindExamplesQueryServicePort"
)
```

### Query Service 実装（infrastructure/db/mysql/drizzle/query-services/）

```typescript
// modules/{module}/internal/infrastructure/db/mysql/drizzle/query-services/{query}.mysql-drizzle.query-service.ts
import { count, eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type {
  FindExamplesQueryServicePort,
  FindExamplesQueryServicePortInput,
  FindExamplesQueryServicePortOutput
} from "@/backend/modules/{module}/internal/application/queries/usecases/find-examples/find-examples.query-service.port"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { examples, relatedItems } from "@/backend/modules/{module}/internal/infrastructure/db/mysql/drizzle/schemas"

@injectable()
export class FindExamplesMysqlDrizzleQueryService
  implements FindExamplesQueryServicePort
{
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async handle(
    input: FindExamplesQueryServicePortInput
  ): Promise<FindExamplesQueryServicePortOutput> {
    const db = this.getDb.handle()

    const rows = await db
      .select({
        id: examples.id,
        name: examples.name,
        relatedCount: count(relatedItems.id)
      })
      .from(examples)
      .leftJoin(relatedItems, eq(examples.id, relatedItems.exampleId))
      .where(input.activeOnly ? eq(examples.active, true) : undefined)
      .groupBy(examples.id)

    return {
      examples: rows.map((row) => ({
        id: row.id,
        name: row.name,
        relatedCount: row.relatedCount
      }))
    }
  }
}
```

## チェックリスト

新規実装時の確認事項:

- [ ] Server Action に `"use server"` 指定
- [ ] **Server Action は `withRequestContext` でラップ**
- [ ] UseCase に `@injectable()` デコレータ
- [ ] UseCase は UseCase Port インターフェースを実装
- [ ] **UseCase の Output は DTO形式（プリミティブ型）で返す（Domain Entity を直接返さない）**
- [ ] ポートは Symbol トークンで定義（`*Token = Symbol("*")`）
- [ ] Port は Input/Output/Interface/Token を定義
- [ ] **UseCase Port は `public/ports/` に配置**
- [ ] **Domain Errors は `public/errors/` に配置**
- [ ] Domain Entity は `create()` と `reconstruct()` を実装
- [ ] Domain Entity の変更メソッドで `updatedAt` を更新
- [ ] Domain Error は `this.name` を設定
- [ ] Repository は `GetDb` 経由で DB アクセス（`this.getDb.handle()`）
- [ ] Repository の `save()` は `onDuplicateKeyUpdate` で upsert 実装
- [ ] Repository で `Entity.reconstruct()` を使用してドメインオブジェクトに変換
- [ ] Repository のファイル名は `{entity}.mysql-drizzle.repository.ts`
- [ ] Repository は `infrastructure/db/mysql/drizzle/repositories/` に配置
- [ ] Repository の import はエイリアスパス（`@/backend/...`）を使用
- [ ] Drizzle Schema で外部キー制約名を定数化（外部キーがある場合）
- [ ] Drizzle Schema で適切なインデックスを定義
- [ ] Drizzle Schema の JSON カラムに `$type<>()` で型指定
- [ ] **Schema を `bootstrap/db/schemas/index.ts` にエクスポート追加**
- [ ] DI 登録を `registerSingleton` で追加
- [ ] **Handler はクラスベースで `@injectable()` デコレータ**
- [ ] **Handler は Token と Interface を export**
- [ ] **Handler は `LoggerPort` を DI 注入**
- [ ] Handler で Zod バリデーションを実装（Action ではなく Handler で行う）
- [ ] Handler で Domain Error を Result 型に変換
- [ ] Handler でエラーコードを共通定数から参照
- [ ] **Handler で予期しないエラーをログ出力（`this.logger.error()`）**
- [ ] **Handler を `presentation.di.ts` で DI 登録**
- [ ] Action は「薄いラッパー」として Handler を呼び出すだけ
- [ ] Repository の戻り値は `null`（`undefined` ではない）
- [ ] 型アサーション（as）を避ける（Repository の `Entity.reconstruct()` での列挙型マッピングは例外）
- [ ] Drizzle Schema のタイムスタンプデフォルト値は `.default(sql\`CURRENT_TIMESTAMP(3)\`)`
- [ ] 内部ポート（外部サービス連携含む）は `application/ports/` に配置
- [ ] `pnpm type:check` が通ること（必須）
