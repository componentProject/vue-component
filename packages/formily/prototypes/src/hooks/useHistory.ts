import { useWorkspace } from './useWorkspace'
import { computed as reactiveComputed } from '../shared'

export function useHistory(workspaceId?: string) {
  const workspace = useWorkspace(workspaceId)
  return reactiveComputed(() => workspace.value?.history)
}
