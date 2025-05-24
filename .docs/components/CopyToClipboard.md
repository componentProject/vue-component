---
title: 复制到剪贴板
description: CopyToClipboard 复制到剪贴板组件，用于将文本复制到系统剪贴板
date: 2025-01-27
tags:
  - 组件
---

# 复制到剪贴板组件

CopyToClipboard 组件用于在用户点击时将指定文本复制到系统剪贴板，提高用户体验。

## 基础用法

基础的复制到剪贴板组件用法，点击元素时会复制指定的文本。

:::demo
```vue
<template>
  <div class="copy-demo">
    <p>点击下面的按钮复制文本：<span class="copy-text">{{ text }}</span></p>
    <CopyToClipboard :text="text">
      <el-button type="primary">复制</el-button>
    </CopyToClipboard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('这是要复制的文本内容')
</script>

<style scoped>
.copy-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.copy-text {
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  color: #409EFF;
  font-family: monospace;
}
</style>
```
:::

## 自定义复制成功提示

通过 `onSuccess` 属性可以自定义复制成功后的操作，比如显示自定义提示。

:::demo
```vue
<template>
  <div class="copy-demo">
    <p>点击下面的按钮复制文本并显示自定义提示：</p>
    <CopyToClipboard :text="text" :on-success="handleSuccess">
      <el-button type="primary">复制</el-button>
    </CopyToClipboard>
    <div v-if="showSuccess" class="success-message">
      <el-alert
        title="复制成功！"
        type="success"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('这是要复制的文本内容')
const showSuccess = ref(false)

const handleSuccess = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}
</script>

<style scoped>
.copy-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.success-message {
  width: 100%;
  margin-top: 10px;
}
</style>
```
:::

## 复制输入框内容

结合输入框使用，可以让用户复制自己输入的内容。

:::demo
```vue
<template>
  <div class="copy-demo">
    <el-input v-model="inputText" placeholder="请输入要复制的内容" style="width: 300px;">
      <template #append>
        <CopyToClipboard :text="inputText" :on-success="() => $message.success('复制成功')">
          <el-button>复制</el-button>
        </CopyToClipboard>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')
</script>

<style scoped>
.copy-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
</style>
```
:::

## 使用不同的触发元素

复制组件可以包裹任何元素作为触发复制的元素。

:::demo
```vue
<template>
  <div class="copy-demo">
    <p>代码示例：</p>
    <div class="code-block">
      <pre><code>const greeting = 'Hello World!';</code></pre>
      <CopyToClipboard text="const greeting = 'Hello World!';" :on-success="() => $message.success('代码已复制')">
        <el-button class="copy-icon" circle size="small">
          <i class="el-icon-document-copy"></i>
        </el-button>
      </CopyToClipboard>
    </div>
  </div>
</template>

<style scoped>
.copy-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.code-block {
  position: relative;
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 16px;
  width: 100%;
}
.code-block pre {
  margin: 0;
  font-family: monospace;
}
.copy-icon {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
```
:::

## 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| text | 要复制的文本内容 | string | — | — |
| onSuccess | 复制成功时的回调函数 | function | — | — |
| onError | 复制失败时的回调函数 | function | — | — |
| options | 复制选项，参考 copy-to-clipboard 库的选项 | object | — | {} |

## 插槽

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 触发复制操作的元素 | — |
</rewritten_file> 