import { isStr } from '@designable/shared'
import type { CSSProperties } from 'vue'
import { useAttrs } from 'vue'

function css2obj(css) {
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
