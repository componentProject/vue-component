/** 修改为与grid布局默认span值一致 - 默认表单栅格响应式值 */
export const DEFAULT_FORM_GRID_RESPONSIVE = 24
/** 默认表单栅格响应式断点配置 */
export const DEFAULT_FORM_GRID_RESPONSIVE_ITEMS = {
  /** 超小屏幕 */
  xs: '<768px',
  /** 小屏幕 */
  sm: '>=768px',
  /** 中等屏幕 */
  md: '>=992px',
  /** 大屏幕 */
  lg: '>=1200px',
  /** 超大屏幕 */
  xl: '>=1920px',
}

/** 自定义媒体类型正则表达式 */
export const CUSTOM_MEDIA_TYPE_REGEX = /^_(\d)+px$/
/** 媒体规则正则表达式 */
export const MEDIA_RULE_REGEX = /^(>|>=|<|<=)(\d+)(px)?$/
/** 默认自定义媒体类型 */
export const DEFAULT_CUSTOM_MEDIA_TYPE = '>='
