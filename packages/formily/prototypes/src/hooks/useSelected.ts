import { toJS } from '@formily/reactive'
import { useSelection } from './useSelection'
import { computed as reactiveComputed } from '../shared'

export function useSelected(workspaceId?: string) {
  const selection = useSelection(workspaceId)
  // const result = ref(toJS(selection.value?.selected) || [])
  // const dispose = observe(selection.value, () => {
  //   result.value = toJS(selection.value.selected)
  // })
  // onBeforeUnmount(() => {
  //   dispose()
  // })
  return reactiveComputed(() => {
    return toJS(selection.value.selected)
  })
}
