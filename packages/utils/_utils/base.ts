import type { App, Component } from 'vue'
import { Fragment } from 'vue'

export function filterEmpty(children = []) {
  const res: any[] = []
  children.forEach((child: any) => {
    if (Array.isArray(child)) {
      res.push(...child)
    }
    else if (child?.type === Fragment) {
      res.push(...filterEmpty(child.children))
    }
    else {
      res.push(child)
    }
  })
  return res
}

/**
 * 获取类型
 * @param obj
 * @param type
 */
export function getType(obj: any, type?: string) {
  if (type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type.toLowerCase()
  }
  else {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }
}

/**
 * 判断str是否是type类型
 * @param str
 * @param type 只支持小写,例如boolean
 * @return
 */
export function isType(str: string, type: string) {
  return Object.prototype.toString.call(str).slice(8, -1).toLowerCase() == type
}

type types
  = | 'string'
    | 'number'
    | 'boolean'
    | 'undefined'
    | 'null'
    | 'date'
    | 'regexp'
    | 'symbol'
    | 'object'
    | 'array'
    | 'function'
    | 'set'
    | 'map'
    | 'weakmap'
    | 'weakset'
    | 'error'

/**
 * 获取类型默认值，当不符合当前类型时，返回该类型的默认值
 * @param obj
 * @param type
 */
export function getTypeDefault(obj: any, type: types) {
  if (getType(obj) !== type) {
    const typeDefefaultValueMap = {
      string: '',
      number: 0,
      boolean: false,
      undefined,
      null: null,
      date: new Date(),
      regexp: /^$/,
      symbol: Symbol(''),
      object: {},
      array: [],
      function: () => {
      },
      set: new Set(),
      map: new Map(),
      weakmap: new WeakMap(),
      weakset: new WeakSet(),
      error: new Error('错误'),
    }
    return typeDefefaultValueMap[type]
  }
  else {
    return obj
  }
}

/**
 * 获取JSON化后的对象
 * @param obj
 */
export function getStringObj(obj: any) {
  const allowTypes = ['object', 'array']
  if (allowTypes.some(type => getType(obj, type))) {
    return JSON.stringify(obj)
  }
  return obj
}

/**
 * 获取类名字符串
 * @param className
 * @param hasPrefix
 */
export function getClass(className: string, hasPrefix?: boolean) {
  if (className.startsWith('.')) {
    return hasPrefix ? className : className.slice(1)
  }
  else {
    return hasPrefix ? `.${className}` : className
  }
}

/**
 * 为传入的组件注入 install 方法，按组件的 name 自动完成全局注册。
 *
 * 用法示例：
 * ```ts
 * import EditorComp from './src/index.vue'
 * import { withInstall } from '@moluoxixi/components/_utils'
 * export default withInstall(EditorComp)
 * ```
 */
export type WithInstall<T extends Component> = T & {
  install: (app: App, options?: unknown) => void
}

export function withInstall<T extends Component>(component: T): WithInstall<T> {
  (component as any).install = (app: App, _options?: unknown) => {
    const name: string | undefined = (component as any)?.name
    if (!name) {
      console.warn('[withInstall] 组件缺少 name，已跳过注册。')
    }
    else {
      console.log('🚀 注册组件:', component.name)
      app.component(name, component as any)
    }
  }
  return component as WithInstall<T>
}
