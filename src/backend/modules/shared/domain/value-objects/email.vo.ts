export class Email {
  private static readonly regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(public readonly value: string) {
    if (!Email.regex.test(value)) {
      throw new Error("Invalid email")
    }
  }
}
