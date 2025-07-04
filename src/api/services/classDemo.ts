import type { User } from '@/api/models/user'
import type { AxiosResponse } from 'axios'
import BaseApi from '@/api/utils'

export class UserApi extends BaseApi {
  constructor() {
    super('/api/users')
  }

  async getUsers(): Promise<AxiosResponse<User[]>> {
    return this.get<User[]>('')
  }
}
