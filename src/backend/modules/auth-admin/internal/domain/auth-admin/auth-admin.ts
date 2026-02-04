import { Email } from "@/backend/modules/shared/domain/value-objects/email.vo"

export class AuthAdmin {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly name: string
  ) {}

  static reconstruct(params: {
    id: string
    email: string
    name: string
  }): AuthAdmin {
    return new AuthAdmin(params.id, new Email(params.email), params.name)
  }
}
