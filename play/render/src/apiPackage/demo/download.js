/*
 * @Date: 2024-07-16 8:39:24
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-07-22 09:28:33
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user.js'
const store = useUserStore()
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // url = base url + request url
  timeout: 60000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    if (store.getToken()) {
      config.headers['token'] = store.getToken()
    }
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
      let fileName = response.headers['content-disposition'].match(/filename=(.*)/)[1]
      if (fileName) {
        fileName = decodeURI(fileName)
      }
      const blob = new Blob([response.data], { type: 'application/octet-stream' })
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, fileName)
      } else {
        const blobURL = window.URL.createObjectURL(blob)
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', fileName)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    }
  },
  (error) => {
    ElMessage({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
