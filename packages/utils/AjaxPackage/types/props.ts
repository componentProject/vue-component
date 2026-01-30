/**
 * SystemErrorDialog 组件的 Props 类型定义
 */
export interface SystemErrorDialogPropsType {
  /** 对话框标题 */
  title?: string
  /** 对话框宽度 */
  width?: number | string
  /** 用户名 */
  userName?: string
  /** 用户ID */
  userId?: string
  /** 科室名称 */
  deptName?: string
  /** 科室ID */
  deptId?: string
  /** 客户端IP地址 */
  clientIp?: string
  /** 请求URL路径 */
  requestUrl?: string
  /** 链路追踪ID */
  traceId?: string
  /** 错误消息 */
  errorMessage?: string
  /** 错误代码 */
  errorCode?: number | string
  /** 本地服务是否启用 */
  isStart?: boolean
  /** 菜单名称 */
  menuName?: string
}
