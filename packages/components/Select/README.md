# Select 选择器

基于 Element Plus 的下拉选择器二次封装，增强本地筛选、禁用规则、远程选项与多选标签显示能力。

## 基础示例

```vue
<template>
  <Select v-model="value" :options="options" />
</template>
```

## Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 选中项绑定值 | any | - |
| options | 本地选项数据 | any[] | [] |
| label/value | 选项显示/值字段名 | string | 'label'/'value' |
| clearable | 是否可清空 | boolean | true |
| filterable | 是否可搜索 | boolean | true |
| filterMethod | 自定义本地筛选 | `(keyword:string)=>void` | - |
| collapseTags/collapseTagsTooltip | 多选折叠与提示 | boolean | true |
| teleported | Teleport 到 body | boolean | true |
| serverProps | 远程数据配置 | `{ serverType:string; optionsParams?:object }` | - |
| tagType | Tag 类型 | `'success'|'info'|'warning'|'danger'` | 'primary' |
| filterFields | 本地筛选字段集合 | string[] | [] |
| disabledValues/disabledLabels | 按值/标签禁用 | any[] | [] |
| disabledHandler | 自定义禁用规则 | `({ label, value, data? })=>boolean` | - |
| enableLoadMore/hasMore/loading | 下拉加载更多控制 | boolean | false |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选项变化 | `(value:any) => void` |

## Slots

该组件无自定义插槽。

## Expose

无。 