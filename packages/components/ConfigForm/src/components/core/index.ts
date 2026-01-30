/**
 * ConfigForm - 核心组件
 *
 * 分层架构（对齐 Formily）：
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  RecursionField (递归入口)                           │
 * │  - 根据字段类型路由到正确的渲染器                     │
 * └───────────────────────┬─────────────────────────────┘
 *                         │
 * ┌───────────────────────▼─────────────────────────────┐
 * │  Field / VoidField / ArrayField / ObjectField        │
 * │  - 状态管理、组合装饰器和组件                         │
 * └───────────────────────┬─────────────────────────────┘
 *                         │
 * ┌───────────────────────▼─────────────────────────────┐
 * │  DecoratorWrapper (装饰器层)                          │
 * │  - 只负责包装                                        │
 * └───────────────────────┬─────────────────────────────┘
 *                         │
 * ┌───────────────────────▼─────────────────────────────┐
 * │  FieldComponent (组件层)                              │
 * │  - 只负责渲染 UI                                     │
 * └─────────────────────────────────────────────────────┘
 */

// 递归入口
export { default as RecursionField } from './RecursionField.vue'

// 字段渲染器
export { default as Field } from './Field.vue'
export { default as VoidField } from './VoidField.vue'

// 分层组件
export { default as DecoratorWrapper } from './DecoratorWrapper.vue'
export { default as FieldComponent } from './FieldComponent.vue'

