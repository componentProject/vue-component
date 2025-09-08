import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { IDesignerLayoutContext } from '../types'
import { useLayout } from './useLayout'

export function usePosition(): ComputedRef<IDesignerLayoutContext['position']> {
  const layoutRef = useLayout()
  return computed(
    () => layoutRef.value?.position,
  )
}
