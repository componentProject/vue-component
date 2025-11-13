import type { AxiosResponse } from 'axios'
import type { User } from '../../api/models/user'
import BaseApi from '../../api/utils'

export class UserApi extends BaseApi {
  constructor() {
    super('/api/users')
  }

  async getUsers(): Promise<AxiosResponse<User[]>> {
    return this.get<User[]>('')
  }
}
