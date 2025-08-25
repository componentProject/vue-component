/*
 * @Date: 2024-04-15 16:39:24
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-12-18 09:47:30
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'
import utils from './utils'
import { addSign } from '@/utils/index.js'

/**
 * 创建一个axios实例，用于处理HTTP请求
 * @constant
 * @type {AxiosInstance}
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_SSO_URL_TWO, // 基础URL，后续请求会在此基础上拼接请求URL
  timeout: 5000, // 请求超时时间设置为5000毫秒
})

/**
 * 请求拦截器，用于在请求发送前对请求进行处理
 */
service.interceptors.request.use(
  (config) => {
    // 检查请求的baseURL是否包含特定字符串，判断是否需要进行加密处理
    addSign(config)
    // 返回处理后的配置
    return config
  },
  (error) => {
    // 如果请求出错，返回一个被拒绝的Promise
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器，用于在响应到达前对响应进行处理
 */
service.interceptors.response.use(
  (response) => {
    const res = response
    // 检查响应状态码是否为200，如果不是则抛出错误
    if (res.status !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      const data = res.data
      // 返回响应数据
      return res.data
    }
  },
  (error) => {
    // 如果响应出错，显示错误信息
    ElMessage({
      message: error.response?.data?.message || '请求失败',
      type: 'error',
      duration: 5 * 1000, // 错误信息显示时间为5秒
    })
    // 返回一个被拒绝的Promise
    return Promise.reject(error)
  },
)

export default service
