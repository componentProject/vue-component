import { useWorkspace } from './useWorkspace'
import { computed as reactiveComputed } from '../shared'

export function useOperation(workspaceId?: string) {
  const workspace = useWorkspace(workspaceId)
  return reactiveComputed(() => workspace.value?.operation)
}
