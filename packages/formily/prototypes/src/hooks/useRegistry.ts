import type { IDesignerRegistry } from '@designable/core'
import { GlobalRegistry } from '@designable/core'

export function useRegistry(): IDesignerRegistry {
  return window.__DESIGNER_REGISTRY__ || GlobalRegistry
}
