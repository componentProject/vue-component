/**
 * 默认表单栅格列数
 * 与 grid 布局默认 span 值保持一致，用于无匹配或缺省时的回落。
 */
export const DEFAULT_FORM_GRID_RESPONSIVE = 24
/**
 * 预设断点对应的媒体表达式
 * 说明：用于把 xs/sm/md/lg/xl 映射为规范的媒体查询字符串。
 */
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

/** 自定义媒体类型正则（形如 _1400px） */
export const CUSTOM_MEDIA_TYPE_REGEX = /^_(\d)+px$/
/** 媒体规则正则（比较符 + 像素值）：>, >=, <, <= + 数字 + 可选px */
export const MEDIA_RULE_REGEX = /^(>|>=|<|<=)(\d+)(px)?$/
/** 默认比较符（当使用下划线自定义键时的替换符号） */
export const DEFAULT_CUSTOM_MEDIA_TYPE = '>='
