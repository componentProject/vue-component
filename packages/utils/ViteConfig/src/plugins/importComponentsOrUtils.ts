import type { Plugin } from 'vite'
import { createVirtualPlugin } from './utils/virtual.ts'
import { getList } from '../../../_api/index.ts'
import { loadCodeStr } from '../../../../../play/render/utils.ts'
import * as Vue from 'vue'

export interface ImportComponentsOrUtilsOptions {
  /** 虚拟模块 id，默认 'virtual:remote' */
  virtualModuleId?: string
  /** 类型声明输出路径或开关，默认开启，输出到 src/typings/virtual-module.d.ts */
  dts?: string | boolean
  /** 可选的文件监听通配，透传给工厂（通常不需要） */
  watch?: string | string[]
}
/**
 * 远程代码虚拟模块插件（严格内置远程拉取与缓存，不接受外部传入代码）。
 * 使用：import { date } from 'virtual:remote/date'
 */
export default function importComponentsOrUtils(options: ImportComponentsOrUtilsOptions = {}): Plugin {
  const virtualModuleId = options.virtualModuleId || 'virtual:remote'

  const normalizeRequestName = (id: string): string | null => {
    if (id === virtualModuleId)
      return null
    if (!id.startsWith(`${virtualModuleId}/`))
      return null
    const raw = id.slice(virtualModuleId.length + 1)
    return raw.split('?')[0]
  }

  async function getComponentCode(name: string): Promise<string> {
    try {
      const listRes = await getList({
        productCode: 'webFile_his',
        vue: ['Vue3'],
      })
      const params = listRes.Vue3.filter((item: any) => name === item.componentCode).map((i: any) => i.id)
      if (!params || params.length === 0) {
        throw new Error(`未找到组件${name}`)
      }
      const componentDownList = await loadCodeStr(Vue, listRes.Vue3, [name])
      const rawCode = componentDownList[name]
      if (!rawCode)
        throw new Error(`未获取到组件${name}的代码`)

      const codeJson = JSON.stringify(String(rawCode))
      const componentCode = `
        import * as Vue from 'vue';
        const componentMapping = {Vue};
        const __code = ${codeJson};
        const __res = new Function('Vue', 'process', 'componentMapping', __code)(Vue, { env: { NODE_ENV: 'production' } }, componentMapping);
        const __default = __res && (__res.__esModule ? __res.default : __res.default);
        export default __default;
      `
      return componentCode
    }
    catch (error) {
      const errorString = String(error)
      return `
       const error = "${errorString}"
       console.error(error)
       export default error
      `
    }
  }

  return createVirtualPlugin(
    {
      name: 'vite-plugin-import-components-or-utils',
      virtualModuleId,
      dts: options.dts,
      watch: options.watch,
      typeContent: `declare module '${virtualModuleId}/*' {\n  const anyModule: any\n  export default anyModule\n}`,
    },
    async ({ id }): Promise<string> => {
      const name = normalizeRequestName(id)

      if (name) {
        // 读取或拉取代码
        return await getComponentCode(name)
      }
      else {
        return `
          const error = "不存在该文件"
          console.error(error)
          export default error
        `
      }
    },
  )
}
