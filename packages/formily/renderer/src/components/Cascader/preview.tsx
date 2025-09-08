import { Cascader as FormilyCascader } from '@moluoxixi/element'
import { composeExport } from '@moluoxixi/element/src/__builtins__'
import { createBehavior, createResource } from '@designable/core'
import type { DnFC } from '@moluoxixi/element-prototypes'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import type { VNode } from 'vue'

export const Cascader: DnFC<VNode>
  = composeExport(FormilyCascader, {
    Behavior: createBehavior({
      name: 'Cascader',
      extends: ['Field'],
      selector: node => node.props?.['x-component'] === 'Cascader',
      designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Cascader),
      },
      designerLocales: AllLocales.Cascader,
    }),
    Resource: createResource({
      icon: 'CascaderSource',
      elements: [
        {
          componentName: 'Field',
          props: {
            'title': 'Cascader',
            'x-decorator': 'FormItem',
            'x-component': 'Cascader',
          },
        },
      ],
    }),
  })
