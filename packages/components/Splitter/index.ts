import Splitter from './src/index.vue'
import { withInstall } from '@moluoxixi/components/_utils'

export * from './src/types'

// 导出组件
export default Splitter

// 用于Vue插件形式注册（改为使用 withInstall）
export const install = withInstall(Splitter)
