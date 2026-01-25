export interface AdminRepository {
  delete(adminId: string): Promise<void>
}

export const AdminRepositoryToken = Symbol("AdminRepository")
