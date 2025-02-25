import { Fragment } from 'vue'
import { createTypes } from 'vue-types'
import type { propTypes } from '../_types/utils'

export const PropTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  array: undefined,
  object: undefined,
  integer: undefined,
}) as propTypes

export function tuple<T extends string[]>(...args: T) {
  return args as T
}

export function booleanType(defaultVal?: boolean) {
  return { type: Boolean, default: defaultVal as boolean }
}

export function filterEmpty(children = []) {
  const res: any[] = []
  children.forEach((child: any) => {
    if (Array.isArray(child)) {
      res.push(...child)
    } else if (child?.type === Fragment) {
      res.push(...filterEmpty(child.children))
    } else {
      res.push(child)
    }
  })
  return res
}
