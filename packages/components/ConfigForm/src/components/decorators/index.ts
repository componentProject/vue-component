/**
 * ConfigForm - 装饰器组件
 *
 * 装饰器用于包装字段组件，提供额外的 UI 功能：
 * - CardDecorator: 卡片容器装饰器
 * - TabsDecorator: 标签页容器装饰器
 * - CollapseDecorator: 折叠面板容器装饰器
 * - GroupDecorator: 分组装饰器
 *
 * 使用方式：在 adapter.decorators 中注册
 */

export { default as CardDecorator } from './CardDecorator.vue'
export { default as CollapseDecorator } from './CollapseDecorator.vue'
export { default as GroupDecorator } from './GroupDecorator.vue'
export { default as TabsDecorator } from './TabsDecorator.vue'

