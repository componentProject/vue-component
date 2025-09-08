import { useDesigner } from './useDesigner'
import { computed as reactiveComputed } from '../shared'
import type { Engine } from '@designable/core'

export function useScreen() {
  const designer = useDesigner()
  return reactiveComputed<Engine['screen']>(() => designer.value?.screen)
}
