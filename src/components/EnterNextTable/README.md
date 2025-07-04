# TableEnterNext 组件

TableEnterNext 是一个基于 EnterNextContainer 和 el-table 的增强组件，它允许用户在表格中使用回车键在输入框之间快速导航，提高表单填写效率。

## 功能特点

- 完全兼容 el-table 组件，支持所有 el-table 的属性和事件
- 自动监听表格中所有行的输入元素(input, select等)
- 通过回车键在表格内部输入框之间快速跳转
- 可配置是否允许在下拉框展开时跳转
- 当用户按下回车键且没有下一个输入元素时，触发自定义事件

## 安装与导入

```js
import TableEnterNext from '@/components/TableEnterNext/index.vue'
```

## 基本用法

### 1. 基础表格用法

```vue
<template>
  <TableEnterNext :data="tableData" border @no-next-input="handleNoNextInput">
    <el-table-column label="姓名" prop="name">
      <template #default="scope">
        <el-input v-model="scope.row.name" placeholder="请输入姓名" />
      </template>
    </el-table-column>

    <el-table-column label="年龄" prop="age">
      <template #default="scope">
        <el-input v-model="scope.row.age" placeholder="请输入年龄" />
      </template>
    </el-table-column>

    <el-table-column label="性别" prop="gender">
      <template #default="scope">
        <el-select v-model="scope.row.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </template>
    </el-table-column>
  </TableEnterNext>
</template>

<script setup>
import { ref } from 'vue'
import TableEnterNext from '@/components/TableEnterNext/index.vue'

const tableData = ref([
  { name: '张三', age: '25', gender: '男' },
  { name: '李四', age: '30', gender: '女' },
])

// 当没有下一个输入元素时的处理
function handleNoNextInput(element, rowIndex) {
  console.log('已到达最后一个输入元素', element, `行索引: ${rowIndex}`)
  // 在这里可以执行提交表单等操作
}
</script>
```

### 2. 允许在下拉框展开时也能跳转

```vue
<template>
  <TableEnterNext
    :data="tableData"
    :allow-next-when-no-aria-active="true"
    border
    @no-next-input="handleNoNextInput"
  >
    <!-- 表格列定义 -->
  </TableEnterNext>
</template>
```

### 3. 动态添加行后刷新组件

```vue
<template>
  <div>
    <el-button @click="addRow">
      添加行
    </el-button>
    <TableEnterNext ref="tableEnterNextRef" :data="tableData" border>
      <!-- 表格列定义 -->
    </TableEnterNext>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TableEnterNext from '@/components/TableEnterNext/index.vue'

const tableData = ref([{ name: '张三', age: '25', gender: '男' }])

const tableEnterNextRef = ref(null)

function addRow() {
  tableData.value.push({
    name: '',
    age: '',
    gender: '',
  })

  // 刷新行收集
  setTimeout(() => {
    tableEnterNextRef.value?.refreshRows()
  }, 0)
}
</script>
```

## Props

| 属性名                    | 类型    | 默认值 | 说明                                                          |
| ------------------------- | ------- | ------ | ------------------------------------------------------------- |
| allowNextWhenNoAriaActive | Boolean | false  | 当为true时，即使元素的aria-activedescendant没有值，也允许跳转 |

另外，组件支持所有 el-table 的 props，如 data、border、stripe 等。

## Events

| 事件名      | 参数                                   | 说明                                                              |
| ----------- | -------------------------------------- | ----------------------------------------------------------------- |
| noNextInput | element: HTMLElement, rowIndex: number | 当用户在最后一个输入元素上按下Enter键时触发，提供当前元素和行索引 |

此外，组件支持所有 el-table 的事件。

## Methods

| 方法名      | 参数 | 返回值 | 说明                                              |
| ----------- | ---- | ------ | ------------------------------------------------- |
| refreshRows | 无   | 无     | 手动刷新行收集，在动态添加/删除表格行后调用此方法 |

## 注意事项

1. 在动态添加或删除表格行后，建议调用 `refreshRows()` 方法刷新组件的行收集
2. 组件仅监听表格内的 input 和 select 元素，其他元素不会被监听
3. 确保表格中的输入元素是可聚焦的，否则无法通过回车键进行导航

## 工作原理

1. 组件在挂载和更新后收集表格中所有的行元素
2. 为每一行创建一个 EnterNextContainer 实例，使用 virtualRef 绑定到行元素
3. 当用户在表格中按下回车键时：
   - 由 EnterNextContainer 处理导航逻辑
   - 如果当前行中没有下一个元素，TableEnterNext 组件会通过事件通知父组件

## 示例

查看 `Example.vue` 文件获取更多使用示例。
