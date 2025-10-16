//#region 从远程服务器加载资源并替换
// import fs from 'node:fs/promises'
// import path from 'node:path'
import { getDownLoadByIds, getList } from '@moluoxixi/utils/_api'
import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob(`../../packages/components/moluoxixi/packages/**/index.*`, {
  query: '?raw',
  eager: false,
})

/**
 * 用来注册所有组件
 * @param app
 * @param Vue
 * @param vueShared
 * @param moduleType
 * @param isLongRange
 */
export async function registerAllComponent(app, Vue, vueShared, moduleType: string = 'umd', isLongRange = true) {
  const allComponentList = await getList()
  console.log('allComponentList', allComponentList)
  allComponentList.forEach((item) => {
    const loadingComponent = {
      name: 'AsyncLoading',
      setup() {
        return () => h('div', { style: { padding: '8px', color: '#999' } }, '加载中...')
      },
    }
    const errorComponent = {
      name: 'AsyncError',
      props: { error: Object },
      setup() {
        return () => h('div', { style: { padding: '8px', color: '#c00' } }, `${item.componentCode}组件加载报错，请联系开发人员`)
      },
    }
    app.component(item.componentCode, defineAsyncComponent({
      async loader() {
        const component = await loadRemoteComponent(Vue, vueShared, item.componentCode, allComponentList, moduleType, isLongRange)
        return component.default || component
      },
      loadingComponent,
      errorComponent,
    }))
  })
}

/**
 * 根据组件名获取文件内容
 * @param componentName 组件名称
 * @param moduleType
 * @returns 文件内容字符串
 */
export async function fetchFileContent(componentName: string, moduleType: string = 'umd'): Promise<string> {
  try {
    // 从glob中找到对应的模块
    const moduleKey = Object.keys(modules).find(key =>
      key.includes(`/packages/components/moluoxixi/packages/${componentName}/${moduleType}/index.`),
    )
    if (!moduleKey) {
      console.error(`找不到组件 ${componentName} 的模块文件`)
    }

    // 动态导入模块
    const module = await modules[moduleKey]()
    const content = module.default || module
    // console.log('content', content)
    console.log(`成功加载组件 ${componentName} 的文件内容,大小为${(content?.length / 1024 / 1024).toFixed(2)}M`)
    return content
  }
  catch (error) {
    console.error(`获取组件 ${componentName} 文件内容失败:`, error)
    throw error
  }
}

function getiifeComponent(Vue: any, vueShared: any, componentCode: string, componentName: string) {
  // eslint-disable-next-line no-new-func
  return new Function(
    'Vue',
    'vueShared',
    `return function(){${componentCode} return ${componentName}}`,
  )(Vue, vueShared)()
}

function getumdComponent(Vue: any, vueShared: any, _componentCode: string, componentName: string, componentMapping: Record<string, any> = {}) {
  const componentCode = _componentCode.replace('this', '_this')
  componentMapping.Vue = Vue
  componentMapping.vueShared = vueShared
  // eslint-disable-next-line no-new-func
  new Function(
    '_this',
    'globalThis',
    componentCode,
  )(componentMapping)
  return componentMapping[componentName]
}
/**
 * 加载远程组件
 * @param Vue
 * @param vueShared
 * @param componentName 当前要加载的组件
 * @param allComponentList
 * @param moduleType
 * @param isLongRange
 */
export async function loadRemoteComponent(Vue: any, vueShared: any, componentName: string, allComponentList: any[], moduleType: string = 'umd', isLongRange = true) {
  let componentDownList
  if (!isLongRange) {
    componentDownList = await getDownLoadByIds(allComponentList.filter((item: any) => componentName == item.componentCode).map((i: any) => i.id))
  }
  else {
    // 使用 Promise.all 来正确处理异步操作
    const component = allComponentList.find(i => i.componentCode === componentName)
    if (component) {
      const content = await fetchFileContent(componentName, moduleType)
      componentDownList = [{
        ...component,
        name: component.componentCode,
        content,
      }]
    }
  }
  const componentCode = componentDownList[0].content
  if (moduleType === 'iife') {
    return getiifeComponent(Vue, vueShared, componentCode, componentName)
  }
  else if (moduleType === 'umd') {
    return getumdComponent(Vue, vueShared, componentCode, componentName)
  }
}
