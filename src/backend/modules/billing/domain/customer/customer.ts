import { Email } from "@/backend/modules/shared/domain/value-objects/email.vo"

export class Customer {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly stripeCustomerId: string,
    public readonly email: Email,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(params: {
    id: string
    userId: string
    stripeCustomerId: string
    email: string
  }): Customer {
    const now = new Date()
    return new Customer(
      params.id,
      params.userId,
      params.stripeCustomerId,
      new Email(params.email),
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    userId: string
    stripeCustomerId: string
    email: string
    createdAt: Date
    updatedAt: Date
  }): Customer {
    return new Customer(
      params.id,
      params.userId,
      params.stripeCustomerId,
      new Email(params.email),
      params.createdAt,
      params.updatedAt
    )
  }
}
