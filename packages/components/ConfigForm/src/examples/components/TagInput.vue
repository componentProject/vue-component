<!--
  TagInput - 自定义标签输入组件示例
  演示如何创建符合 ConfigForm 规范的自定义组件
-->
<template>
  <div class="tag-input" :class="{ 'tag-input--disabled': disabled, 'tag-input--readonly': readonly }">
    <!-- 已添加的标签 -->
    <div class="tag-input__tags">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="tag-input__tag"
      >
        {{ tag }}
        <span
          v-if="!disabled && !readonly"
          class="tag-input__tag-close"
          @click="removeTag(index)"
        >
          ×
        </span>
      </span>
    </div>

    <!-- 输入框 -->
    <input
      v-if="!disabled && !readonly"
      ref="inputRef"
      v-model="inputValue"
      class="tag-input__input"
      :placeholder="placeholder"
      :maxlength="maxTagLength"
      @keydown.enter.prevent="addTag"
      @keydown.delete="handleBackspace"
      @focus="handleFocus"
      @blur="handleBlur"
    >

    <!-- 只读模式下显示空提示 -->
    <span v-if="(disabled || readonly) && tags.length === 0" class="tag-input__empty">
      暂无标签
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * TagInput - 标签输入组件
 * 符合 ConfigForm 自定义组件规范：
 * - 支持 v-model (modelValue)
 * - 支持 disabled 和 readonly 状态
 * - 触发 change、focus、blur 事件
 */
import { computed, ref } from 'vue'

defineOptions({
  name: 'TagInput',
})

const props = withDefaults(defineProps<{
  /** 绑定值（标签数组） */
  modelValue?: string[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 最大标签数量 */
  maxTags?: number
  /** 单个标签最大长度 */
  maxTagLength?: number
  /** 分隔符（支持按指定字符分割输入） */
  separator?: string
}>(), {
  modelValue: () => [],
  disabled: false,
  readonly: false,
  placeholder: '输入后按 Enter 添加标签',
  maxTags: 10,
  maxTagLength: 20,
  separator: '',
})

const emit = defineEmits<{
  /** 值更新事件（用于 v-model） */
  (e: 'update:modelValue', value: string[]): void
  /** 值变化事件 */
  (e: 'change', value: string[]): void
  /** 聚焦事件 */
  (e: 'focus'): void
  /** 失焦事件 */
  (e: 'blur'): void
}>()

/** 输入框引用 */
const inputRef = ref<HTMLInputElement>()

/** 当前输入值 */
const inputValue = ref('')

/** 标签列表（计算属性，支持双向绑定） */
const tags = computed({
  get: () => props.modelValue || [],
  set: (value: string[]) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

/**
 * 添加标签
 * 支持按分隔符分割添加多个标签
 */
function addTag() {
  const value = inputValue.value.trim()
  if (!value) {
    return
  }

  // 检查是否超过最大数量
  if (tags.value.length >= props.maxTags) {
    return
  }

  // 支持分隔符分割
  const newTags = props.separator
    ? value.split(props.separator).map(t => t.trim()).filter(Boolean)
    : [value]

  // 过滤重复和超长的标签
  const validTags = newTags.filter((tag) => {
    return tag.length <= props.maxTagLength
      && !tags.value.includes(tag)
      && tags.value.length + 1 <= props.maxTags
  })

  if (validTags.length > 0) {
    tags.value = [...tags.value, ...validTags]
  }

  inputValue.value = ''
}

/**
 * 删除标签
 * @param index - 标签索引
 */
function removeTag(index: number) {
  const newTags = [...tags.value]
  newTags.splice(index, 1)
  tags.value = newTags
}

/**
 * 处理退格键
 * 当输入框为空时，删除最后一个标签
 */
function handleBackspace() {
  if (inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
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
  // 失焦时自动添加未提交的输入
  if (inputValue.value.trim()) {
    addTag()
  }
  emit('blur')
}

/**
 * 聚焦输入框（暴露给父组件）
 */
function focus() {
  inputRef.value?.focus()
}

defineExpose({
  focus,
})
</script>

<style scoped>
.tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  min-height: 32px;
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 4px;
  background-color: var(--el-fill-color-blank, #fff);
  transition: border-color 0.2s;
}

.tag-input:focus-within {
  border-color: var(--el-color-primary, #409eff);
}

.tag-input--disabled {
  background-color: var(--el-fill-color-light, #f5f7fa);
  cursor: not-allowed;
}

.tag-input--readonly {
  background-color: transparent;
  border-color: transparent;
}

.tag-input__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 12px;
  color: var(--el-color-primary, #409eff);
  background-color: var(--el-color-primary-light-9, #ecf5ff);
  border: 1px solid var(--el-color-primary-light-8, #d9ecff);
  border-radius: 4px;
}

.tag-input__tag-close {
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: var(--el-color-primary, #409eff);
  transition: color 0.2s;
}

.tag-input__tag-close:hover {
  color: var(--el-color-danger, #f56c6c);
}

.tag-input__input {
  flex: 1;
  min-width: 80px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--el-text-color-primary, #303133);
}

.tag-input__input::placeholder {
  color: var(--el-text-color-placeholder, #a8abb2);
}

.tag-input__empty {
  color: var(--el-text-color-secondary, #909399);
  font-size: 14px;
}
</style>

