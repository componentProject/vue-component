<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">小尺寸弹窗</ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="小尺寸弹窗"
      content="这是一个小尺寸的弹窗，宽度为400px"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'

const visible = ref(false)
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
