/** 导入组件安装工具函数 */
import { withInstall } from '@moluoxixi/utils/utils'
/** 导入 useForm 组合式函数 */
import useForm from './src/utils/useForm'
/** 导入 ReForm 主组件 */
import ReForm from './src/index.vue'

/** 更新类型导入路径 - 导出所有类型定义 */
export * from './src/types'

/** 导出 useForm 组合式函数供外部使用 */
export { useForm }

/** 使用 withInstall 包装 ReForm 组件，使其支持全局安装 */
export const ReFormComponent = withInstall(ReForm)

/** 默认导出安装后的 ReForm 组件 */
export default ReFormComponent
