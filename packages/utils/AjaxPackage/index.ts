// AjaxPackage 工具包入口文件

// 基础功能导出
import { createAxiosInstance, defaultAxiosInstance, baseAxios } from './axios.js'
import { HttpRequest, http } from './http.js'
import VueAxiosPlugin, { createHttpService, getHttpService } from './netseriver.js'

// 导出所有功能
export {
  // axios相关
  createAxiosInstance,
  defaultAxiosInstance,
  baseAxios,

  // http请求类
  HttpRequest,
  http,

  // 服务创建和插件
  createHttpService,
  getHttpService,
  VueAxiosPlugin
}

// 默认导出插件
export default getHttpService
