import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
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
import { ElMessage } from 'element-plus'

export default class BaseApi {
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
        config.data = {
          ...config.data,
        }
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
          const data = res.data
          if (data.Code != 200) {
            ElMessage({
              message: data.Message || data.message,
              type: 'error',
            })
          }
          else {
            return data // 返回响应数据
          }
        }
      },
      async (error: AxiosError) => {
        // 登录失败做点啥
        if (error.response?.status === 401) {
          return
        }
        ElMessage.error({
          message: error.response?.data as string || '',
          duration: 5 * 1000,
        })
        return Promise.reject(error)
      },
    )
  }

  protected async request<R>(config: AxiosRequestConfig): Promise<R> {
    const response = await this.instance.request<R>(config)
    return response.data
  }

  public get<R>(url: string, params?: any, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'get', data, params })
  }

  public post<R>(url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'post', data, params })
  }

  public delete<R>(url: string, params?: any, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'delete', data, params })
  }

  public put<R>(url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<R> {
    return this.request<R>({ ...config, url, method: 'put', data, params })
  }
}
