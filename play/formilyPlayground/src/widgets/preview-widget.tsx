import { transformToSchema } from '@designable/formily-transformer'
import type { Form as IForm } from '@formily/core'
import { createForm } from '@formily/core'
import { Form } from '@moluoxixi/element'
import * as ElementUI from '@moluoxixi/element'
import { connect, createSchemaField, mapProps } from '@formily/vue'
import { computed, defineComponent, shallowRef } from 'vue'
import { Card, Rate, Slider, Text, TreeSelect } from '@moluoxixi/element-renderer'

const { SchemaField } = createSchemaField({
  components: {
    ...ElementUI,
    Card,
    Text,
    Rate,
    Slider,
    TreeSelect,
    Password: connect(ElementUI.Input, mapProps({}, args => ({ ...args, type: 'password', showPassword: true }))),
  },
})

export default defineComponent({
  name: 'PreviewWidget',
  props: ['tree'],
  setup(props) {
    const formRef = shallowRef<IForm>(createForm())
    const treeSchemaRef = computed(() => {
      return transformToSchema(props.tree)
    })

    return () => {
      const form = formRef.value
      const { form: formProps, schema } = treeSchemaRef.value
      console.log(schema)
      return (
        <div style={{ height: '100%', width: '100%', overflowY: 'auto', background: 'var(--dn-composite-panel-tabs-content-bg-color)' }}>
          <Form previewTextPlaceholder={' '} form={form} {...formProps}>
            <SchemaField schema={schema} />
          </Form>
        </div>
      )
    }
  },
})
