import { getHttpService } from '../../../../packages/utils/AjaxPackage/index.ts'
import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'

//import { getHttpService } from '@moluoxixi/AjaxPackage'

export const httpApi: any = getHttpService({
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

export async function getList(data: any = {}) {
  const res = await httpApi.post('/ts-fm/file/getList', {
    productCode: 'webFile_his',
    vue: [COMPONENT_SETTING_TYPE],
    ...data,
  })
  return res[COMPONENT_SETTING_TYPE]
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
