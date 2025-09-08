# ConfigFrom 配置化表单（基于 form-create）

说明：基于 `@form-create/element-ui` 封装，传入 `rule` 与 `option` 动态渲染表单。

## 用法

```vue
<script setup lang="ts">
import ConfigFrom from '@moluoxixi/components/ConfigFrom'
import { ref } from 'vue'

const model = ref<Record<string, any>>({})
const rule = ref<any[]>([
  { type: 'input', field: 'name', title: '姓名', props: { placeholder: '请输入姓名' } },
])
const option = ref<Record<string, any>>({ submitBtn: false })
</script>

<template>
  <ConfigFrom v-model="model" :rule="rule" :option="option" />
  <!-- 需要在上层安装依赖：@form-create/element-ui -->
  <!-- pnpm -C packages/components add @form-create/element-ui -w -->
  <!-- 如需设计器：pnpm -C packages/components add @form-create/designer -w -->
  
</template>
```



