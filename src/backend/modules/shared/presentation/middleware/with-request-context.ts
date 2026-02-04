import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { RequestContextPort } from "@/backend/modules/shared/application/ports/context/request-context.port"
import { RequestContextPortToken } from "@/backend/modules/shared/application/ports/context/request-context.port"
import type { UuidV7GeneratorPort } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { UuidV7GeneratorPortToken } from "@/backend/modules/shared/application/ports/uuid/uuid-v7-generator.port"
import { AlsContext } from "@/backend/modules/shared/infrastructure/node/als/als-context"

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
