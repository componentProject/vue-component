import type { ISchema } from '@formily/vue'

// 极简版，用于在 settings-form 内本地引用，避免从 renderer 引入造成循环依赖
export function createFieldSchema(component?: ISchema): ISchema {
  return {
    type: 'object',
    properties: component ? { 'x-component-props': component } : {},
  }
}
