<!-- CardReader的示例文件 -->
<template>
  <div class="space-y-6">
    <!-- 自定义按钮文字和占位符 -->
    <div>
      <h3 class=" font-semibold mb-4">
        自定义按钮文字和占位符和事件处理示例
      </h3>
      <CardReader
        v-model="cardValue"
        button-text="读取卡片"
        placeholder="请点击按钮读卡"
        @read-success="handleReadSuccess"
        @read-error="handleReadError"
      />
      <p class="mt-2 text-gray-600">
        当前值: {{ cardValue2 }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardReader from './index.vue'

const cardValue = ref('')

/**
 * 处理读卡成功
 * @param data - 读卡数据
 */
function handleReadSuccess(data: any) {
  console.log('读卡成功:', data)
}

/**
 * 处理读卡失败
 * @param error - 错误信息
 */
function handleReadError(error: any) {
  console.error('读卡失败:', error)
}
</script>
