import EnterNextTable from './src/index.vue'
import { withInstall } from '@moluoxixi/components/_utils'

// 导出组件
export default EnterNextTable

// 用于Vue插件形式注册（改为使用 withInstall）
export const install = withInstall(EnterNextTable)
