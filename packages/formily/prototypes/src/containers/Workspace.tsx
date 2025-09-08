import { useDesigner } from '../hooks'
import { WorkspaceSymbol } from '../shared'
import { computed, defineComponent, provide, ref, unref } from 'vue-demi'

export interface IWorkspaceProps {
  id?: string
  title?: string
  description?: string
}

export const Workspace = defineComponent({
  name: 'Workspace',
  props: {
    id: String,
    title: String,
    description: String,
  },
  setup(props, { slots }) {
    const oldId = ref<string>()
    const designerRef = useDesigner()
    // memo [id, designer]
    const workspace = computed(() => {
      const designer = unref(designerRef)
      if (!designer)
        return
      if (oldId.value && oldId.value !== props.id) {
        const old = designer.workbench.findWorkspaceById(oldId.value)
        if (old)
          old.viewport.detachEvents()
      }
      const workspace = {
        id: props.id || 'index',
        title: props.title,
        description: props.description,
      }
      designer.workbench.ensureWorkspace(workspace)
      oldId.value = workspace.id
      return workspace
    })

    provide(WorkspaceSymbol, workspace)

    return () => {
      return slots.default?.()
    }
  },
})
