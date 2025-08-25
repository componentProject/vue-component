/*
 * @Date: 2024-04-15 16:39:24
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-08-29 09:06:43
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'
import utils from './utils'
import { addSign } from '@/utils/index.js'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_SSO_URL_TWO, // url = base url + request url
  timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    // his6.0接入网关请求，后期可能会再增加其他接口前缀
    addSign(config)
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
      // if (data.statusCode != 200) {
      //   ElMessage({
      //     message: data.Message || data.message,
      //     type: 'error'
      //   });
      // }
      return res.data
    }
  },
  (error) => {
    ElMessage({
      message: error.response?.data?.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service