import { getHttpService } from '@moluoxixi/utils/AjaxPackage'

//import { getHttpService } from '@moluoxixi/AjaxPackage'

const httpApi: any = getHttpService({
  baseURL: 'http://192.168.209.103:10019/',
  timeout: 3000,
  getToken: () => null,
  // 响应字段配置
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

export function getList(data: any) {
  return httpApi.post('/ts-fm/file/getList', data)
}

const httpApi2: any = getHttpService({
  baseURL: 'http://192.168.209.103:10019/',
  timeout: 6000,
  getToken: () => null,
  // 响应字段配置
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

export function getDownLoadByIds(data: any) {
  return httpApi2.post('/ts-fm/file/downLoadByIds', data)
}

export * from './models'
// 导出所有服务
export * from './services'
