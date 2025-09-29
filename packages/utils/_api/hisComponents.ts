import { getHttpService } from '../../utils/AjaxPackage/netseriver.js'

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

//HIS6.0 获取HisFooter（医保信息）
export function getQueryMedicaIInsuranceInfoApi(headers: any) {
  return httpApi.post('/ts-pfs-bas/queryMedicalInsuranceInfo', {}, headers)
}
