<template>
  <div class="container" style="height: 100px;">
    <ElButton type="primary" @click="visible = true">
      打开基础弹窗
    </ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="欢迎使用"
      content="这是一个基础的 DragModalDialog 弹窗组件示例"
      size="medium"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'

const visible = ref(false)

function handleConfirm() {
  console.log('确认按钮被点击')
  visible.value = false
}

function handleCancel() {
  console.log('取消按钮被点击')
  visible.value = false
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
