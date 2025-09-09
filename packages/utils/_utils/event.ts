import type { DebounceSettings, ThrottleSettings } from 'lodash'
import { debounce as lodashDebounce, throttle as lodashThrottle } from 'lodash'

//#region event相关
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

//#region Hotkeys 组合快捷键监听（仅接收键字符串数组）

/**
 * 将用户传入的键字符串进行规范化
 * - 去除两端空格
 * - 转为小写
 * - 空字符串返回 null（表示无效）
 */
function normalizeInputKey(raw: string): string | null {
  const name = (raw || '').trim().toLowerCase()
  if (!name) {
    return null
  }
  return name
}

// ---

/**
 * 将用户传入的键数组构建为需求集合
 * - 全部小写化，直接加入集合
 */
function buildRequired(keys: string[]): Set<string> {
  const set = new Set<string>()
  for (const raw of keys) {
    const k = normalizeInputKey(raw)
    if (!k) {
      continue
    }
    set.add(k)
  }
  return set
}

export interface OnHotkeysOptions {
  /** 指定监听目标；默认 document */
  target?: Document | HTMLElement
}

/**
 * 同时按下指定键数组时触发的组合快捷键监听
 * - 仅使用 KeyboardEvent.key（小写）进行匹配
 * - 在指定 target（默认 document）上监听 keydown/keyup
 * 使用：onHotkeys(keys, callback, { target? }) → () => void
 */
export function onHotkeys(keys: string[], callback: (e: KeyboardEvent) => void, options?: OnHotkeysOptions): () => void {
  const hasWindow = typeof window !== 'undefined'
  if (!hasWindow) {
    return () => {}
  }

  const requiredKeys = buildRequired(keys)
  const target = (options && options.target) || document

  const pressedKeys = new Set<string>()
  /** 是否触发过 */
  let fired = false

  /**
   * 检查当前按键集合是否满足需求集合
   * - 仅校验 keys 子集关系
   */
  function isComboMatched(): boolean {
    for (const k of requiredKeys) {
      if (!pressedKeys.has(k)) {
        return false
      }
    }
    return true
  }

  /**
   * keydown 事件处理
   * - 记录 e.key 的小写形式
   * - 命中组合后触发回调
   */
  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    const k = e.key ? e.key.toLowerCase() : ''
    console.log('Down', k)

    if (k) {
      pressedKeys.add(k)
    }

    if (!fired && isComboMatched()) {
      fired = true
      callback(e)
    }
  }

  /**
   * keyup 事件处理
   * - 从 pressedKeys 中移除当前键
   */
  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault()
    const k = e.key ? e.key.toLowerCase() : ''
    console.log('Up', k)

    if (k) {
      pressedKeys.delete(k)
    }
    fired = false
  }

  /**
   * 当窗口失焦/标签页隐藏时，清理状态，避免长按或丢失事件导致的状态污染
   */
  const onBlur = () => {
    console.log('blur')

    pressedKeys.clear()
    fired = false
  }

  target.addEventListener('keydown', onKeyDown as any, { passive: false })
  target.addEventListener('keyup', onKeyUp as any, { passive: true })
  window.addEventListener('blur', onBlur, { passive: true })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      onBlur()
    }
  }, { passive: true })

  function off() {
    target.removeEventListener('keydown', onKeyDown as any)
    target.removeEventListener('keyup', onKeyUp as any)
    window.removeEventListener('blur', onBlur)
    pressedKeys.clear()
    fired = false
  }

  return off
}
//#endregion
