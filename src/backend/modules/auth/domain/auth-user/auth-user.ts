import { Email } from "@/backend/modules/shared/domain/value-objects/email.vo"

export class AuthUser {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly name: string,
    public readonly image?: string
  ) {}

  static reconstruct(params: {
    id: string
    email: string
    name: string
    image?: string
  }): AuthUser {
    return new AuthUser(
      params.id,
      new Email(params.email),
      params.name,
      params.image
    )
  }
}
