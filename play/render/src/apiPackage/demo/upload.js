/*
 * @Date: 2024-04-15 16:39:24
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-11-27 15:48:57
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user.js'
import CryptoJS from 'crypto-js'
import utils from './utils'
import { addSign } from '@/utils/index.js'

const store = useUserStore()
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // url = base url + request url
  timeout: 5000 // request timeout,
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    if (store.getToken()) {
      config.headers['token'] = store.getToken()
    }
    addSign(config)
    config.headers['Content-Type'] = 'multipart/form-data;'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response
    if (res.status !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      const data = res.data
      if (data.Code != 200) {
        ElMessage({
          message: data.Message || data.message,
          type: 'error'
        })
      }
      return res.data
    }
  },
  (error) => {
    if (error.response.status == 401) {
      store.userLogin()
    }
    ElMessage({
      message: error.response.data.message || error.response.data,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
