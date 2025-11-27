<!-- CardReader的示例文件 -->
<template>
  <div class="space-y-6">
    <!-- 自定义按钮文字和占位符 -->
    <CardReader
      button-text="读取身份证"
      plugin-type="idCard"
      fun-name="readIdCard"
      @read-success="handleReadSuccess"
      @read-error="handleReadError"
    />
  </div>
</template>

<script setup lang="ts">
import CardReader from './index.vue'
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
