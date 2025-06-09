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
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export class BaseApi {
  protected baseURL: string
  instance: ReturnType<typeof axios.create>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.instance = axios.create({ baseURL: this.baseURL })
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做点什么
        const { data } = response
        if (data.code === 200) {
          return data.data
        }
        return Promise.reject(new Error(data.message || '请求失败'))
      },
      (error: AxiosError) => {
        // 对响应错误做点什么
        if (error.response?.status === 401) {
          // 处理未授权
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      },
    )
  }

  protected async request<R>(config: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.request<R>(config)
    return response.data
  }

  public get<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'get' })
  }

  public post<R>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'post', data })
  }

  public delete<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'delete' })
  }

  public put<R>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'put', data })
  }
}

export class UserApi extends BaseApi {
  constructor() {
    super('/api/users')
  }
}

const userService = new UserApi()
export const userRequest = userService.instance
