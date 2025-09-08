import { TimePicker as FormilyTimePicker } from '@moluoxixi/element'
import { composeExport } from '@moluoxixi/element/src/__builtins__'
import { createBehavior, createResource } from '@designable/core'
import type { DnFC } from '@moluoxixi/element-prototypes'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import type { VNode } from 'vue'

export const TimePicker: DnFC<VNode>
  = composeExport(FormilyTimePicker, {
    Behavior: createBehavior({
      name: 'TimePicker',
      extends: ['Field'],
      selector: node => node.props?.['x-component'] === 'TimePicker',
      designerProps: {
        propsSchema: createFieldSchema(AllSchemas.TimePicker),
      },
      designerLocales: AllLocales.TimePicker,
    }),
    Resource: createResource({
      icon: 'TimePickerSource',
      elements: [
        {
          componentName: 'Field',
          props: {
            'type': 'string',
            'title': 'TimePicker',
            'x-decorator': 'FormItem',
            'x-component': 'TimePicker',
          },
        },
      ],
    }),
  })
