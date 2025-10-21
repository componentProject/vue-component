import { getDownLoadByIds } from '@moluoxixi/utils/_api'
import { idbStorage } from '@moluoxixi/utils/_utils/indexdb.ts'
import { getesComponent } from './esmodule.ts'
import * as vueShared from '@vue/shared'

async function getComponentByFile(allComponentList: any[], componentName: string, moduleType: string = 'umd') {
  // 使用 Promise.all 来正确处理异步操作
  const component = allComponentList.find(i => i.componentCode === componentName)
  if (component) {
    const content = await fetchFileContent(componentName, moduleType)
    return [{
      ...component,
      name: component.componentCode,
      content,
    }]
  }
}

/**
 * 根据组件名获取文件内容
 * @param componentName 组件名称
 * @param moduleType
 * @returns 文件内容字符串
 */
export async function fetchFileContent(componentName: string, moduleType: string = 'umd'): Promise<string> {
  try {
    const modules = import.meta.glob(`../../../../packages/components/moluoxixi/packages/**/index.*`, {
      query: '?raw',
      eager: false,
    })
    // 从glob中找到对应的模块
    const moduleKey = Object.keys(modules).find(key =>
      key.includes(`/moluoxixi/packages/${componentName}/${moduleType}/index.`),
    )
    if (!moduleKey) {
      console.error(`找不到组件 ${componentName} 的模块文件`)
    }

    // 动态导入模块
    const module = await modules[moduleKey]()
    const content = module.default || module
    console.log(`成功加载组件 ${componentName} 的文件内容,大小为${(content?.length / 1024 / 1024).toFixed(2)}M`)
    return content
  }
  catch (error) {
    console.error(`获取组件 ${componentName} 文件内容失败:`, error)
    throw error
  }
}

//#region 应该与壳子一致的内容
function isString(componentItemKey: any) {
  if (typeof componentItemKey !== 'string') {
    console.log('componentItemKey must be string')
  }
}
/**
 * 判断Vue实例的版本,根据版本不同添加组件（vue2/vue3组件名可能是一样的）
 * @param Vue Vue实例
 * @returns Vue版本字符串 'vue2' 或 'vue3'
 */
function getVueVersion(Vue: any): 'vue2' | 'vue3' {
  // Vue 3.x 有 createApp 方法
  if (Vue && typeof Vue.createApp === 'function') {
    return 'vue3'
  }
  // Vue 2.x 有 version 属性且以 '2.' 开头
  else if (Vue && Vue.version && Vue.version.startsWith('2.')) {
    return 'vue2'
  }
  // 默认返回vue2
  return 'vue2'
}
/**
 * 用来注册所有组件
 * @param Vue
 * @param app
 * @param type
 * @param isLongRange
 * @param moduleType
 */
export async function registerAllComponent(Vue: any, app: any, type?: string, isLongRange = false, moduleType: string = 'umd') {
  const vueVersion = getVueVersion(Vue)
  const componentItemKey = type ?? (vueVersion === 'vue2' ? 'Vue2' : 'Vue3')
  const allComponentListStr = await idbStorage.getItem(componentItemKey)
  isString(componentItemKey)
  const allComponentList: any[] = JSON.parse(allComponentListStr)
  allComponentList.forEach((item) => {
    const loadingComponent = {
      name: 'AsyncLoading',
      setup() {
        return () => Vue.h('div', { style: { color: '#999', width: '100%' } }, '加载中...')
      },
    }
    const errorComponent = {
      name: 'AsyncError',
      props: { error: Object },
      setup() {
        return () => Vue.h('div', { style: { color: '#c00', width: '100%' } }, `${item.componentCode}组件加载报错，请联系开发人员`)
      },
    }
    app.component(item.componentCode, Vue.defineAsyncComponent({
      async loader() {
        const component = await loadRemoteComponent(Vue, item.componentCode, allComponentList, moduleType, isLongRange)
        return component.default || component
      },
      loadingComponent,
      errorComponent,
    }))
  })
}

function getiifeComponent(Vue: any, vueShared: any, componentCode: string, componentName: string) {
  // eslint-disable-next-line no-new-func
  return new Function(
    'Vue',
    'vueShared',
    `return function(){${componentCode} return ${componentName}}`,
  )(Vue, vueShared)()
}

function getumdComponent(Vue: any, vueShared: any, componentCode: string, componentName: string, componentMapping: Record<string, any> = {}) {
  componentMapping.Vue = Vue
  componentMapping.vueShared = vueShared

  // 正则表达式：匹配 define([ ... ]) 中方括号内的所有内容
  const regex = /define\s*\(\s*\[([^\]]*)\]/g

  const matches = [...componentCode.matchAll(regex)]

  // 捕获组 1 包含了方括号内的整个字符串（例如："vue","@vue/shared"）
  const dependencyArrays = matches.map((match) => {
    return match[1].trim()
  })

  console.log(componentName, dependencyArrays)
  // eslint-disable-next-line no-new-func
  new Function(
    '_this',
    'globalThis',
    componentCode.replace('this', '_this'),
  )(componentMapping)
  return componentMapping[componentName]
}
/**
 * 加载远程组件
 * @param Vue
 * @param componentName 当前要加载的组件
 * @param allComponentList
 * @param moduleType
 * @param isLongRange
 */
export async function loadRemoteComponent(Vue: any, componentName: string, allComponentList: any[], moduleType: string = 'umd', isLongRange: boolean = false) {
  let componentDownList: any[]
  if (!isLongRange) {
    componentDownList = await getDownLoadByIds(allComponentList.filter((item: any) => componentName == item.componentCode).map((i: any) => i.id))
  }
  else {
    componentDownList = await getComponentByFile(allComponentList, componentName, moduleType)
  }
  console.log('componentName', componentName)
  const componentCode = componentDownList[0]?.content
  if (moduleType === 'iife') {
    return getiifeComponent(Vue, vueShared, componentCode, componentName)
  }
  else if (moduleType === 'umd') {
    return getumdComponent(Vue, vueShared, componentCode, componentName)
  }
  else if (moduleType === 'es') {
    return getesComponent(Vue, vueShared, componentCode, componentName)
  }
}
export async function load(Vue: any, originComponentNames: string[], type?: string, moduleType?: string, isLongRange?: boolean) {
  const vueVersion = getVueVersion(Vue)
  const componentItemKey = type ?? (vueVersion === 'vue2' ? 'Vue2' : 'Vue3')
  const allComponentListStr = await idbStorage.getItem(componentItemKey)
  isString(componentItemKey)
  const allComponentList = JSON.parse(allComponentListStr)
  const componentNames
    = originComponentNames?.length > 0
      ? originComponentNames
      : allComponentList.map((i: any) => i.componentCode)
  const componentResults: Record<string, any> = {}
  for (const componentName of componentNames) {
    const componentResult = await loadRemoteComponent(Vue, componentName, allComponentList, moduleType, isLongRange)
    componentResults[componentName] = componentResult.default || componentResult
  }
  return componentResults
}
//#endregion
