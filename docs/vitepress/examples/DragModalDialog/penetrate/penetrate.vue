<template>
  <div class="container" style="height: 350px;">
    <ElButton @click="visible = true">
      遮罩层穿透弹窗
    </ElButton>
    <ElButton type="primary" @click="showMessage">
      测试下方按钮
    </ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="遮罩层穿透"
      content="开启 penetrate 后，点击遮罩层可以触发下方按钮的事件"
      penetrate
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const visible = ref(false)

function showMessage() {
  ElMessage.success('遮罩层穿透成功，可以触发下方元素事件')
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
