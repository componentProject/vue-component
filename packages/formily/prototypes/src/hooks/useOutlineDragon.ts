import { useOperation } from './useOperation'
import { computed as reactiveComputed } from '../shared'

export function useOutlineDragon(workspaceId?: string) {
  const operation = useOperation(workspaceId)
  return reactiveComputed(() => operation.value?.outlineDragon)
}
