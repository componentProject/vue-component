/**
 * ConfigForm - Components Index
 * 组件统一导出
 *
 * 分层架构（对齐 Formily）：
 * - RecursionField: 递归入口
 * - Field: 数据字段渲染器
 * - VoidField: 布局字段渲染器
 * - DecoratorWrapper: 装饰器层
 * - FieldComponent: 组件层
 */

export { default as ArrayFieldRenderer } from './ArrayFieldRenderer.vue'

export {
  DecoratorWrapper,
  Field,
  FieldComponent,
  RecursionField,
  VoidField,
} from './core'

export {
  CardDecorator,
  CollapseDecorator,
  GroupDecorator,
  TabsDecorator,
} from './decorators'

export { default as ObjectFieldRenderer } from './ObjectFieldRenderer.vue'
