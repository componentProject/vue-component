export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'doctor' | 'nurse' | 'patient'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  name: string
  email: string
}
