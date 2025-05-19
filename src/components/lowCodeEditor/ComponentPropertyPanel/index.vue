<template>
  <div class="component-property-panel">
    <div class="panel-header px-4 py-3 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-700">属性面板</h3>
    </div>

    <div class="panel-body p-4 overflow-y-auto">
      <!-- 未选中组件时的提示 -->
      <div v-if="!selectedComponent" class="empty-tip text-center text-gray-500 py-8">
        <el-icon class="text-4xl mb-4"><Monitor /></el-icon>
        <p>请选择一个组件以编辑其属性</p>
      </div>

      <!-- 组件属性编辑表单 -->
      <template v-else>
        <div class="component-info mb-4 pb-2 border-b border-gray-100">
          <div class="flex items-center mb-2">
            <span class="component-icon mr-2">
              <i :class="selectedComponent.icon || 'el-icon-picture'"></i>
            </span>
            <span class="component-name font-medium">{{ selectedComponent.name }}</span>
          </div>
          <div class="component-type text-xs text-gray-500">
            类型: {{ selectedComponent.type }} | ID: {{ selectedComponent.id }}
          </div>
        </div>

        <!-- 分组属性编辑 -->
        <el-tabs class="property-tabs">
          <!-- 基础属性 -->
          <el-tab-pane label="属性" name="props">
            <component-props-editor
              :component="selectedComponent"
              @prop-change="handlePropChange"
            />
          </el-tab-pane>

          <!-- 样式属性 -->
          <el-tab-pane label="样式" name="style">
            <component-style-editor
              :component="selectedComponent"
              @style-change="handleStyleChange"
            />
          </el-tab-pane>

          <!-- 高级属性 -->
          <el-tab-pane label="高级" name="advanced">
            <component-advanced-editor
              :component="selectedComponent"
              @advanced-change="handleAdvancedChange"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Monitor } from '@element-plus/icons-vue'
import type { Component } from '../types'

// 这里仅为了故事演示，实际组件应该实现真正的属性编辑器组件
const ComponentPropsEditor = {
  props: ['component'],
  emits: ['prop-change'],
  template: `
    <div class="prop-editor">
      <p class="text-xs text-gray-400 mb-2">此处仅为演示，实际组件会根据不同组件类型显示对应属性编辑表单</p>
      <div v-for="(value, key) in component.props" :key="key" class="mb-3">
        <div class="prop-label text-sm mb-1">{{ key }}</div>
        <el-input v-model="component.props[key]" @change="$emit('prop-change', key, $event)" />
      </div>
    </div>
  `,
}

const ComponentStyleEditor = {
  props: ['component'],
  emits: ['style-change'],
  template: `
    <div class="style-editor">
      <p class="text-xs text-gray-400 mb-2">这里将显示样式编辑表单</p>
      <div v-if="component.style" v-for="(value, key) in component.style" :key="key" class="mb-3">
        <div class="style-label text-sm mb-1">{{ key }}</div>
        <el-input v-model="component.style[key]" @change="$emit('style-change', key, $event)" />
      </div>
    </div>
  `,
}

const ComponentAdvancedEditor = {
  props: ['component'],
  emits: ['advanced-change'],
  template: `
    <div class="advanced-editor">
      <p class="text-xs text-gray-400 mb-2">高级属性和事件配置</p>
      <div class="mb-3">
        <div class="text-sm mb-1">组件ID</div>
        <el-input :value="component.id" disabled />
      </div>
    </div>
  `,
}

/**
 * 组件属性定义
 */
const props = defineProps<{
  selectedComponent: Component | null
}>()

/**
 * 事件定义
 */
const emit = defineEmits<{
  (e: 'property-changed', componentId: string, propName: string, value: any): void
}>()

/**
 * 处理属性变更
 */
function handlePropChange(propName: string, value: any) {
  try {
    if (props.selectedComponent) {
      emit('property-changed', props.selectedComponent.id, propName, value)
    }
  } catch (error) {
    console.error('属性变更处理失败:', error)
  }
}

/**
 * 处理样式变更
 */
function handleStyleChange(styleName: string, value: any) {
  try {
    if (props.selectedComponent) {
      emit('property-changed', props.selectedComponent.id, `style.${styleName}`, value)
    }
  } catch (error) {
    console.error('样式变更处理失败:', error)
  }
}

/**
 * 处理高级属性变更
 */
function handleAdvancedChange(propName: string, value: any) {
  try {
    if (props.selectedComponent) {
      emit('property-changed', props.selectedComponent.id, propName, value)
    }
  } catch (error) {
    console.error('高级属性变更处理失败:', error)
  }
}
</script>

<style scoped>
.component-property-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.property-tabs :deep(.el-tabs__nav) {
  margin-bottom: 12px;
}

.property-tabs :deep(.el-tabs__header) {
  border-bottom: none;
}
</style>
