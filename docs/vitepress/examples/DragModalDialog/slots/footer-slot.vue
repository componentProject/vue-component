<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">
      自定义底部操作区
    </ElButton>

    <DragModalDialog
      v-model:visible="visible"
      title="自定义底部"
      :show-footer="false"
    >
      <p>这是一个自定义底部操作区的示例</p>
      <p>通过 footer 插槽可以完全自定义底部按钮</p>

      <template #footer>
        <div style="padding: 10px 20px; text-align: right;">
          <ElButton @click="visible = false">
            取消
          </ElButton>
          <ElButton type="success" @click="handleSave">
            保存
          </ElButton>
          <ElButton type="primary" @click="handleSubmit">
            提交
          </ElButton>
        </div>
      </template>
    </DragModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { ElButton } from 'element-plus'

const visible = ref(false)

function handleSave() {
  ElMessage.success('保存成功')
  visible.value = false
}

function handleSubmit() {
  ElMessage.success('提交成功')
  visible.value = false
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
