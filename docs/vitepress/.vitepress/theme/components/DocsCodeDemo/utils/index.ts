import { utoa } from './utils.ts'

const MAIN_FILE_NAME = 'App.vue'
// 导出一个函数，用于获取编码后的playground
// 解码source
export function getPlaygroundEncoded(source: string) {
  const code = decodeURIComponent(source)
  const originCode = {
    [MAIN_FILE_NAME]: code,
  }
  return utoa(JSON.stringify(originCode))
}
