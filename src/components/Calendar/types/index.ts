import { Dayjs } from 'dayjs'

export  interface propsType {
  /**
   * 默认展示的日期
   * */
  modelValue?: number | Date | Dayjs,
  style?: object,
  className?: string | string[],
  /**
   * 国际化相关
   * */
  locale?: 'zh-CN' | 'en-US'
}
