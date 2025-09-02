<template>
  <div class="container" style="height: 350px;">
    <ElButton @click="visible = true">自定义位置弹窗</ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="自定义位置"
      content="通过 top 和 left 属性设置自定义位置，支持像素值和百分比"
      :top="100"
      :left="'30%'"
      :width="400"
      :height="300"
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
