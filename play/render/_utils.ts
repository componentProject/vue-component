//#region 从远程服务器加载资源并替换
// import fs from 'node:fs/promises'
// import path from 'node:path'
import { getDownLoadByIds, getList } from './src/api/index.ts'
import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'
import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob('../../packages/components/moluoxixi/packages/*/iife/index.js', {
  query: '?raw',
  eager: false,
})

/**
 * 用来注册所有组件
 * @param app
 * @param Vue
 * @param vueShared
 */
export async function registerAllComponent(app, Vue, vueShared) {
  const listRes = await getList({
    productCode: 'webFile_his',
    vue: [COMPONENT_SETTING_TYPE],
  })
  const allComponentList = listRes[COMPONENT_SETTING_TYPE]
  console.log('allComponentList', allComponentList)
  allComponentList.forEach((item) => {
    app.component(item.componentCode, defineAsyncComponent({
      async loader() {
        return loadRemoteComponent(Vue, vueShared, item.componentCode, allComponentList)
      },
    }))
  })
}

/**
 * 根据组件名获取文件内容
 * @param componentName 组件名称
 * @returns 文件内容字符串
 */
export async function fetchFileContent(componentName: string): Promise<string> {
  try {
    // 从glob中找到对应的模块
    const moduleKey = Object.keys(modules).find(key =>
      key.includes(`/packages/components/moluoxixi/packages/${componentName}/iife/index.js`),
    )
    if (!moduleKey) {
      throw new Error(`找不到组件 ${componentName} 的模块文件`)
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

/**
 * 加载远程组件
 * @param Vue
 * @param vueShared
 * @param componentName 当前要加载的组件
 * @param allComponentList
 * @param isLongRange
 */
export async function loadRemoteComponent(Vue: any, vueShared: any, componentName: string, allComponentList: any[], isLongRange = true) {
  let componentDownList
  if (!isLongRange) {
    componentDownList = await getDownLoadByIds(allComponentList.filter((item: any) => componentName == item.componentCode).map((i: any) => i.id))
  }
  else {
    // 使用 Promise.all 来正确处理异步操作
    const component = allComponentList.find(i => i.componentCode === componentName)
    if (component) {
      const content = await fetchFileContent(componentName)
      componentDownList = [{
        ...component,
        name: component.componentCode,
        content,
      }]
    }
  }
  const componentCode = componentDownList[0].content
  // eslint-disable-next-line no-new-func
  const component = new Function(
    'Vue',
    'vueShared',
    `return function(){${componentCode} return ${componentName}}`,
  )(Vue, vueShared)
  return component().default
}
