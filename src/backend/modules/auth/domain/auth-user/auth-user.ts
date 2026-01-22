import { Email } from "@/backend/modules/shared"

export class AuthUser {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly name: string
  ) {}

  static create(params: { id: string; email: string; name: string }): AuthUser {
    return new AuthUser(params.id, new Email(params.email), params.name)
  }
}
