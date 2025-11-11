import { defaultAxiosInstance } from './axios.js'
/**
 * HTTP请求封装类，提供常用的HTTP方法
 */
class HttpRequest {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {object} [params] - 查询参数
   * @param {object} [config] - axios配置
   * @returns {Promise} 请求结果
   */
  async get(url, params = {}, config = {}) {
    try {
      const response = await this.axiosInstance.get(url, { params, ...config })
      return response.data
    }
    catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {object} [params] - 请求参数
   * @param {object} [config] - axios配置
   * @returns {Promise} 请求结果
   * @returns {Promise} 请求结果
   */
  async post(url, params = {}, config = {}, addSign) {
    try {
    // 创建一个新的配置对象，避免修改原始配置
      const requestConfig = { ...config }
      // 如果提供了addSign参数，在请求前应用签名
      if (typeof addSign === 'function') {
        try {
        // 确保headers存在
          if (!requestConfig.headers) {
            requestConfig.headers = {}
          }
          // 应用签名函数
          addSign(requestConfig)
          console.log('addSign已应用到请求:', requestConfig)
        }
        catch (error) {
          console.error('执行addSign时出错:', error)
        // 即使addSign执行失败也继续请求，避免阻断业务流程
        }
      }

      const response = await this.axiosInstance.post(url, params, requestConfig)
      return response.data
    }
    catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {object} [params] - 请求参数
   * @param {object} [config] - axios配置
   * @returns {Promise} 请求结果
   */
  async put(url, params = {}, config = {}) {
    try {
      const response = await this.axiosInstance.put(url, params, config)
      return response.data
    }
    catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {object} [params] - 请求参数
   * @param {object} [config] - axios配置
   * @returns {Promise} 请求结果
   */
  async delete(url, params = {}, config = {}) {
    try {
      const response = await this.axiosInstance.delete(url, {
        params,
        ...config,
      })
      return response.data
    }
    catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 文件上传请求
   * @param {string} url - 请求URL
   * @param {FormData} formData - 表单数据
   * @param {object} [config] - axios配置
   * @returns {Promise} 请求结果
   */
  async upload(url, formData, config = {}) {
    try {
      const response = await this.axiosInstance.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      })
      return response.data
    }
    catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 批量请求
   * @param {Array} requests - 请求数组
   * @returns {Promise} 所有请求结果
   */
  async all(requests) {
    try {
      const responses = await Promise.all(requests)
      return responses.map(response => response.data)
    }
    catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 错误处理
   * @param {Error} error - 错误对象
   * @returns {Error} 处理后的错误
   */
  handleError(error) {
    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response
      const message = data?.Message || data?.message || error.message
      return new Error(`HTTP ${status}: ${message}`)
    }
    else if (error.request) {
      // 请求已发出但没有响应
      return new Error('网络错误：无法连接到服务器')
    }
    else {
      // 其他错误
      return new Error(error.message || '请求配置错误')
    }
  }
}

// 创建默认实例
export const http = new HttpRequest(defaultAxiosInstance)

// 导出类供自定义使用
export { HttpRequest }

export default http
