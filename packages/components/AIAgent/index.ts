// AIAgent入口文件
import AIAgent from './src/index.vue'
import { withInstall } from '@moluoxixi/utils/_utils'
// 直接导入样式文件
export * from './src/components'
export { EmrUtils } from './src/components'

export default withInstall(AIAgent)
