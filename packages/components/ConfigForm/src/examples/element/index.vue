<!-- ElementPlusExample - Element Plus 配置化表单示例 -->
<template>
  <div class="config-form-example">
    <!-- 示例切换 Tab -->
    <ElTabs v-model="activeTab" type="border-card" class="example-tabs">
      <!-- Tab 1: 完整表单示例 -->
      <ElTabPane label="完整表单" name="full">
        <FullFormExample ref="fullFormRef" />
      </ElTabPane>

      <!-- Tab 2: 搜索栏示例 -->
      <ElTabPane label="搜索栏布局" name="search">
        <SearchLayoutExample />
      </ElTabPane>

      <!-- Tab 3: 自定义组件示例 -->
      <ElTabPane label="自定义组件" name="custom">
        <CustomComponentExample />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import CustomComponentExample from './CustomComponentExample.vue'
import FullFormExample from './FullFormExample.vue'
import SearchLayoutExample from './SearchLayoutExample.vue'

defineOptions({
  name: 'ElementPlusExample',
})

// 当前激活的 Tab
const activeTab = ref('full')

// 完整表单示例引用（用于外部访问 formRef）
const fullFormRef = ref<InstanceType<typeof FullFormExample>>()

// 暴露 formRef 给外部访问
defineExpose({
  get formRef() {
    return fullFormRef.value?.formRef
  },
})
</script>

<style scoped>
.config-form-example {
  padding: 16px;
}

.example-tabs {
  min-height: 600px;
}
</style>
