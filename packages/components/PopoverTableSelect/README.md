# PopoverTableSelect 下拉表格选择

基于 Element Plus `el-popover` 与 `vxe-grid` 的弹出表格选择组件，支持虚拟触发、键盘交互、加载更多等。

## 基础示例

```vue
<template>
  <input ref="inputRef" placeholder="点击选择">
  <PopoverTableSelect :virtual-ref="inputRef" :columns="columns" :data="rows" @select="onSelect" />
</template>
```

## Props

| 参数                           | 说明                           | 类型                                                                   | 默认值                              |
| ------------------------------ | ------------------------------ | ---------------------------------------------------------------------- | ----------------------------------- | ------------- | ----------- | ----- | ---- |
| v-model                        | 控制弹出层显示                 | boolean                                                                | false                               |
| debounce                       | 防抖(ms)                       | number                                                                 | 0                                   |
| throttle                       | 节流(ms)                       | number                                                                 | 300                                 |
| options                        | 防抖/节流配置                  | `Partial<DebounceSettings & ThrottleSettings> & { promise?: boolean }` | `{}`                                |
| popType                        | 触发类型                       | `'default'` \| `'input'`                                               | 'default'                           |
| placeholder                    | 占位文案                       | string                                                                 | '点击或按下方向键试试'              |
| inputProps                     | 输入框属性                     | `InputProps`                                                           | `{}`                                |
| inputValue                     | 输入框值                       | string                                                                 | ''                                  |
| virtualRef                     | 虚拟触发元素                   | `ComponentPublicInstance                                               | ComponentInternalInstance           | InputInstance | HTMLElement | null` | null |
| successiveShowType             | 连续显示触发类型               | `'enter'` \| `'input'`                                                 | ''                                  |
| placement/trigger/...          | 透传 Popover 关键属性          | 参考文档                                                               | -                                   |
| width/height                   | 弹层宽度/表格高度              | string\|number                                                         | 400/300                             |
| id                             | 传给 DraggableTable 的唯一标识 | string                                                                 | 'popoverTableSelect'                |
| columns                        | vxe-grid 列配置                | `ColumnType[]`                                                         | []                                  |
| data                           | 表格数据                       | any[]                                                                  | []                                  |
| enableLoadMore/hasMore/loading | 下拉加载更多控制               | boolean                                                                | false                               |
| virtualYConfig                 | 虚拟滚动配置                   | `{ enabled: boolean, threshold: number }`                              | `{ enabled: false, threshold: 30 }` |

## Events

| 事件名           | 说明                     | 回调参数               |
| ---------------- | ------------------------ | ---------------------- |
| select           | 选中行触发（回车或点击） | `(row:any) => void`    |
| input            | 输入值变化               | `(val:string) => void` |
| focus/blur/clear | 焦点与清空               | -                      |
| loadMore         | 触发加载更多             | `() => void`           |

## Slots

| 插槽名     | 说明                                 |
| ---------- | ------------------------------------ |
| default    | 表格上方默认插槽                     |
| [动态传递] | 透传给内部 DraggableTable 的所有插槽 |

## Expose

无。
