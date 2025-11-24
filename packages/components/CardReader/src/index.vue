<!-- CardReader组件主文件 -->
<template>
  <ElInput
    v-model="inputValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
  >
    <template #append>
      <ElButton
        type="primary"
        :disabled="props.disabled"
        @click="handleReadCard"
      >
        {{ props.buttonText }}
      </ElButton>
    </template>
  </ElInput>
</template>

<script setup lang="ts">
import type { emitsType, propsType } from './_types'
import { ElButton, ElInput } from 'element-plus'

defineOptions({
  name: 'CardReader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  buttonText: '读卡',
  placeholder: '请输入或读卡',
  disabled: false,
})

const emit = defineEmits<emitsType>()

const inputValue = defineModel({
  type: String,
  default: '',
})

/**
 * 处理读卡按钮点击事件
 */
function handleReadCard() {
  // 读卡逻辑由用户自行实现
  // /commonSdk/index
  // http://localhost:26784/
}
</script>

<style scoped>
:deep(.el-input-group__append) {
  .el-button {
    background-color: var(--el-button-bg-color);
    border-color: var(--el-button-border-color);
    color: var(--el-button-text-color);
    &:hover {
      background-color: var(--el-button-hover-bg-color);
      border-color: var(--el-button-hover-border-color);
      color: var(--el-button-hover-text-color);
    }
  }
}
</style>
