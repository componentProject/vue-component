<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">可拖拽弹窗</ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="可拖拽弹窗"
      content="开启 draggable 后，可以通过标题栏拖拽移动弹窗位置"
      draggable
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
