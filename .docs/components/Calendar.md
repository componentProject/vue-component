:::demo

```vue

<template>
  <Calendar :locale="locale" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'

  const locale = ref('zh-CN')
</script>
```
:::