import { computed, unref } from 'vue-demi'
import { useLayout } from './useLayout'

export function usePrefix(after = '') {
  const layoutRef = useLayout()
  const usePrefixContext = computed(
    () => unref(layoutRef)?.prefixCls + after,
  )
  return usePrefixContext
}
