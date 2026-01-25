export interface UserRepository {
  delete(userId: string): Promise<void>
}

export const UserRepositoryToken = Symbol("UserRepository")
