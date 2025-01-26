:::demo

```vue

<template>
  <DragTable />
</template>
<script setup lang="ts">
  import { reactive } from 'vue'

  const props = reactive({
    rowSort: true,
    colSort: true,
    theadData: [
      {
        title: '姓名',
        field: 'name',
        type: 'slot',
        slots: { edit: 'name' },
        concrete: 'select'
      },
      { title: '年龄', field: 'age' },
      { title: '地址', field: 'address' }
    ],
    tableData: [
      { name: '张三', age: 18, address: '北京' },
      { name: '李四', age: 20, address: '上海' },
      { name: '王五', age: 22, address: '广州' }
    ]
  })
</script>
```

:::

# props

| 参数    | 说明   | 类型    | 可选值                                             | 默认值  |
| ------- | ------ | ------- | -------------------------------------------------- | ------- |

# events

| 事件名 | 说明 | 回调参数 | 默认值 |
| ------- | ------ | ------- | ------- |
