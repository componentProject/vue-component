<!-- medium.vue文件 -->
<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">
      中等尺寸弹窗
    </ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="中等尺寸弹窗"
      content="这是一个中等尺寸的弹窗，宽度为520px"
      size="medium"
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
