import ReForm from './src/index.vue'
import useForm from './src/_utils/useForm'
import { withInstall } from '@moluoxixi/utils/_utils/base'

// 更新类型导入路径
export * from './src/_types'

export { useForm }

export const ReFormComponent = withInstall(ReForm)

export default ReFormComponent
