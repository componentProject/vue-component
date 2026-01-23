# FormDesign 表单设计器组件

基于 vue-form-design 改造成的表单设计器组件，用于可视化设计表单。

## 功能特性

- 可视化表单设计
- 支持基础控件和布局控件
- 支持表单预览
- 支持 JSON 导入导出
- 支持快捷键操作
- 支持表单配置面板
- 完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
  <FormDesign
    :basic-fields="basicFields"
    :layout-fields="layoutFields"
    @save="handleSave"
  />
</template>

<script setup>
import { FormDesign } from '@moluoxixi/components'

const basicFields = [
  // 基础控件列表
]

const layoutFields = [
  // 布局控件列表
]

function handleSave(data) {
  console.log('保存的表单配置:', data)
}
</script>
```

## API

### Props

| 参数             | 说明            | 类型          | 默认值                                  |
| ---------------- | --------------- | ------------- | --------------------------------------- |
| basicFields      | 基础控件列表    | `Array`       | `[]`                                    |
| layoutFields     | 布局控件列表    | `Array`       | `[]`                                    |
| shortcutDisabled | 是否禁用快捷键  | `boolean`     | `false`                                 |
| headerShow       | 导航头是否展示  | `boolean`     | `true`                                  |
| menu             | 顶部工具栏配置  | `MenuBarData` | `{ left: [], right: [], column: true }` |
| panel            | 右侧配置属性tab | `Array`       | `["form", "json", "global"]`            |

### Events

| 事件名 | 说明               | 回调参数        |
| ------ | ------------------ | --------------- |
| save   | 保存表单配置时触发 | `(data: Array)` |

### 插槽

| 插槽名     | 说明             |
| ---------- | ---------------- |
| nav        | 导航头插槽       |
| left       | 左侧组件列表插槽 |
| workspace  | 工作区插槽       |
| propsPanel | 右侧属性面板插槽 |
| other      | 其他插槽         |

## 注意事项

1. 组件需要配合 ConfigForm 组件使用
2. 需要先注册表单组件到全局
3. 组件依赖 Element Plus
4. 需要配置相关的样式文件
