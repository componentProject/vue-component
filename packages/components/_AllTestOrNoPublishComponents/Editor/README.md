# Editor 代码编辑器组件（Monaco）

## 组件简介

基于 Monaco Editor 的轻量封装，支持两种双向绑定方式：

- `v-model`（默认，绑定到 `modelValue`）
- `v-model:code`（可选，绑定到 `code`）

并提供 `language` 属性用于切换编辑语言。

## 支持的语言

- JS/TS 家族：`js` | `javascript` | `jsx` → 映射为 Monaco 的 `javascript`；`ts` | `typescript` | `tsx` → 映射为 `typescript`
- SQL 及方言：`sql` | `mysql` | `postgres` | `postgresql` | `mssql` | `plsql` | `oracle` | `sqlite` | `mariadb` → 统一映射为 `sql`

## 用法示例

### 方式一：使用默认 v-model

```vue
<template>
  <div style="height: 400px">
    <Editor v-model="source" language="js" />
  </div>
</template>

<script setup lang="ts">
import Editor from '@moluoxixi/editor'

const source = ref(`function hello() {\n  console.log('hello')\n}`)
</script>
```

### 方式二：使用 v-model:code

```vue
<template>
  <div style="height: 400px">
    <Editor v-model:code="source" language="sql" />
  </div>
</template>

<script setup lang="ts">
import Editor from '@moluoxixi/editor'

const source = ref('SELECT * FROM table_name')
</script>
```

## Props

- `language`: 'js' | 'sql'，默认 'js'
- `modelValue`: string，和 `v-model` 搭配
- `code`: string，和 `v-model:code` 搭配

说明：组件内部会同时触发 `update:modelValue` 与 `update:code` 事件，外部使用任意一种 v-model 即可，不建议同时对两者都进行绑定。

## 注意

- 组件高度由父容器控制，请为外层容器设置明确的高度。
- 运行时切换 `language` 会自动更新编辑器的语法高亮与语言服务。
- JSX 与 TSX 分别由 `javascript` 与 `typescript` 语言服务支持，按上表别名映射即可。
