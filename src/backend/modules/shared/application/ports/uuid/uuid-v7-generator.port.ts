export interface UuidV7GeneratorPort {
  generate(): string
}

export const UuidV7GeneratorPortToken = Symbol("UuidV7GeneratorPort")
