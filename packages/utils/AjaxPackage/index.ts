import BaseHttpClient from './BaseHttpClient.ts'
// AjaxPackage 工具包入口文件
// 基础功能导出
import BaseApi from './class.ts'
import VueAxiosPlugin, { createHttpService, getHttpService } from './netseriver.ts'

// 导出所有功能
export {
  BaseApi,
  BaseHttpClient,
  // 服务创建和插件
  createHttpService,
  getHttpService,
  VueAxiosPlugin,
}

// 默认导出插件
export default getHttpService
