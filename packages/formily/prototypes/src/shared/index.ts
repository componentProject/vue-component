import { isStr } from '@designable/shared'
import type { CSSProperties } from '@vue/runtime-dom'
import { cloneVNode } from '@vue/runtime-dom'
import { useAttrs } from 'vue'

export * from './context'
export * from './reactive'
export * from './useEffect'

/**
 * 复制一个现有VNode对象
 * @param VNode
 * @param props
 * @returns
 */
export const cloneElement = cloneVNode

function css2obj(css: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking,regexp/optimal-quantifier-concatenation
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g
  const o = {}
  css.replace(r, (m, p, v) => (o[p] = v))
  return o
}

export function useStyle() {
  let { style = {} } = useAttrs()
  if (isStr(style)) {
    style = css2obj(style)
  }
  return style as CSSProperties
}

export { isVNode } from 'vue'
