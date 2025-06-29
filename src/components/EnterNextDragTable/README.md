# EnterNextDragTable 组件

EnterNextDragTable 是一个封装了 DraggableTable 和 EnterNextContainer 功能的高级表格组件。它基于 vxe-table 构建，支持表格拖拽功能，同时增加了按 Enter 键在输入框之间顺序切换的能力。

## 功能特点

- 支持所有 DraggableTable 的功能（行列拖拽、虚拟滚动、右键菜单配置等）
- 支持在表格内按 Enter 键时自动切换到下一个输入框/选择器
- 当最后一个输入框按 Enter 键时，可触发自定义事件处理
- 当select没有选中值时，可触发自定义事件处理

## 基本用法

```vue
<template>
  <EnterNextDragTable
    v-model:table-data="tableData"
    :columns="columns"
    @no-next-input="handleNoNextInput"
    @no-select-value="handleNoSelectValue"
  >
    <!-- 可选的自定义列插槽 -->
  </EnterNextDragTable>
</template>

<script setup>
import { ref } from 'vue'
import EnterNextDragTable from '@/components/EnterNextDragTable/index.vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
])

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', editable: true },
  { field: 'age', title: '年龄', editable: true },
]

// 当没有下一个输入元素时的处理函数
function handleNoNextInput({ row, rowIndex }) {
  console.log('在最后一个输入元素按下了Enter', row, rowIndex)
  // 可以在这里添加新行或执行其他操作
}

// 当select下拉为空时的处理函数
function handleNoSelectValue({ row, rowIndex, colIndex }) {
  console.log('select下拉为空', row, rowIndex, colIndex)
  // 可以在这里处理select没有值的情况
}
</script>
```

## 属性

| 属性名                 | 类型    | 默认值 | 说明                                                                      |
| ---------------------- | ------- | ------ | ------------------------------------------------------------------------- |
| allowSelectNextInEmpty | Boolean | false  | 是否允许在select没有选中值时跳转（注：当前此功能暂时被注释，因为存在bug） |

此外，组件支持所有 DraggableTable 组件的属性和方法。

## 事件

| 事件名        | 参数                        | 说明                                        |
| ------------- | --------------------------- | ------------------------------------------- |
| noNextInput   | { row, rowIndex }           | 当在表格中最后一个输入元素按下Enter键时触发 |
| noSelectValue | { row, rowIndex, colIndex } | 当在表格中select下拉为空时触发              |

## 方法

组件暴露以下方法：

| 方法名      | 参数 | 返回值          | 说明                         |
| ----------- | ---- | --------------- | ---------------------------- |
| refreshRows | -    | -               | 手动刷新行元素收集           |
| getTableRef | -    | VxeGridInstance | 获取内部DraggableTable的实例 |

## 注意事项

1. 组件依赖于 vxe-table，使用前请确保已安装相关依赖
2. allowSelectNextInEmpty 配置当前被注释，待bug修复后可恢复使用
3. 表格布局变化后，可能需要调用 refreshRows 方法重新收集行元素
