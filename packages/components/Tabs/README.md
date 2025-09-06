# Tabs 标签页组件

一个基于Element Plus的Tab标签页组件封装，支持动态标签页、条件渲染与懒加载。

## 基础示例

```vue
<template>
  <Tabs v-model="active" :tab-list="[{ id:'1', label:'A' }, { id:'2', label:'B' }]" />
</template>
```

（更多示例与说明见下文）

## Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活标签的id (v-model) | String | '1' |
| tabList | 标签页配置数组 | `Array<TabItem>` | [] |

### TabItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 标签页唯一标识 | string | - |
| label | 标签标题 | string | - |
| slot | 内容插槽名（未设置则使用 label） | string | - |
| lazy | 懒加载 | boolean | false |
| show | 动态显示函数 | `(item:any)=>boolean` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| tabChange | 选中时触发 | `(name:string) => void` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| [slot\|label] | 标签页内容，插槽名称为 `item.slot` 或 `item.label` |

## Expose

无。 