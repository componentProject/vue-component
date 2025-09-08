import type { ComputedRef } from 'vue-demi'
import { inject, ref } from 'vue-demi'
import { DesignerLayoutSymbol } from '../shared'
import type { IDesignerLayoutContext } from '../types'

export function useLayout(): ComputedRef<IDesignerLayoutContext> {
  return window.__DESIGNABLE_LAYOUT__ ? ref(window.__DESIGNABLE_LAYOUT__) : inject(DesignerLayoutSymbol, ref())
}
