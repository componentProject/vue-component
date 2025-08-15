import zhCN from './zh-CN.ts'
import enUS from './en-US.ts'
import type { CalendarType } from './interface.ts'

const allLocales: Record<string, CalendarType> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export default allLocales
