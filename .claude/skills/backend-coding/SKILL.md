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
│   └── container.ts              # DI コンテナ初期化
└── modules/
    ├── shared/                   # 共有モジュール
    │   ├── di/
    │   │   └── infrastructure.di.ts
    │   ├── application/
    │   │   └── ports/
    │   │       ├── db/
    │   │       │   └── transactor.port.ts
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
    │   │   │           ├── transactor.ts
    │   │   │           └── schemas/
    │   │   ├── node/
    │   │   │   └── als/
    │   │   │       └── als-context.ts
    │   │   └── uuid/
    │   │       └── uuid-v7-generator.ts
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
        │   ├── ports/
        │   │   └── *.port.ts           # モジュール共通ポート
        │   ├── queries/
        │   │   ├── ports/
        │   │   │   └── *.port.ts
        │   │   └── usecases/
        │   │       └── {usecase}/
        │   │           ├── *.usecase.ts
        │   │           └── *.usecase.port.ts
        │   └── commands/
        │       ├── ports/
        │       │   └── *.port.ts
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
        │   ├── modules/
        │   │   └── {other-module}/
        │   │       └── *.adapter.ts    # モジュール間アダプター
        │   ├── repositories/
        │   │   └── *.drizzle.repository.ts
        │   └── {external-service}/
        │       └── *.adapter.ts        # 外部サービスアダプター
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

**Action は「薄いラッパー」として機能し、Handler を呼び出すだけ。バリデーションは Handler で行う。**

```typescript
// modules/{module}/presentation/actions/{action}/{action}.action.ts
"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleExample } from "../../handlers/example/example.handler"

export type ExampleActionRequest = {
  name: string
  email?: string
}

export type ExampleActionResponse = ActionResponse<{
  example: { id: string; name: string }
}>

// Action はシンプルに Handler を呼び出すだけ（バリデーションは Handler で行う）
export const exampleAction = async (
  request: ExampleActionRequest
): Promise<ExampleActionResponse> => {
  return await handleExample(request)
}
```

### 2. Handler

**Handler は Zod でバリデーションを行い、UseCase を呼び出し、エラーを Result 型に変換する。**

```typescript
// modules/{module}/presentation/handlers/{handler}/{handler}.handler.ts
import { z } from "zod"
import { resolveContainer } from "@/backend/bootstrap/container"
import type { ExampleUseCasePort } from "../../application/queries/usecases/example/example.usecase.port"
import { ExampleUseCasePortToken } from "../../application/queries/usecases/example/example.usecase.port"
import { ExampleNotFoundError } from "../../domain/example/example.errors"
import type { Result } from "@/backend/modules/shared/presentation/handlers/types/result"
import { formatZodErrors } from "@/backend/modules/shared/presentation/handlers/utils/format-zod-errors"
import { EXAMPLE_ERROR_CODES } from "@/shared/errors/example.errors"
import { COMMON_ERROR_CODES } from "@/shared/errors/common.errors"

// Zod スキーマ定義（Handler 内で定義）
const exampleSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email().optional()
})

// z.infer でスキーマから型を推論（二重定義を避ける）
type ExampleHandlerInput = z.infer<typeof exampleSchema>

type ExampleHandlerResult = Result<{
  example: { id: string; name: string }
}>

export const handleExample = async (
  input: ExampleHandlerInput
): Promise<ExampleHandlerResult> => {
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

  // 2. UseCase 実行
  const usecase = await resolveContainer<ExampleUseCasePort>(
    ExampleUseCasePortToken
  )

  try {
    const output = await usecase.handle({
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

    return {
      ok: false,
      error: {
        code: COMMON_ERROR_CODES.INTERNAL_SERVER_ERROR,
        status: 500,
        message: "Internal server error"
      }
    }
  }
}
```

### 3. Port（インフラストラクチャ連携用）

```typescript
// modules/{module}/application/commands/ports/create-example.port.ts

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

### 4. UseCase Port

**重要: UseCase の Output はドメイン型（Entity クラス）を直接返さず、DTO形式（プリミティブ型）で返す。**

理由：
- Presentation層がDomain層に直接依存しない（レイヤー間の結合度を下げる）
- Server ActionでのシリアライゼーションでDateやクラスインスタンスの問題を回避
- 内部のドメインロジックや状態が外部に露出しない

```typescript
// modules/{module}/application/commands/usecases/{usecase}/{usecase}.usecase.port.ts

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

### 5. UseCase 実装

```typescript
// modules/{module}/application/commands/usecases/{usecase}/{usecase}.usecase.ts
import { inject, injectable } from "tsyringe"
import type { ExampleRepository } from "../../../domain/example/example.repository"
import { ExampleRepositoryToken } from "../../../domain/example/example.repository"
import type { CreateExamplePort } from "../../ports/create-example.port"
import { CreateExamplePortToken } from "../../ports/create-example.port"
import type { GetCurrentUserPort } from "../../../ports/get-current-user.port"
import { GetCurrentUserPortToken } from "../../../ports/get-current-user.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { Example } from "../../../domain/example/example"
import { ExampleNotFoundError } from "../../../domain/example/example.errors"
import type {
  CreateExampleUseCasePort,
  CreateExampleUseCasePortInput,
  CreateExampleUseCasePortOutput
} from "./create-example.usecase.port"

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

### 6. Domain Entity

```typescript
// modules/{module}/domain/{entity}/{entity}.ts

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

### 7. Domain Errors

```typescript
// modules/{module}/domain/{entity}/{entity}.errors.ts

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

### 8. Repository Interface

```typescript
// modules/{module}/domain/{entity}/{entity}.repository.ts
import type { Example } from "./example"

export const ExampleRepositoryToken = Symbol("ExampleRepository")

export interface ExampleRepository {
  findById(id: string): Promise<Example | undefined>
  findByUserId(userId: string): Promise<Example | undefined>
  findByExternalId(externalId: string): Promise<Example | undefined>
  save(example: Example): Promise<void>
  delete(id: string): Promise<void>
}
```

### 9. Drizzle Repository 実装

```typescript
// modules/{module}/infrastructure/repositories/{entity}.drizzle.repository.ts
import { eq } from "drizzle-orm"
import { inject, injectable } from "tsyringe"
import type { ExampleStatus } from "@/backend/modules/{module}/domain/example/example"
import { Example } from "@/backend/modules/{module}/domain/example/example"
import type { ExampleRepository } from "@/backend/modules/{module}/domain/example/example.repository"
import { GetDb } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/get-db"
import { examples } from "@/backend/modules/shared/infrastructure/db/mysql/drizzle/schemas"

@injectable()
export class ExampleDrizzleRepository implements ExampleRepository {
  constructor(
    @inject(GetDb)
    private readonly getDb: GetDb
  ) {}

  async findById(id: string): Promise<Example | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(examples)
      .where(eq(examples.id, id))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
  }

  async findByUserId(userId: string): Promise<Example | undefined> {
    const db = this.getDb.handle()
    const result = await db
      .select()
      .from(examples)
      .where(eq(examples.userId, userId))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return this.toDomain(result[0])
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

  private toDomain(row: {
    id: string
    userId: string
    externalId: string
    name: string
    status: string
    createdAt: Date
    updatedAt: Date
  }): Example {
    return Example.reconstruct({
      id: row.id,
      userId: row.userId,
      externalId: row.externalId,
      name: row.name,
      status: row.status as ExampleStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    })
  }
}
```

### 10. Infrastructure Adapter（外部サービス）

```typescript
// modules/{module}/infrastructure/{service}/{action}.{service}.adapter.ts
import { injectable } from "tsyringe"
import { ExampleCreateFailedError } from "../../domain/example/example.errors"
import type {
  CreateExamplePort,
  CreateExamplePortInput,
  CreateExamplePortOutput
} from "../../application/commands/ports/create-example.port"
import { externalClient } from "./external-client"

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
// modules/{module}/infrastructure/modules/{other-module}/{action}.{other-module}.adapter.ts
import { inject, injectable } from "tsyringe"
import type { GetAuthUserPort } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import { GetAuthUserPortToken } from "@/backend/modules/auth/application/queries/ports/get-auth-user.port"
import type {
  GetCurrentUserPort,
  GetCurrentUserPortOutput
} from "../../../application/ports/get-current-user.port"

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
// modules/{module}/di/infrastructure.di.ts
import type { DependencyContainer } from "tsyringe"
import { ExampleRepositoryToken } from "../domain/example/example.repository"
import { ExampleDrizzleRepository } from "../infrastructure/repositories/example.drizzle.repository"
import { CreateExamplePortToken } from "../application/commands/ports/create-example.port"
import { CreateExampleExternalAdapter } from "../infrastructure/external/create-example.external.adapter"
import { GetCurrentUserPortToken } from "../application/ports/get-current-user.port"
import { GetCurrentUserAuthModuleAdapter } from "../infrastructure/modules/auth/get-current-user.auth-module.adapter"

export function initInfrastructureDependency(container: DependencyContainer) {
  // Repositories
  container.registerSingleton(ExampleRepositoryToken, ExampleDrizzleRepository)

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
// modules/{module}/di/application.di.ts
import type { DependencyContainer } from "tsyringe"
import { CreateExampleUseCasePortToken } from "../application/commands/usecases/create-example/create-example.usecase.port"
import { CreateExampleUseCase } from "../application/commands/usecases/create-example/create-example.usecase"

export function initApplicationDependency(container: DependencyContainer) {
  container.registerSingleton(
    CreateExampleUseCasePortToken,
    CreateExampleUseCase
  )
}
```

```typescript
// modules/{module}/di/index.ts
import type { DependencyContainer } from "tsyringe"
import { initApplicationDependency } from "./application.di"
import { initInfrastructureDependency } from "./infrastructure.di"

export const initExampleDependency = (container: DependencyContainer) => {
  initInfrastructureDependency(container)
  initApplicationDependency(container)
}
```

## Drizzle Schema

```typescript
// modules/shared/infrastructure/db/mysql/drizzle/schemas/{table}.ts
import { relations } from "drizzle-orm"
import {
  boolean,
  foreignKey,
  index,
  mysqlTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core"
import { users } from "./users"

// 外部キー制約名の定数化
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
      .defaultNow(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .notNull()
      .defaultNow()
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

## Result 型

```typescript
// modules/shared/presentation/handlers/types/result.ts
interface Ok<T> {
  ok: true
  data: T
}

interface Err {
  ok: false
  error: {
    code: string
    status: number
    message: string
    details?: Record<string, unknown>
  }
}

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
import type { ExampleRepository } from "../../../domain/example/example.repository"
import { ExampleRepositoryToken } from "../../../domain/example/example.repository"

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

## Better-Auth 統合

```typescript
// modules/auth/infrastructure/auth/better-auth/auth.ts
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
import { AuthUserUnauthorizedError } from "../../../domain/auth-user/auth-user.errors"
import type {
  GetAuthUserPort,
  GetAuthUserPortOutput
} from "../../../application/queries/ports/get-auth-user.port"
import { AuthUser } from "../../../domain/auth-user/auth-user"
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

1. `modules/{module}/` ディレクトリを作成
2. `domain/` にエンティティ、エラー、リポジトリインターフェースを定義
3. `application/ports/` にモジュール共通ポートを定義（認証ユーザー取得など）
4. `application/queries/ports/` または `application/commands/ports/` に操作別ポートを定義
5. `application/*/usecases/{usecase}/` にユースケースとユースケースポートを実装
6. `infrastructure/repositories/` にリポジトリ実装を追加
7. `infrastructure/modules/` にモジュール間アダプターを追加
8. `infrastructure/{service}/` に外部サービスアダプターを追加
9. `di/` に依存性登録を追加
10. `bootstrap/container.ts` に init 関数を追加
11. `presentation/handlers/` にハンドラーを実装
12. `presentation/actions/` に Server Action を実装

## スキーマ追加時

1. `modules/shared/infrastructure/db/mysql/drizzle/schemas/` にスキーマファイル作成
2. `schemas/index.ts` にエクスポートを追加
3. マイグレーション生成: `pnpm drizzle-kit:generate`
4. マイグレーション適用: `pnpm drizzle-kit:migrate`

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
import { Product } from "@/backend/modules/billing/domain/product/product"
import type { ProductRepository } from "@/backend/modules/billing/domain/product/product.repository"

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
- Drizzle の toDomain() で、DBから取得した文字列をドメインの列挙型にマッピングする場合

```typescript
// ❌ NG: 型アサーションを使用
const products = res.data.products as Product[]

// ✅ OK: 明示的なマッピングで型変換
const products: Product[] = res.data.products.map((p) => ({
  id: p.id,
  name: p.name,
  // ...
}))

// ✅ OK（例外）: Repository の toDomain() でのドメイン型マッピング
private toDomain(row: { status: string }): Example {
  return Example.reconstruct({
    status: row.status as ExampleStatus,  // DBの文字列 → ドメイン列挙型
  })
}
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

## Repository の toDomain() での nullable 処理

DB から取得した nullable カラムのデフォルト値処理：

```typescript
private toDomain(row: {
  displayOrder: number | null  // DB では nullable
  // ...
}): Product {
  return Product.reconstruct({
    displayOrder: row.displayOrder ?? 0,  // デフォルト値を設定
    // ...
  })
}
```

## チェックリスト

新規実装時の確認事項:

- [ ] Server Action に `"use server"` 指定
- [ ] UseCase に `@injectable()` デコレータ
- [ ] UseCase は UseCase Port インターフェースを実装
- [ ] **UseCase の Output は DTO形式（プリミティブ型）で返す（Domain Entity を直接返さない）**
- [ ] ポートは Symbol トークンで定義（`*Token = Symbol("*")`）
- [ ] Port は Input/Output/Interface/Token を定義
- [ ] Domain Entity は `create()` と `reconstruct()` を実装
- [ ] Domain Entity の変更メソッドで `updatedAt` を更新
- [ ] Domain Error は `this.name` を設定
- [ ] Repository は `GetDb` 経由で DB アクセス（`this.getDb.handle()`）
- [ ] Repository の `save()` は `onDuplicateKeyUpdate` で upsert 実装
- [ ] Repository に `toDomain()` プライベートメソッドを実装
- [ ] Repository の import はエイリアスパス（`@/backend/...`）を使用
- [ ] Drizzle Schema で外部キー制約名を定数化
- [ ] Drizzle Schema で適切なインデックスを定義
- [ ] Drizzle Schema の JSON カラムに `$type<>()` で型指定
- [ ] DI 登録を `registerSingleton` で追加
- [ ] Handler で Zod バリデーションを実装（Action ではなく Handler で行う）
- [ ] Handler で Domain Error を Result 型に変換
- [ ] Handler でエラーコードを共通定数から参照
- [ ] Action は「薄いラッパー」として Handler を呼び出すだけ
- [ ] 型アサーション（as）を避ける（Repository の toDomain() での列挙型マッピングは例外）
- [ ] `pnpm type:check` が通ること（必須）
