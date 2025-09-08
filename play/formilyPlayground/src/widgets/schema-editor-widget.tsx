import { computed, defineComponent } from 'vue-demi'
import {
  transformToSchema,
  transformToTreeNode,
} from '@designable/formily-transformer'
import { MonacoInput } from '@moluoxixi/element-settings-form'

export default defineComponent({
  name: 'SchemaEditorWidget',
  props: ['tree'],
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const code = computed(() => {
      return JSON.stringify(transformToSchema(props.tree), null, 2)
    })

    return () => {
      return (
        <MonacoInput
          {...attrs}
          value={code.value}
          onChange={value => emit('change', transformToTreeNode(JSON.parse(value)))}
          language="json"
          height="100%"
          width="100%"
        />
      )
    }
  },
})
