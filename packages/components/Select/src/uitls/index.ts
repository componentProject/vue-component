// 定义类型
interface ServerMap {
  [key: string]: string
}

interface RequestHandlerOptions {
  serverMap?: ServerMap
  requestHandler?: RequestHandlerFunction | null
}

type RequestHandlerFunction = (url: string, params: Record<string, any>) => Promise<any[]>

// 默认服务配置
const defaultServerMap: ServerMap = {
  // 通用字典
  base: '/ts-pfs-cis-ipt/queryCommonDictDetail',
}

// 全局服务配置存储
let globalServerMap: ServerMap = { ...defaultServerMap }
let globalRequestHandler: RequestHandlerFunction | null = null

// 配置方法
export function configureServerOptions(options: RequestHandlerOptions = {}) {
  const { serverMap = {}, requestHandler = null } = options

  // 合并服务配置
  globalServerMap = {
    ...defaultServerMap,
    ...serverMap,
  }

  // 设置请求处理器
  if (typeof requestHandler === 'function') {
    globalRequestHandler = requestHandler
  }
}

// 默认请求处理函数
async function defaultRequestHandler(): Promise<any[]> {
  return []
}

// 参数处理函数
function paramsHandle(optionsParams: Record<string, any>): Record<string, any> {
  return {
    isDelete: 'N',
    ...optionsParams,
  }
}

// 获取服务选项
export default async function getServerOptions(
  serverType: string,
  optionsParams: Record<string, any> = {},
): Promise<any[]> {
  // 获取URL
  const url = globalServerMap[serverType] || defaultServerMap[serverType]

  // 如果没有找到URL，返回空数组
  if (!url) {
    console.warn(`未找到服务类型: ${serverType}`)
    return []
  }

  // 处理参数
  const params = paramsHandle(optionsParams)

  // 使用请求处理器
  const handler = globalRequestHandler || defaultRequestHandler
  return handler(url, params)
}
