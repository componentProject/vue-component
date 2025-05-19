<template>
  <div class="component-preview">
    <!-- 渲染不同类型的组件预览 -->
    <component
      :is="resolveComponentType()"
      v-bind="componentProps"
      :class="{ 'preview-selected': selected }"
    >
      <!-- 处理有默认插槽的组件 -->
      <template v-if="hasDefaultSlot">
        {{ defaultSlotContent }}
      </template>
      
      <!-- 处理命名插槽的组件 -->
      <template v-for="(slot, name) in resolvedSlots" :key="name" #[name]>
        <slot-preview :slot-name="name" :slot-content="slot" />
      </template>
    </component>
    
    <!-- 组件类型标签，仅在选中时显示 -->
    <div v-if="selected" class="component-type-badge">
      {{ component.type }}
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件预览
 * 根据组件类型渲染不同的预览内容
 */
import { computed } from 'vue';
import { componentRegistry } from '../utils/componentRegistry';
import type { Component } from '../types';
import { logInfo, logError } from '../utils/logger';
import SlotPreview from './SlotPreview.vue';

// 定义属性
const props = defineProps<{
  component: Component;
  selected: boolean;
}>();

/**
 * 根据组件类型解析实际渲染的组件类型
 * @returns 组件类型字符串
 */
const resolveComponentType = () => {
  try {
    // 从注册表中获取组件定义
    const componentDef = componentRegistry.getComponent(props.component.type);
    
    // 图表类型组件使用统一的预览组件
    if (componentDef?.category === 'chart') {
      return 'chart-preview';
    }
    
    // 返回实际组件类型
    return props.component.type;
  } catch (error) {
    logError('Failed to resolve component type', error);
    return 'div'; // 默认使用div
  }
};

/**
 * 计算组件属性
 */
const componentProps = computed(() => {
  try {
    // 获取组件定义以合并默认属性
    const componentDef = componentRegistry.getComponent(props.component.type);
    
    // 合并默认属性和组件配置的属性
    return {
      ...componentDef?.defaultProps,
      ...props.component.props
    };
  } catch (error) {
    logError('Failed to compute component props', error);
    return props.component.props || {};
  }
});

/**
 * 检查组件是否有默认插槽内容
 */
const hasDefaultSlot = computed(() => {
  try {
    // 检查组件定义中是否定义了默认插槽
    const componentDef = componentRegistry.getComponent(props.component.type);
    return componentDef?.slots?.some(slot => slot.name === 'default') ?? false;
  } catch (error) {
    logError('Failed to check for default slot', error);
    return false;
  }
});

/**
 * 默认插槽内容
 */
const defaultSlotContent = computed(() => {
  try {
    // 获取组件类型以确定默认内容
    const type = props.component.type;
    
    // 根据组件类型提供不同的默认内容
    switch (type) {
      case 'el-button':
        return props.component.props.text || '按钮';
      case 'el-link':
        return props.component.props.text || '链接';
      case 'el-tag':
        return props.component.props.text || '标签';
      default:
        return '';
    }
  } catch (error) {
    logError('Failed to compute default slot content', error);
    return '';
  }
});

/**
 * 解析组件的命名插槽配置
 */
const resolvedSlots = computed(() => {
  try {
    if (!props.component.slots) return {};
    
    // 返回插槽配置
    return props.component.slots;
  } catch (error) {
    logError('Failed to resolve named slots', error);
    return {};
  }
});
</script>

<style scoped>
.component-preview {
  @apply relative w-full h-full;
}

.preview-selected {
  @apply outline-none;
}

.component-type-badge {
  @apply absolute -top-8 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-md;
  z-index: 10;
}
</style> 