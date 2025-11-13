import { getHttpService } from '../../utils/AjaxPackage/netseriver.js'

const memoryApi: any = getHttpService({
  baseURL: '/ts-cache',
  timeout: 3000,
  getToken: () => null,
  // 响应字段配置
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

// 获取表格自定义列
export function getMemoryQuery(data: any) {
  return memoryApi.post('/memory/query', data)
}

// 上传表格自定义列
export function setMemoryUpload(data: any) {
  return memoryApi.post('/memory/upload', data)
}

// 删除表格自定义列
export function deleteMemoryUpload(data: any) {
  return memoryApi.post('/memory/delete', data)
}
