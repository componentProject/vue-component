<template>
  <div class="demo-container">
    <div style="text-align: center;margin-bottom: 10px;">
      <TsButton type="primary" @click="saveConfig">
        保存表单配置
      </TsButton>
    </div>
    <div style="height: 350px">
      <DesignForm ref="designFormRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const designFormRef = ref(null)
function saveConfig() {
  const finalFormConfig = designFormRef.value?.getFinalFormConfig()
  if (finalFormConfig) {
    console.log('finalFormConfig', finalFormConfig)
    ElMessage.success('保存成功')
  }
  else {
    console.log('finalFormConfig', finalFormConfig)
    ElMessage.error('保存失败')
  }
}
</script>
