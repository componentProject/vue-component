# Tree 树组件

基于 ElTreeV2 的增强树形组件，支持扁平/嵌套数据、行内操作按钮、自定义图标、级联高亮与连线样式。

## 基础示例

```vue
<template>
  <Tree :data="treeData" label-field="name" children-field="children" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const treeData = ref([
  { id: 1, name: '父节点', children: [{ id: 11, name: '子节点' }] },
])
</script>
```

## API

### Props

| 参数          | 说明                                           | 类型                            | 默认值     |
| ------------- | ---------------------------------------------- | ------------------------------- | ---------- | ----------------------- | -------------------------- | ----------------------------------------------- | --- |
| data          | 树数据（扁平或嵌套）                           | any[]                           | []         |
| childrenField | 子节点字段名                                   | string                          | 'children' |
| rowField      | 行主键字段名                                   | string                          | 'id'       |
| parentField   | 父主键字段名（与 `rowField` 同用时自动构建树） | string                          | ''         |
| labelField    | 显示文本字段名                                 | string                          | 'label'    |
| childIcon     | 叶子节点图标                                   | Component \| string             | -          |
| parentIcon    | 非叶子节点图标                                 | Component \| string             | -          |
| icon          | 根据行数据返回图标                             | `(row:any)=>Component           | string`    | -                       |
| showType      | 行按钮展示方式                                 | 'hover' \| 'click' \| 'default' | 'default'  |
| buttons       | 行按钮                                         | `(row:any)=>{ type?:'add'       | 'edit'     | 'delete'; slot?: string | Function; icon?: Component | string; event?: Function; tooltip?: string }[]` | -   |
| indent        | 每级缩进(px)                                   | number                          | 16         |
| showLine      | 显示父子连线                                   | boolean                         | false      |
| showRowLine   | 显示行内延伸线                                 | boolean                         | false      |
| levelSelect   | 级联高亮并触发 `change`                        | boolean                         | false      |

### Events

| 事件名       | 说明                               | 回调参数                                       |
| ------------ | ---------------------------------- | ---------------------------------------------- |
| `node-click` | 点击节点行                         | `(data:any, node:any, evt:MouseEvent) => void` |
| `change`     | 级联高亮变化（`levelSelect=true`） | `(rows:any[]) => void`                         |

### Slots

| 名称      | 说明                             | 作用域           |
| --------- | -------------------------------- | ---------------- |
| `default` | 整行自定义渲染                   | `{ node, data }` |
| `label`   | 标签文本渲染                     | `{ node, data }` |
| `[动态]`  | 与 `buttons.slot` 对应的具名插槽 | `{ node, data }` |

### Expose

| 名称      | 说明                   |
| --------- | ---------------------- |
| `getTree` | 获取内部 ElTreeV2 实例 |
