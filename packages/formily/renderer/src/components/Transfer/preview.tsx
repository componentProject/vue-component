import { Transfer as FormilyTransfer } from '@moluoxixi/element'
import { composeExport } from '@moluoxixi/element/src/__builtins__'
import { createBehavior, createResource } from '@designable/core'
import type { DnFC } from '@moluoxixi/element-prototypes'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import type { VNode } from 'vue'

export const Transfer: DnFC<VNode>
  = composeExport(FormilyTransfer, {
    Resource: createResource({
      icon: 'TransferSource',
      elements: [
        {
          componentName: 'Field',
          props: {
            'title': 'Transfer',
            'x-decorator': 'FormItem',
            'x-component': 'Transfer',
          },
        },
      ],
    }),
    Behavior: createBehavior({
      name: 'Transfer',
      extends: ['Field'],
      selector: node => node.props?.['x-component'] === 'Transfer',
      designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Transfer),
      },
      designerLocales: AllLocales.Transfer,
    }),
  })
