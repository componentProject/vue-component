# PopoverTableSelect 组件

## 组件简介
下拉表格选择组件
`PopoverTableSelect` 是一个基于 Element Plus 的 `el-popover` 和 `vxe-grid` 封装的弹出表格选择组件，支持虚拟触发（virtual-ref）、自定义表格列（columns）、数据源（data）等参数，支持键盘上下键快速切换行、回车选中、点击选中等交互。

## 主要功能

- 支持通过 `virtual-ref` 绑定任意元素作为弹出触发点
- 支持自定义表格列（columns）和数据（data）
- 默认选中表格第一行
- 支持在 `virtual-ref` 元素上按上下键切换表格行并自动滚动
- 回车抛出当前选中行，点击表格行抛出点击行
- 支持自定义 Popover 的样式、动画、位置等高级配置

## 使用方法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import PopoverTableSelect from './PopoverTableSelect'

const inputRef = ref()
const columns = [
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
]
const tableData = [
  { name: '张三', age: 18 },
  { name: '李四', age: 20 },
]
function handleSelect(row) {
  console.log('选中行：', row)
}
</script>

<template>
  <input ref="inputRef" placeholder="点击选择" />
  <PopoverTableSelect
    :virtual-ref="inputRef"
    :columns="columns"
    :data="tableData"
    width="500"
    height="300"
    placement="bottom-start"
    @select="handleSelect"
  >
    <template #default>可自定义内容</template>
  </PopoverTableSelect>
</template>
```

## Props 参数

| 参数           | 说明                                         | 类型                                      | 默认值     |
| -------------- | -------------------------------------------- | ----------------------------------------- | ---------- |
| virtual-ref    | 触发 Popover 的元素 ref                      | Ref/HTMLElement/ComponentInstance         | 必填       |
| placement      | Popover 弹出位置                             | string                                    | 'bottom'   |
| trigger        | 触发方式（click/focus/hover/contextmenu）     | string                                    | 'hover'    |
| title          | 标题文本内容                                 | string                                    | ''         |
| effect         | Tooltip 主题样式（'dark'/'light'）            | string                                    | 'light'    |
| content        | 显示的主内容（可通过 slot 覆盖）             | string                                    | ''         |
| disabled       | 是否禁用 Popover                             | boolean                                   | false      |
| offset         | 浮层相对于触发元素的偏移量（像素）           | number                                    | 12         |
| transition     | 浮层显示动画效果                             | string                                    | 'el-fade-in-linear' |
| showArrow      | 是否显示箭头指示器                           | boolean                                   | true       |
| popperOptions  | Popper.js 的配置对象（高级定制）              | object                                    | { modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false } }] } |
| popperClass    | 自定义浮层容器的 class 名称                  | string                                    | ''         |
| popperStyle    | 自定义浮层容器的行内样式                     | string/object                             | ''         |
| showAfter      | 触发后延迟显示的时间（毫秒）                 | number                                    | 0          |
| hideAfter      | 关闭浮层的延迟时间（毫秒）                   | number                                    | 200        |
| autoClose      | 自动关闭延时（毫秒）                         | number                                    | 0          |
| tabindex       | Popover 的 tabindex 属性                     | number                                    | undefined  |
| teleported     | 是否将浮层插入至 body 元素                   | boolean                                   | true       |
| persistent     | 是否持久化保留 Popover DOM                   | boolean                                   | true       |
| width          | 弹窗宽度                                     | string/number                             | 400        |
| height         | 表格高度                                     | string/number                             | 300        |
| id             | 传递给 DraggableTable 的唯一标识             | string                                    | ''         |
| columns        | vxe-grid 列配置                              | array                                     | []         |
| data           | 表格数据                                     | array                                     | []         |

## 事件

| 事件名   | 说明             | 回调参数          |
| -------- | ---------------- | ----------------- |
| select   | 选中行时触发（回车或点击） | row（当前行数据） |

## 插槽

| 插槽名   | 说明                         |
| -------- | ---------------------------- |
| default  | 自定义 Popover 内部内容（如表格上方内容、提示等） |
| 其他     | 透传给 DraggableTable 的所有插槽（如自定义单元格）|

## 依赖

- element-plus
- vxe-table

## 备注

- 组件已内置键盘上下键切换、回车选中、自动滚动等交互逻辑。
- columns 配置参考 vxe-grid 官方文档。
- 支持所有 el-popover 的高级用法和自定义样式。
