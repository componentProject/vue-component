import axios from 'axios'
import qs from 'qs'
// 导入addSign函数
import { addSign } from '../../../play/render/src/utils/modules/his6.0'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://192.168.209.103:10019/',
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    //参数表单提交
    if (config.formData) {
      config.headers['Content-Type'] = 'project/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }
    // 添加认证信息
    addSign(config)
    config.headers.startTime = new Date().getTime()
    return config
  },
  (error) => {
    console.log('2222222222', error)
    Promise.reject(error)
  },
)

export default service
