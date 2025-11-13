<!-- remember-position.vue文件 -->
<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">
      位置记忆示例
    </ElButton>
    <ElButton style="margin-left: 10px;" @click="clearPosition">
      清除位置记忆
    </ElButton>

    <p style="margin: 10px 0; color: #666;">
      拖拽或调整大小后关闭，再次打开会记住上次的位置和大小
    </p>

    <DragModalDialog
      ref="dialogRef"
      v-model:visible="visible"
      title="位置记忆"
      content="开启 rememberPosition 后，会记住对话框的位置和大小"
      draggable
      resizable
      remember-position
      position-key="demo-remember-position"
    />
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'

import { ref } from 'vue'

const visible = ref(false)
const dialogRef = ref()

function clearPosition() {
  if (dialogRef.value) {
    dialogRef.value.clearPosition()
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
