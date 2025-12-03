// hisComponents.ts文件
import { getHttpService } from '@moluoxixi/utils/AjaxPackage/index.ts'

const httpApi: any = getHttpService({
  baseURL: '/ts-bs-his-base',
  timeout: 3000,
  getToken: () => null,
  // 响应字段配置
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

// HIS6.0 获取HisFooter（医保信息）
export function getQueryMedicaIInsuranceInfoApi(headers: any, addSign: any, params = {}) {
  // 前端服务
  // return httpApi.post('/ts-pfs-bas/queryMedicalInsuranceInfo', {}, headers, addSign)
  // 业务服务
  return httpApi.post('/ts-bs-bas/queryMedicalInsuranceInfo', params, headers, addSign)
}
