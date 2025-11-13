// VxeGrid的log组件
import { VxeUI } from '@vxe-ui/core'

const { log } = VxeUI
const v = '4.7.94'
const version = `table v${v}`

export const warnLog = log.create('warn', version)
export const errLog = log.create('error', version)
