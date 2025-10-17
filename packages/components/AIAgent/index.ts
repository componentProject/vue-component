import AIAgent from './src/index.vue'
import { withInstall } from '@moluoxixi/utils/_utils/base'
// 直接导入样式文件
export * from './src/components'
export { EmrUtils } from './src/components'

export default withInstall(AIAgent)
