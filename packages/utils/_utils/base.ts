// base.ts文件
import type { App, Component } from 'vue'
import { Fragment } from 'vue'
/** 简单延迟函数，用于缓冲时间 */
export function sleep(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
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
  return Object.prototype.toString.call(str).slice(8, -1).toLowerCase() === type
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

export function buildTree(list: any[], rowKey: string = 'id', parentKey: string = 'parentId', childrenKey: string = 'children') {
  const idToNodeMap = new Map<any, any>()
  const roots: any[] = []
  // 克隆并初始化 children
  for (const item of list) {
    const clone = { ...item }
    clone[childrenKey] = []
    idToNodeMap.set(clone[rowKey], clone)
  }
  for (const item of list) {
    const id = item[rowKey]
    const parentId = item[parentKey]
    const node = idToNodeMap.get(id)
    if (!parentId || !idToNodeMap.has(parentId)) {
      roots.push(node)
    }
    else {
      idToNodeMap.get(parentId)[childrenKey].push(node)
    }
  }
  return roots
}

/**
 * 将树形结构展平成一维数组。
 * - 会去除每项的 children 字段
 * - 为每个子节点补充 parentKey（父节点的 rowKey 值）
 * - 输出顺序为先序遍历，可与 buildTree 配合还原结构
 */
export function flattenTree(tree: any[] | any, rowKey: string = 'id', parentKey: string = 'parentId', childrenKey: string = 'children'): any[] {
  const result: any[] = []
  const nodes: any[] = Array.isArray(tree) ? tree : [tree]
  // 简单的唯一ID生成器（作用域内唯一）
  const base = Date.now().toString(36)
  let autoIdCounter = 0
  const generateAutoId = () => `auto_${base}_${autoIdCounter++}`

  const walk = (node: any, parentId?: any) => {
    if (!node || typeof node !== 'object') {
      return
    }
    const children = node[childrenKey]
    const current: any = { ...node }
    // 若缺少 rowKey，则自动补一个唯一ID
    if (current[rowKey] === undefined || current[rowKey] === null || current[rowKey] === '') {
      current[rowKey] = generateAutoId()
    }
    // 去除 children，避免残留树结构
    if (childrenKey in current) {
      delete current[childrenKey]
    }
    // 设置父标识
    if (parentId === undefined || parentId === null) {
      // 根节点：确保 parentKey 为 undefined，便于 buildTree 识别为根
      if (parentKey in current) {
        current[parentKey] = undefined
      }
    }
    else {
      current[parentKey] = parentId
    }
    result.push(current)
    if (Array.isArray(children) && children.length > 0) {
      const nextParentId = current[rowKey]
      for (const child of children) {
        walk(child, nextParentId)
      }
    }
  }

  for (const n of nodes) walk(n)
  return result
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
