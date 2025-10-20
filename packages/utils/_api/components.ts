import { getHttpService } from '../../utils/AjaxPackage/netseriver.js'
import FormData from 'form-data'
import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'

const httpApi: any = getHttpService({
  baseURL: 'http://192.168.209.103:10019/ts-fm',
  timeout: 3000,
  getToken: () => null,
  // 响应字段配置
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

//上传组件
export function setWebUpload(data: any) {
  const formData = new FormData()

  // 将data对象转为JSON字符串添加到formData
  formData.append('data', JSON.stringify(data.data))

  // 处理文件数据
  if (data.file && data.file.buffer) {
    formData.append('file', data.file.buffer, {
      filename: data.file.name,
      contentType: data.file.type,
    })
  }

  // 获取form-data生成的headers
  const formHeaders = formData.getHeaders()
  return httpApi.post('/file/webUpload', formData, {
    headers: {
      ...formHeaders,
    },
  })
}
//获取组件列表
export async function getList(data: any) {
  const res = await httpApi.post('file/getList', {
    productCode: 'webFile_his',
    vue: [COMPONENT_SETTING_TYPE],
    ...data,
  })
  return res[COMPONENT_SETTING_TYPE]
}

//获取组件实例
export function getDownLoadByIds(data: any) {
  return httpApi.post('/file/downLoadByIds', data)
}

//删除组件库组件
export function setDeleteByPathAndCode(componentCode: string, code: string = 'webfile') {
  return httpApi.post('/file/deleteByPathAndCode', {
    code,
    paraMeters: {
      productCode: 'webFile_his',
      Vue: COMPONENT_SETTING_TYPE,
      componentCode,
    },
  })
}
