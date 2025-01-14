import axios from 'axios'
import { getcookie, getparames } from './index.js'
// var qs = require('qs');
import { Message } from 'element-ui'

class Http {
  constructor(baseUrl) {
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      paramsSerializer: function (params) {
        return qs.stringify(params, {
          indices: false,
        })
      },
    })
    this.http.interceptors.request.use(this.interceptRequest, this.interceptRequestFail)
    /**响应拦截器*/
    this.http.interceptors.response.use(this.interceptResponseSuccess, this.interceptResponseFail)
  }
  get(url, params, opts) {
    return this.http.get(url, { ...opts, params })
  }
  delete(url, params, opts) {
    return this.http.delete(url, { ...opts, params })
  }
  post(url, data, opts) {
    return this.http.post(url, data, opts)
  }
  put(url, data, opts) {
    return this.http.put(url, data, opts)
  }
  request(opts) {
    return this.http.request(opts)
  }
  interceptRequest(config) {
    // 兼容老ops-web
    let token = localStorage.getItem('token')
    let parames = getparames()
    if (token == 'null' || token == 'undefined') {
      localStorage.removeItem('token')
      token = getcookie('THPMSCookie') || getcookie('token') || global.userInfo?.token
    }
    if (!token) {
      token = parames.t || parames.token
      if (token && token.split('BBSS').length > 1) {
        // 需要base64解密
        token = decodeURIComponent(Base64.decode(token.split('BBSS')[1]))
      }
    }
    if (token && !localStorage.getItem('token')) {
      localStorage.setItem('token', token)
    }
    if (token) {
      config.headers['token'] = token
    }

    if (config.formData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }
    //头部参数
    if (config.header) {
      config.headers = {
        ...config.headers,
        ...config.header,
      }
    }

    return config
  }
  interceptRequestFail(error) {
    return Promise.reject(error)
  }
  interceptResponseSuccess(response) {
    if (response.config.getParams) {
      return response
    }
    if (response.data.statusCode !== 200 && response.data.message && !response.config.noMsg) {
      Message.error(response.data.message)
    }
    return response.data
  }
  interceptResponseFail(error) {
    if (error.response?.status === 401) {
      //登录信息已过期 重新登录
      localStorage.removeItem('token')
      localStorage.removeItem('THPMSCookie')
      Message.error('登录信息已过期，重新登录！')
      if (window.__POWERED_BY_QIANKUN__) {
        // 乾坤
        window.$goLogin()
        return
      }
    } else {
      Message.error(`请求失败: ${error.response?.status || '系统错误'}`)
    }
    //throw new Error(error)
    console.log(error.toString())
    return Promise.reject(error)
  }
}
export default Http
