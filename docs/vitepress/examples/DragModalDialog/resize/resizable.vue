<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">可缩放弹窗</ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="可缩放弹窗"
      content="开启 resizable 后，可以通过8个方向的调整手柄改变弹窗大小"
      resizable
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'
import { ElButton } from 'element-plus'

const visible = ref(false)
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
