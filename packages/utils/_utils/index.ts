import moment from 'moment'
import type { App, Component } from 'vue'
import { Fragment } from 'vue'

import type { DebounceSettings, ThrottleSettings } from 'lodash'
//#region 时间控制：节流/防抖
import { debounce as lodashDebounce, throttle as lodashThrottle } from 'lodash'

export type DateType = string | Date | moment.Moment

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

type EventType = string | Event

/**
 * 派发事件
 * @param target 触发事件的目标dom
 * @param events 事件数组
 */
export function dispatchEvents(target: Document, events: EventType | EventType[]) {
  if (Array.isArray(events)) {
    events.forEach((event: EventType) => {
      target.dispatchEvent(typeof event === 'string' ? new Event(event) : event)
    })
  }
  else {
    target.dispatchEvent(typeof events === 'string' ? new Event(events) : events)
  }
}

//#region 日期相关
/**
 * 匹配 以年月日 时分秒 顺序排列的任意时间格式字符串,匹配不到默认返回 YYYY-MM-DD HH:mm:ss
 * @param str
 * @param defaultFormat
 */
export function detectDateFormatByReplace(str: string, defaultFormat = 'YYYY-MM-DD HH:mm:ss') {
  if (getType(str, 'string')) {
    // 匹配所有数字和分隔符的片段
    const pattern = /(\d{4}|\d{2})(\D?)/g
    const tokens = ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss']
    let i = 0
    let result = ''

    for (let match: any; i < tokens.length; i++) {
      match = pattern.exec(str as string)
      if (match === null) {
        break
      }
      result += tokens[i] + match[2] // match[2]是分隔符（可能为空）
    }
    // 若未匹配到任何数字，则返回defaultFormat
    return i === 0 ? defaultFormat : result
  }
  else {
    return defaultFormat
  }
}

/**
 * 判断date1是否在date2之前
 * @param date1 日期1
 * @param date2 日期2
 */
export function dateIsBefore(date1: DateType, date2: DateType) {
  return date1 && date2 ? moment(date1).isBefore(moment(date2)) : false
}

/**
 * 判断一个日期是否满足某个moment格式，如果满足返回moment对象，否则返回false
 * @param dateStr 日期
 * @param format moment格式
 * @param strictType 强制校验dateStr是否满足该类型
 */
export function getMomentIsValid(dateStr: DateType, format?: string, strictType?: string) {
  if (!dateStr || (strictType && !getType(dateStr, strictType)))
    return false
  const momentDate = format ? moment(dateStr, format, true) : moment(dateStr)
  return momentDate.isValid() ? momentDate : false
}

/**
 * 判断一个非数值的日期是否满足某个moment格式，如果满足返回moment对象，否则返回false
 * @param dateStr 任意日期格式，包括Date
 * @param format 是否强校验是否满足format格式
 * @param strictType 强制校验dateStr是否满足该类型
 */
export function getMomentIsValidIsNoNum(dateStr: DateType, format?: string, strictType?: string) {
  const dateTypes = ['string', 'date']
  if (dateTypes.some(type => getType(dateStr, type))) {
    if (!Number.isNaN(+dateStr))
      return false
    return getMomentIsValid(dateStr, format, strictType)
  }
  else {
    return false
  }
}

/**
 * 校验日期范围格式
 * @param dateStr 日期
 * @param format moment格式
 * @param strictType 强制校验dateStr是否满足该类型
 */
export function validateDate(
  dateStr: DateType,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  strictType: string,
) {
  if (!dateStr)
    return false

  if (Array.isArray(dateStr)) {
    return dateStr.every(date => getMomentIsValid(date, format, strictType))
  }
  else {
    // 单个日期值 xxx
    return getMomentIsValid(dateStr, format, strictType)
  }
}

type DateOperationType = 'startOf' | 'endOf'

/**
 * 判断一个日期字符串是否满足某个moment格式
 * @param dateStr 日期
 * @param format moment格式
 * @param type startOf\endOf
 * @param dateType day\month\year
 * @param onlyFormat 是否只返回格式化后的日期
 */
export function getFormatDate(
  dateStr: DateType,
  format: string = 'YYYY-MM-DD HH:mm:ss',
  type: DateOperationType = 'startOf',
  dateType: moment.unitOfTime.StartOf = 'day',
  onlyFormat = false,
) {
  const momentDate = getMomentIsValid(dateStr, format)
  if (!momentDate)
    return false

  const formatDateStr = momentDate.format(format)
  if (formatDateStr === dateStr || onlyFormat)
    return formatDateStr
  return momentDate[type](dateType).format(format)
}

/**
 * 格式化返回的日期范围
 * @param date 日期
 * @param format moment格式
 * @param dateType day\month\year
 * @param onlyFormat 是否只返回格式化后的日期
 */
export function formatDateRange(
  date: DateType | DateType[],
  format: string = 'YYYY-MM-DD HH:mm:ss',
  dateType: moment.unitOfTime.StartOf = 'day',
  onlyFormat: boolean,
) {
  if (!date)
    return []
  const [start, end] = Array.isArray(date) ? date : [date, date]
  const startDate = getFormatDate(start, format, 'startOf', dateType, onlyFormat)
  const endDate = getFormatDate(end, format, 'endOf', dateType, onlyFormat)
  if (startDate && endDate) {
    return [startDate, endDate]
  }
  else {
    console.error('日期格式不正确')
    return []
  }
}

//#endregion

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

type ThrottleExtraOptions = ThrottleSettings & { promise?: boolean }

/**
 * 节流：默认使用 lodash 节流，配置 { trailing: true, leading: false }，可自定义；
 * 当开启 promise 模式时，需等待上一次 Promise 完成（成功或失败）后，才会进行下一次执行，且仍遵循 wait 与 leading/trailing 语义。
 */
export function throttle<F extends (...args: any[]) => any>(
  fn: F,
  wait = 300,
  options: ThrottleExtraOptions = { trailing: true, leading: false },
): (...args: Parameters<F>) => ReturnType<F> | Promise<ReturnType<F>> {
  const { promise, ...rest } = options
  const merged: ThrottleSettings = { trailing: true, leading: false, ...rest }
  if (!promise) {
    // 直接返回 lodash 的节流函数
    return lodashThrottle(fn, wait, merged) as unknown as (...args: Parameters<F>) => ReturnType<F>
  }
  else {
    return promiseThrottle(fn, wait, merged)
  }
}

export function promiseThrottle<F extends (...args: any[]) => any>(
  fn: F,
  wait = 300,
  options: ThrottleSettings = { trailing: true, leading: false },
): (...args: Parameters<F>) => ReturnType<F> | Promise<ReturnType<F>> {
  // 校验与规范化配置：不允许 leading=false
  if (options && 'leading' in options && options.leading === false)
    throw new Error('[promiseThrottle] 不支持 leading=false（轻量无定时器模式要求 leading=true）')
  // 上一次“实际开始执行”的时间戳（ms），作为时间窗基准
  let lastInvokeTime = 0
  // 当前正在执行中的 Promise（存在表示互斥锁），复用以避免并发执行
  let inFlightPromise: Promise<any> | null = null
  // 最近一次真正执行（完成 canInvoke）时返回的 Promise
  let lastResultPromise: Promise<any> | null = null
  // 记录窗口期内延后执行的调用闭包（避免直接给 this 起别名）
  let lastCall: (() => Promise<ReturnType<F>>) | null = null
  // 是否应该立即执行：
  // - 首次调用：由 leading 决定
  // - 非首次：距离上次开始时间已超过 wait
  function shouldInvoke(now: number) {
    return lastInvokeTime === 0 || (now - lastInvokeTime) >= wait
  }

  // 立即执行一次，并维护状态；执行结束后若有挂起则尝试补发
  function invokeNow(thisArg: any, args: Parameters<F>) {
    lastInvokeTime = Date.now()
    const result = fn.apply(thisArg, args)
    const p = Promise.resolve(result)
    inFlightPromise = p
    lastResultPromise = p

    p.finally(() => {
      inFlightPromise = null
      // 轻量“无定时器”模式：仅在 finally 时机尝试一次 trailing 补发
      if (lastCall) {
        const now = Date.now()
        if (shouldInvoke(now)) {
          const call = lastCall
          lastCall = null
          return call()
        }
      }
    })

    return p as Promise<ReturnType<F>>
  }

  // 以“上次开始时间”为基准：仅当上一轮已完成且距上次开始时间已过 wait 才允许再次执行
  return function throttled(this: any, ...args: Parameters<F>) {
    const now = Date.now()
    lastCall = () => invokeNow(this, args)

    const canInvoke = !inFlightPromise && shouldInvoke(now)
    if (canInvoke) {
      return invokeNow(this, args)
    }

    if (inFlightPromise)
      return inFlightPromise as Promise<ReturnType<F>>

    if (lastResultPromise)
      return lastResultPromise as Promise<ReturnType<F>>

    return Promise.resolve(undefined as unknown as ReturnType<F>)
  }
}

/**
 * 防抖：默认使用 lodash 防抖，配置 { trailing: true, leading: false }，可自定义
 */
export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  wait = 300,
  options: DebounceSettings = { trailing: true, leading: false },
): (...args: Parameters<F>) => ReturnType<F> {
  const merged: DebounceSettings = { trailing: true, leading: false, ...options }
  return lodashDebounce(fn, wait, merged) as unknown as (...args: Parameters<F>) => ReturnType<F>
}
//#endregion
