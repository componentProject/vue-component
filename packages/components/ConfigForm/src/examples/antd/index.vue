<!-- AntDesignVueExample - Ant Design Vue 配置化表单示例 -->
<template>
  <div class="config-form-example-antd">
    <!-- 示例切换 Tab -->
    <ATabs v-model:active-key="activeTab" type="card" class="example-tabs">
      <!-- Tab 1: 完整表单示例 -->
      <ATabPane key="full" tab="完整表单">
        <FullFormExample ref="fullFormRef" />
      </ATabPane>

      <!-- Tab 2: 搜索栏示例 -->
      <ATabPane key="search" tab="搜索栏布局">
        <SearchLayoutExample />
      </ATabPane>

      <!-- Tab 3: 自定义组件示例 -->
      <ATabPane key="custom" tab="自定义组件">
        <CustomComponentExample />
      </ATabPane>
    </ATabs>
  </div>
</template>

<script setup lang="ts">
import {
  TabPane as ATabPane,
  Tabs as ATabs,
} from 'ant-design-vue'
import { ref } from 'vue'
import CustomComponentExample from './CustomComponentExample.vue'
import FullFormExample from './FullFormExample.vue'
import SearchLayoutExample from './SearchLayoutExample.vue'

defineOptions({
  name: 'AntDesignVueExample',
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
.config-form-example-antd {
  padding: 16px;
}

.example-tabs {
  min-height: 600px;
}
</style>
