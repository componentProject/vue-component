import type { ComputedRef } from 'vue-demi'
import { computed, unref } from 'vue-demi'
import type { IDesignerLayoutContext } from '../types'
import { useLayout } from './useLayout'

export function useTheme(): ComputedRef<IDesignerLayoutContext['theme']> {
  const layoutRef = useLayout()
  return computed(
    () => unref(layoutRef)?.theme,
  )
}
