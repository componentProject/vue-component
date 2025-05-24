---
title: 水印
description: Watermark 水印组件，用于给内容添加水印
date: 2025-01-27
tags:
  - 组件
---

# 水印组件

Watermark 水印组件用于在页面内容上添加水印，可以防止内容被盗用，支持自定义样式和内容。

## 基础用法

基础的水印组件用法，在内容上添加文字水印。

:::demo
```vue
<template>
  <Watermark :content="['水印示例', '保密文件']">
    <div class="content-container">
      <h3>这是一个带有水印的内容区域</h3>
      <p>
        这是一段示例文本，用于演示水印组件的效果。水印组件可以防止内容被盗用，
        适用于各种需要保护版权或标记内容的场景。
      </p>
      <p>
        水印会自动覆盖在内容的上方，但不会影响内容的正常阅读和交互。当尝试截图
        或复制时，水印会一同被捕获，达到内容保护的目的。
      </p>
    </div>
  </Watermark>
</template>

<style scoped>
.content-container {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  height: 200px;
  overflow: auto;
}
</style>
```
:::