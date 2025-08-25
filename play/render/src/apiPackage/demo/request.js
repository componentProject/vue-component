/*
 * @Date: 2024-04-15 16:39:24
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-12-19 09:11:01
 */
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/modules/user.js'
import { addSign } from '@/utils/index.js'

const store = useUserStore()
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // url = base url + request url
  timeout: 1000 * 30, // request timeout,
})
// 存储pending请求的Map
const pendingRequests = new Map()
// 请求拦截
service.interceptors.request.use(
  (config) => {
    /*// 生成唯一标识
    const requestKey = `${config.method}-${config.url}`;

    // 如果存在重复请求，取消前一个
    if (pendingRequests.has(requestKey)) {
      const cancel = pendingRequests.get(requestKey);
      cancel(requestKey);
      pendingRequests.delete(requestKey);
    }

    // 创建新的CancelToken
    config.cancelToken = new axios.CancelToken(cancel => {
      pendingRequests.set(requestKey, cancel);
    });*/

    if (store.getToken()) {
      config.headers.token = store.getToken()
    }
    addSign(config)
    const userInfo = store.getUserInfo
    config.data = {
      orgCode: userInfo.corpcode,
      hospCode: userInfo.hospCode,
      orgName: userInfo.corpName,
      hospName: userInfo.hospName,
      operatorId: userInfo.id,
      operatorName: userInfo.name,
      ...config.data,
    }
    return config
  },
  (error) => {
    return { code: 405, message: error.message || 'Request Error' }
  },
)
// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response

    // 请求完成时移除pending记录
    const requestKey = `${res.config.method}-${res.config.url}`
    pendingRequests.delete(requestKey)

    if (res.status !== 200) {
      return { code: 503, message: res.statusText || res.message || 'Response Error' }
    }
    else {
      const data = res.data
      const msgData = res.data?.data?.returnInfo || res.data?.data
      if (data.Code != 200) {
        ElMessage({
          message: data.Message || data.message,
          type: 'error',
        })
        return { code: 503, message: data.Message || data.message || 'Response Error' }
      }
      else if (msgData?.errors?.length) {
        let html = ``
        msgData.errors.forEach((item, index) => {
          html += `<div style="font-size: 14px;color:red">${item.code}：${item.message}</div>`
        })
        ElNotification({
          title: '提示',
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 10000,
          message: html,
        })
        return { code: 503, message: res.data.data?.errors?.map(e => e.message).join('; ') || 'Response Error' }
      }
      if (msgData?.tipss?.length) {
        let html = ``
        msgData.tipss.forEach((item, index) => {
          html += `<div style="font-size: 14px;color:#E6A23C">${item.code}：${item.message}</div>`
        })
        ElNotification({
          title: '提示',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          duration: 10000,
          message: html,
        })
      }
      return res.data // 返回响应数据
    }
  },
  (error) => {
    // if (error.code === 'ECONNABORTED') {
    //   ElMessage.error('请求超时，请重试');
    //   // 或者使用通知
    //   // ElNotification.error({
    //   //   title: '错误',
    //   //   message: '请求超时，请重试'
    //   // })
    // }
    // 如果是主动取消的请求，不报错
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
      return { code: 503, message: error.message }
    }

    if (error.response?.status == 401) {
      store.userLogin()
      if (error.response?.statusText === 'Unauthorized') {
        error.response.data = '登录超时，请重新登录！'
      }
    }
    ElMessage({
      message: error.response?.data?.message || error?.response?.data || '请求超时,请重试!',
      type: 'error',
      duration: 5 * 1000,
    })
    return {
      code: 503,
      message: error.response?.data?.message || error?.response?.data || error.message || 'Response Error',
    }
  },
)

export default service
