/**
 * SubMenu 组件的路由元信息类型
 */
export interface subMenuRouteMetaType {
  title?: string
  [key: string]: unknown
}

/**
 * SubMenu 组件的数据节点类型
 */
export interface subMenuRouteType {
  path?: string
  name?: string
  meta?: subMenuRouteMetaType
  children?: subMenuRouteType[]
}

/**
 * SubMenu 组件的 Props 类型定义
 */
export interface propsType {
  routes: subMenuRouteType[]
  menuHeight: number
}
