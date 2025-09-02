<template>
  <div class="container" style="height: 350px;">
    <ElButton @click="visible = true">大尺寸弹窗</ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="大尺寸弹窗"
      content="这是一个大尺寸的弹窗，宽度为720px"
      size="large"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
