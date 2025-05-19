<template>
  <div class="slot-preview">
    <!-- 插槽名称标签 -->
    <div class="slot-name-badge">
      {{ slotName }}
    </div>
    
    <!-- 渲染插槽内容组件 -->
    <div v-if="slotContent && slotContent.length" class="slot-content">
      <draggable-component
        v-for="component in slotContent"
        :key="component.id"
        :component="component"
        :is-selected="false"
      />
    </div>
    
    <!-- 空插槽占位内容 -->
    <div v-else class="empty-slot">
      <el-empty :image-size="32" description="空插槽">
        <span class="drop-hint">拖放组件到此处</span>
      </el-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 插槽预览组件
 * 用于渲染组件插槽的内容
 */
import type { Component } from '../types';
import { logInfo, logError } from '../utils/logger';

// 定义属性
const props = defineProps<{
  slotName: string;
  slotContent: Component[];
}>();
</script>

<style scoped>
.slot-preview {
  @apply relative p-2 min-h-16 border border-dashed border-gray-300 rounded;
}

.slot-name-badge {
  @apply absolute -top-2 left-2 bg-gray-100 text-xs px-1 text-gray-600 rounded;
  z-index: 5;
}

.slot-content {
  @apply p-1;
}

.empty-slot {
  @apply flex items-center justify-center h-16;
}

.drop-hint {
  @apply text-xs text-gray-400;
}
</style> 