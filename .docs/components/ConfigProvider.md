:::demo
```vue
<template>
  <ConfigProvider :space="space">
    <Space>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </Space>
  </ConfigProvider>

  <el-radio-group class="mt--4" v-model="space">
    <el-radio-button label="small">small</el-radio-button>
    <el-radio-button label="medium">medium</el-radio-button>
    <el-radio-button label="large">large</el-radio-button>
    <el-radio-button label="32">32</el-radio-button>
  </el-radio-group>
</template>
<script setup>
  import { ref } from 'vue'
  const space = ref('small')
</script>
```
:::

:::demo
```vue
<template>
  <ConfigProvider :locale="locale">
    <Calendar />
  </ConfigProvider>

  <el-radio-group class="mt--4" v-model="locale">
    <el-radio-button label="zh-CN">中文</el-radio-button>
    <el-radio-button label="en-US">English</el-radio-button>
  </el-radio-group>
</template>
<script setup>
  import { ref } from 'vue'
  const locale = ref('zh-CN')
</script>
```
:::

# props

| 参数    | 说明   | 类型    | 可选值                                             | 默认值  |
| ------- | ------ | ------- | -------------------------------------------------- | ------- |

# events

| 事件名 | 说明 | 回调参数 | 默认值 |
| ------- | ------ | ------- | ------- |
