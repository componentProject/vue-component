import BaseApi from '@/api/utils'
import type { AxiosResponse } from 'axios'
import type { User } from '@/api'

const request = new BaseApi('/api/users')

export async function getUsers(): Promise<AxiosResponse<User[]>> {
  return request.get<User[]>('')
}
