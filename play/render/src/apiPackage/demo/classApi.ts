import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-05-09 08:53:16
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-05-09 09:06:54
 * @FilePath: \vue-template\src\api\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import axios from 'axios'
import { addSign } from '@/utils/index.js'
import { useUserStore } from '@/stores/modules/user.js'
import { ElMessage, ElNotification } from 'element-plus'

const store = useUserStore()

interface errorOrTips {
  code: number
  message: string
}
export default class BaseApi {
  protected baseURL: string
  instance: ReturnType<typeof axios.create>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.instance = axios.create({ baseURL: this.baseURL })
    this.setupInterceptors()
  }

  processRequestConfig(config: InternalAxiosRequestConfig) {
    return config
  }

  processResponseConfig(data: AxiosResponse['data']) {
    return data
  }

  async processResponseError(error: AxiosError): Promise<AxiosError> {
    return error
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        this.processRequestConfig(config)
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        if (res.status !== 200) {
          return Promise.reject(new Error(res.data?.message || 'Error'))
        }
        else {
          return this.processResponseConfig(res.data)
        }
      },
      async (error: AxiosError) => {
        await this.processResponseError(error)
        ElMessage.error({
          message: error.response?.data as string || '',
          duration: 5 * 1000,
        })
        return Promise.reject(error)
      },
    )
  }

  protected async request<R>(config: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.instance.request<R>(config)
  }

  public async get<R>(url: string, params?: any, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.request<R>({ ...config, url, method: 'get', data, params })
  }

  public post<R>(url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.request<R>({ ...config, url, method: 'post', data, params })
  }

  public delete<R>(url: string, params?: any, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.request<R>({ ...config, url, method: 'delete', data, params })
  }

  public put<R>(url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.request<R>({ ...config, url, method: 'put', data, params })
  }
}

export class ServerApi extends BaseApi {
  constructor(baseURL: string) {
    super(baseURL || import.meta.env.VITE_APP)
  }

  processRequestConfig(config: InternalAxiosRequestConfig & { file?: boolean }) {
    if (store.getToken()) {
      config.headers.token = store.getToken()
    }
    if (config.file) {
      config.headers['Content-Type'] = 'multipart/form-data;'
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
  }

  processResponseConfig(data: AxiosResponse['data']) {
    const code = data.Code || data.statusCode
    if (code != 200) {
      ElMessage({
        message: data.Message || data.message,
        type: 'error',
      })
      return Promise.reject(new Error(data.Message || data.message || 'Error'))
    }
    else if (data.data?.errors?.length) {
      let html = ``
      data.data.errors.forEach((item: errorOrTips) => {
        html += `<div style="font-size: 14px;color:red">${item.code}：${item.message}</div>`
      })
      ElNotification({
        title: '提示',
        type: 'error',
        dangerouslyUseHTMLString: true,
        duration: 10000,
        message: html,
      })
      return Promise.reject(new Error(data.data?.errors || 'Error'))
    }
    else if (data?.data?.tipss?.length) {
      let html = ``
      data.data.tipss.forEach((item: errorOrTips) => {
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
    return {
      ...data,
      Code: code,
    } // 返回响应数据
  }

  async processResponseError(error: AxiosError): Promise<AxiosError> {
    // 对响应错误做点什么
    if (error.response?.status === 401) {
      await store.userLogin()
    }
    return error
  }
}
