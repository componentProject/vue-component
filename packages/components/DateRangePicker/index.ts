import DateRangePicker from './src/index.vue'
import { withInstall } from '@moluoxixi/components/_utils'

// 导出组件
export default DateRangePicker

// 用于Vue插件形式注册（改为使用 withInstall）
export const install = withInstall(DateRangePicker)
