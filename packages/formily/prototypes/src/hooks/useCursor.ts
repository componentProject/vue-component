import { useDesigner } from './useDesigner'
import { computed as reactiveComputed } from '../shared'

export function useCursor() {
  const designer = useDesigner()
  return reactiveComputed(() => designer.value?.cursor)
}
