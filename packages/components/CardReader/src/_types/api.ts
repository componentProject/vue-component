/**
 * 字典详情查询参数类型
 */
export interface cardReaderDictDetailParamsType {
  /** 字典编码 */
  dictCode: string
  /** 搜索关键字 */
  searchKey?: string
  /** 页码 */
  pageNo?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 字典详情分页响应类型
 */
export interface cardReaderDictDetailResponseType<T = any> {
  /** 状态码 */
  statusCode: number
  /** 消息 */
  message: string
  /** 数据列表 */
  rows: T[]
  /** 总数量 */
  totalCount: number
  /** 每页数量 */
  pageSize: number
  /** 当前页码 */
  pageNo: number
  /** 总页数 */
  pageCount: number
}

/**
 * 操作系统对象类型
 */
export interface cardReaderSystemType {
  /** ID */
  id: string
  /** 基础ID */
  baseId: string
  /** 字典项 */
  dictItem: string
  /** 字典值 */
  dictValue: string
  /** 状态 */
  status: number
  /** 扩展数据1 */
  extData1: any
  /** 扩展数据2 */
  extData2: any
  /** 扩展数据3 */
  extData3: any
}

/**
 * 硬件分类对象类型
 */
export interface cardReaderHardwareClassType {
  /** ID */
  id: string
  /** 基础ID */
  baseId: string
  /** 字典项 */
  dictItem: string
  /** 字典值 */
  dictValue: string
  /** 状态 */
  status: number
  /** 扩展数据1 */
  extData1: any
  /** 扩展数据2 */
  extData2: any
  /** 扩展数据3 */
  extData3: any
}

/**
 * 插件查询参数类型
 */
export interface cardReaderPluginParamsType {
  /** 页码 */
  pageNo?: number
  /** 每页数量 */
  pageSize?: number
  /** 公司 */
  company?: string
  /** 型号 */
  model?: string
  /** 操作系统类型 */
  osType?: string
  /** 插件类型 */
  pluginType: string
  /** 搜索关键字 */
  searchKey?: string
}

/**
 * CommonSdk 调用参数类型
 */
export interface cardReaderCommonSdkParamsType extends Partial<cardReaderPluginType> {
  /** 插件类型 */
  pluginType: string
}

/**
 * 插件对象类型
 */
export interface cardReaderPluginType {
  /** 调用的方法名称 */
  funName: string
  /** ID */
  id: string
  /** 插件名称 */
  pluginName: string
  /** 编码 */
  code: string
  /** 版本 */
  version: string
  /** 操作系统类型列表 */
  osTypes: number[]
  /** 插件类型 */
  pluginType: string
  /** IO类型 */
  ioType: string
  /** 公司 */
  company: string
  /** 型号 */
  model: string
  /** 图片路径 */
  imgPath: string
  /** ZIP路径 */
  zipPath: string
  /** ZIP大小 */
  zipSize: string
  /** 扩展参数 */
  extParam: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  createdTime: string
  /** 创建人 */
  createdName: string
  /** 更新时间 */
  updatedTime: string
  /** 更新人 */
  updatedName: string
}
