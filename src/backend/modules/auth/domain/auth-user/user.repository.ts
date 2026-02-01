export interface UserRepository {
  delete(userId: string): Promise<boolean>
}

export const UserRepositoryToken = Symbol("UserRepository")
