import { InputNumber as FormilyInputNumber } from '@moluoxixi/element'
import { composeExport } from '@moluoxixi/element/src/__builtins__'
import { createBehavior, createResource } from '@designable/core'
import type { DnFC } from '@moluoxixi/element-prototypes'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import type { VNode } from 'vue'

const NumberPicker: DnFC<VNode>
  = composeExport(FormilyInputNumber, {
    Behavior: createBehavior({
      name: 'InputNumber',
      extends: ['Field'],
      selector: node => node.props?.['x-component'] === 'InputNumber',
      designerProps: {
        propsSchema: createFieldSchema(AllSchemas.InputNumber),
      },
      designerLocales: AllLocales.InputNumber,
    }),
    Resource: createResource({
      icon: 'NumberPickerSource',
      elements: [
        {
          componentName: 'Field',
          props: {
            'type': 'number',
            'title': 'InputNumber',
            'x-decorator': 'FormItem',
            'x-component': 'InputNumber',
            'x-component-props': {
              'controls-position': 'right',
            },
          },
        },
      ],
    }),
  })

export const InputNumber = NumberPicker
