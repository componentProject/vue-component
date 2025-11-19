# CardReader 读卡组件

一个基于Element Plus的读卡组件，包含输入框和读卡按钮，点击读卡按钮会触发读卡事件，具体的读卡逻辑需要用户自行实现。

## 基础示例

```vue
<template>
  <CardReader v-model="cardValue" @read-success="handleReadSuccess" @read-error="handleReadError" />
</template>

<script setup>
import { ref } from 'vue'

const cardValue = ref('')

function handleReadSuccess(data) {
  console.log('读卡成功:', data)
}

function handleReadError(error) {
  console.error('读卡失败:', error)
}
</script>
```

## Props

| 属性名      | 说明           | 类型    | 默认值         |
| ----------- | -------------- | ------- | -------------- |
| modelValue  | 输入框的值（v-model） | string  | ''             |
| buttonText  | 读卡按钮文字   | string  | '读卡'         |
| placeholder | 输入框占位符   | string  | '请输入或读卡' |
| disabled    | 是否禁用       | boolean | false          |

## Events

| 事件名          | 说明           | 回调参数                |
| --------------- | -------------- | ----------------------- |
| update:modelValue | 输入框值变化时触发 | `(value: string) => void` |
| readSuccess     | 读卡成功时触发 | `(data: any) => void`   |
| readError       | 读卡失败时触发 | `(error: any) => void`  |

## 使用说明

### 基础使用

最简单的使用方式，只需要绑定v-model：

```vue
<template>
  <CardReader v-model="cardValue" />
</template>

<script setup>
import { ref } from 'vue'

const cardValue = ref('')
</script>
```

### 自定义按钮文字和占位符

```vue
<template>
  <CardReader
    v-model="cardValue"
    button-text="读取卡片"
    placeholder="请点击按钮读卡"
  />
</template>
```

### 实现读卡逻辑

组件提供了`readSuccess`和`readError`事件，你需要在组件外部实现具体的读卡逻辑，并通过事件监听来处理读卡结果：

```vue
<template>
  <CardReader
    v-model="cardValue"
    @read-success="handleReadSuccess"
    @read-error="handleReadError"
  />
</template>

<script setup>
import { ref } from 'vue'

const cardValue = ref('')

function handleReadSuccess(data) {
  console.log('读卡成功:', data)
  // 处理读卡成功逻辑
}

function handleReadError(error) {
  console.error('读卡失败:', error)
  // 处理读卡失败逻辑
}
</script>
```

## Expose

无。

