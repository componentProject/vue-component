# ConfigFromPlayground 配置化表单设计器（基于 form-create designer）

说明：使用 `@form-create/designer` 提供可视化拖拽设计；组件暴露 `getRule()`、`getOption()` 方法导出配置。

## 用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ConfigFromPlayground from '@moluoxixi/components/ConfigFromPlayground'

const pgRef = ref<InstanceType<typeof ConfigFromPlayground>>()
const exported = ref('')

function handleExport() {
  const rule = pgRef.value?.getRule() || []
  const option = pgRef.value?.getOption() || {}
  exported.value = JSON.stringify({ rule, option }, null, 2)
}
</script>

<template>
  <ConfigFromPlayground ref="pgRef" />
  <button @click="handleExport">导出配置</button>
  <pre>{{ exported }}</pre>
</template>
```

> 需要安装依赖：`@form-create/designer`



