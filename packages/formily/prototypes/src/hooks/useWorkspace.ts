import { useDesigner } from './useDesigner'
import { computed as reactiveComputed, useContext, WorkspaceSymbol } from '../shared'
import type { Workspace } from '@designable/core'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'

export function useWorkspace(id?: string): Ref<Workspace> {
  const designer = useDesigner()
  const workspaceRef = ref()

  const WorkspaceSymbolRef = useContext(WorkspaceSymbol)

  if (window.__DESIGNABLE_WORKSPACE__) {
    workspaceRef.value = window.__DESIGNABLE_WORKSPACE__
    return workspaceRef
  }

  return reactiveComputed(() => {
    const workspaceId = id || WorkspaceSymbolRef?.value.id
    if (workspaceId) {
      return designer.value.workbench.findWorkspaceById(workspaceId)
    }
    return designer.value.workbench.currentWorkspace
  })
}
