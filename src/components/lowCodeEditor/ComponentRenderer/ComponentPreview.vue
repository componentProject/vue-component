<template>
  <div class="component-preview-container">
    <!-- 渲染页面组件 -->
    <template v-if="pageSchema.components.length">
      <component-preview-node
        v-for="component in pageSchema.components"
        :key="component.id"
        :component="component"
      />
    </template>

    <!-- 无组件时显示提示 -->
    <div v-else class="empty-preview flex items-center justify-center text-gray-400 h-full">
      <p>暂无组件可预览</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PageSchema } from '../types'
import ComponentPreviewNode from './ComponentPreviewNode.vue'

// 组件属性定义
const props = defineProps<{
  pageSchema: PageSchema
}>()
</script>

<style scoped>
.component-preview-container {
  min-height: 100%;
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  overflow: auto;
}

.empty-preview {
  min-height: 200px;
}
</style>
