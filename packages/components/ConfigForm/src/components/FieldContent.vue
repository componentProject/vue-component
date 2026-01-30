<!-- FieldContent - 字段内容渲染组件 -->
<template>
  <div class="config-form-field">
    <!-- 前缀插槽 -->
    <slot :name="`field-prefix-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" />

    <!-- 自定义字段插槽 -->
    <template v-if="$slots[`field-${fieldName}`]">
      <slot :name="`field-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" :disabled="isDisabled" :readonly="isReadonly" :read-pretty="isReadPretty" />
    </template>

    <!-- ReadPretty 模式 - 纯文本展示（业界标准做法） -->
    <template v-else-if="isReadPretty">
      <div
        class="config-form-field__read-pretty"
        :class="readPrettyClass"
        :style="readPrettyStyle"
      >
        <!-- 颜色字段特殊展示 -->
        <template v-if="field.type === 'color' && fieldValue">
          <span class="config-form-field__color-preview" :style="{ backgroundColor: fieldValue }" />
          <span class="config-form-field__text">{{ fieldValue }}</span>
        </template>
        <!-- 上传字段特殊展示 -->
        <template v-else-if="field.type === 'upload' && Array.isArray(fieldValue)">
          <div class="config-form-field__files">
            <span v-for="(file, index) in fieldValue" :key="index" class="config-form-field__file">
              {{ file.name || file.url || file }}
            </span>
          </div>
        </template>
        <!-- 文本域多行展示 -->
        <template v-else-if="field.type === 'textarea'">
          <div class="config-form-field__textarea-preview">
            {{ formattedValue }}
          </div>
        </template>
        <!-- 富文本预览 -->
        <template v-else-if="field.type === 'richText'">
          <div class="config-form-field__rich-text-preview" v-html="formattedValue" />
        </template>
        <!-- 代码预览 -->
        <template v-else-if="field.type === 'codeEditor'">
          <pre class="config-form-field__code-preview"><code>{{ formattedValue }}</code></pre>
        </template>
        <!-- 默认文本展示 -->
        <template v-else>
          <span class="config-form-field__text">{{ formattedValue }}</span>
        </template>
      </div>
    </template>

    <!-- 标准字段组件 -->
    <template v-else>
      <!-- 使用动态组件渲染所有字段 -->
      <component
        :is="fieldComponent"
        :model-value="fieldValue"
        :disabled="isDisabled"
        :readonly="isReadonly"
        v-bind="computedComponentProps"
        @update:model-value="handleModelUpdate"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <!-- Select/Radio/Checkbox 的选项渲染 (通过子组件方式，如 Element Plus) -->
        <template v-if="hasOptions && !useOptionsAsProps">
          <component
            :is="getOptionComponent(field.type)"
            v-for="opt in computedOptions"
            :key="opt.value"
            :label="getOptionLabel(field.type, opt)"
            :value="opt.value"
            :disabled="opt.disabled"
          >
            <template v-if="needsOptionContent">
              {{ opt.label }}
            </template>
          </component>
        </template>
      </component>
    </template>

    <!-- 后缀插槽 -->
    <slot :name="`field-suffix-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { FieldConfig, FormContext } from '../types'

defineOptions({
  name: 'FieldContent',
})

interface OptionItem {
  label: string
  value: any
  disabled?: boolean
}

const props = defineProps<{
  /** 字段配置 */
  field: FieldConfig
  /** 字段名称 */
  fieldName: string
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
  /** 字段值 */
  fieldValue: any
  /** 是否禁用 */
  isDisabled: boolean
  /** 是否只读 */
  isReadonly: boolean
  /** 是否阅读态 */
  isReadPretty: boolean
  /** 格式化后的值 */
  formattedValue: string | number
  /** ReadPretty 模式下的 class */
  readPrettyClass: string
  /** ReadPretty 模式下的 style */
  readPrettyStyle: Record<string, any> | string
  /** 字段组件 */
  fieldComponent: Component | string
  /** 计算后的组件属性 */
  computedComponentProps: Record<string, any>
  /** 是否有选项 */
  hasOptions: boolean
  /** 是否通过 props 传递选项 */
  useOptionsAsProps: boolean
  /** 计算后的选项 */
  computedOptions: OptionItem[]
  /** 是否需要选项内容 */
  needsOptionContent: boolean
  /** 获取选项组件的函数 */
  getOptionComponent: (type: string) => Component | string
  /** 获取选项 label 的函数 */
  getOptionLabel: (type: string, opt: OptionItem) => string | any
}>()

const emit = defineEmits<{
  (e: 'change', value: any): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

/**
 * 处理 v-model 更新
 */
function handleModelUpdate(value: any) {
  emit('change', value)
}

/**
 * 处理 change 事件
 */
function handleChange(value: any) {
  emit('change', value)
}

/**
 * 处理聚焦
 */
function handleFocus() {
  emit('focus')
}

/**
 * 处理失焦
 */
function handleBlur() {
  emit('blur')
}
</script>

<style scoped>
.config-form-field {
  display: flex;
  align-items: center;
  width: 100%;
}

/* ReadPretty 模式样式 - 纯文本展示（业界标准做法） */
.config-form-field__read-pretty {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 32px;
  line-height: 32px;
  color: var(--el-text-color-primary, #303133);
  width: 100%;
  box-sizing: border-box;
}

.config-form-field__text {
  word-break: break-word;
}

.config-form-field__color-preview {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color, #dcdfe6);
  margin-right: 8px;
  flex-shrink: 0;
}

.config-form-field__textarea-preview {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.config-form-field__files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.config-form-field__file {
  padding: 4px 8px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
  font-size: 12px;
}

.config-form-field__rich-text-preview {
  line-height: 1.6;
  word-break: break-word;
}

.config-form-field__rich-text-preview :deep(p) {
  margin: 0 0 0.5em;
}

.config-form-field__rich-text-preview :deep(ul),
.config-form-field__rich-text-preview :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.config-form-field__code-preview {
  margin: 0;
  padding: 12px;
  background-color: var(--el-fill-color-darker, #1e1e1e);
  border-radius: 4px;
  overflow-x: auto;
  width: 100%;
}

.config-form-field__code-preview code {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-color-white, #fff);
  white-space: pre;
}
</style>

