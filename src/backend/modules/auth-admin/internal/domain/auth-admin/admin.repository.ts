export interface AdminRepository {
  delete(adminId: string): Promise<boolean>
}

export const AdminRepositoryToken = Symbol("AdminRepository")
