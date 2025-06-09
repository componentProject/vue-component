import { userRequest } from '@/api/utils'

export function getUserList(data: any) {
  return userRequest({
    url: '/user',
    method: 'get',
    params: data,
  })
}
