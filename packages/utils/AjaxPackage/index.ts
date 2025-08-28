// AjaxPackage 工具包入口文件
// 基础功能导出
import { baseAxios, createAxiosInstance, defaultAxiosInstance } from './axios.js'
import { http, HttpRequest } from './http.js'
import VueAxiosPlugin, { createHttpService, getHttpService } from './netseriver.js'

// 导出所有功能
export {
  baseAxios,
  // axios相关
  createAxiosInstance,
  // 服务创建和插件
  createHttpService,

  defaultAxiosInstance,
  getHttpService,

  http,
  // http请求类
  HttpRequest,
  VueAxiosPlugin,
}

// 默认导出插件
export default getHttpService
