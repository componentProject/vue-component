:::demo

```vue

<template>
  <CopyToClipboard v-bind="props">
    <div>复制</div>
  </CopyToClipboard>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'

  const props = reactive({
    text: 'hello world'
  })
</script>
```
:::

:::
# props

| 参数    | 说明   | 类型    | 可选值                                             | 默认值  |
| ------- | ------ | ------- | -------------------------------------------------- | ------- |

# events

| 事件名 | 说明 | 回调参数 | 默认值 |
| ------- | ------ | ------- | ------- |
