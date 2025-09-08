import { useOperation } from './useOperation'
import { computed as reactiveComputed } from '../shared'

export function useHover(workspaceId?: string) {
  const operation = useOperation(workspaceId)
  return reactiveComputed(() => operation.value?.hover)
}
