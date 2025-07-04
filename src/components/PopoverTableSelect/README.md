# PopoverTableSelect 组件

## 组件简介

`PopoverTableSelect` 是一个基于 Element Plus 的 `el-popover` 和 `vxe-grid`
封装的弹出表格选择组件，支持虚拟触发（virtual-ref）、自定义表格列（columns）、数据源（data）等参数，支持键盘上下键快速切换行、回车选中、点击选中等交互。

## 主要功能

- 支持通过 `virtual-ref` 绑定任意元素作为弹出触发点
- 支持自定义表格列（columns）和数据（data）
- 默认选中表格第一行
- 支持在 `virtual-ref` 元素上按上下键切换表格行并自动滚动
- 回车抛出当前选中行，点击表格行抛出点击行

## 使用方法

```vue
<PopoverTableSelect
  :virtual-ref="inputRef"
  :columns="columns"
  :data="tableData"
  @select="handleSelect"
  @rowClick="handleRowClick"
/>
```

## Props 参数

| 参数        | 说明                    | 类型            | 默认值 |
| ----------- | ----------------------- | --------------- | ------ |
| virtual-ref | 触发 Popover 的元素 ref | Ref/HTMLElement | 必填   |
| columns     | vxe-grid 列配置         | Array           | []     |
| data        | 表格数据                | Array           | []     |
| width       | 弹窗宽度                | String/Number   | 400    |
| height      | 表格高度                | String/Number   | 300    |

## 事件

| 事件名   | 说明             | 回调参数          |
| -------- | ---------------- | ----------------- |
| select   | 回车选中行时触发 | row（当前行数据） |
| rowClick | 点击行时触发     | row（当前行数据） |

## 依赖

- element-plus
- vxe-table

## 备注

- 组件已内置键盘上下键切换、回车选中、自动滚动等交互逻辑。
- columns 配置参考 vxe-grid 官方文档。
