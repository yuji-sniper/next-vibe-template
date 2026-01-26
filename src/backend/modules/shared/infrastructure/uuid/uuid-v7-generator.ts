import { injectable } from "tsyringe"
import { v7 } from "uuid"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"

@injectable()
export class UuidV7Generator implements UuidV7GeneratorPort {
  generate(): string {
    return v7()
  }
}
