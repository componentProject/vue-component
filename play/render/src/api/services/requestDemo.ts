import type { AxiosResponse } from 'axios'
import type { User } from '../../api'
import BaseApi from '../../api/utils'

const request = new BaseApi('/api/users')

export async function getUsers(): Promise<AxiosResponse<User[]>> {
  return request.get<User[]>('')
}
