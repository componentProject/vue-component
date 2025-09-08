import { useDesigner } from './useDesigner'
import { computed as reactiveComputed } from '../shared'

export function useWorkbench() {
  const designer = useDesigner()
  return reactiveComputed(() => designer.value.workbench)
}
