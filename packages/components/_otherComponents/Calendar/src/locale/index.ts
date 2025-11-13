import type { CalendarType } from './interface.ts'
import enUS from './en-US.ts'
import zhCN from './zh-CN.ts'

const allLocales: Record<string, CalendarType> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export default allLocales
