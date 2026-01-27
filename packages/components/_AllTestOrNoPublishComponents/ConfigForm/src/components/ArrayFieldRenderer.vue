<!-- ArrayFieldRenderer - 数组字段渲染器 -->
<template>
  <div class="config-form-array">
    <!-- 数组标题 -->
    <div v-if="computedTitle" class="config-form-array__header">
      <span class="config-form-array__title">{{ computedTitle }}</span>
      <span class="config-form-array__count">({{ modelValue?.length || 0 }}项)</span>
    </div>

    <!-- 数组项列表 -->
    <div class="config-form-array__list">
      <TransitionGroup name="array-item">
        <div
          v-for="(item, index) in modelValue"
          :key="getItemKey(item, index)"
          class="config-form-array__item"
        >
          <!-- 排序手柄 -->
          <div v-if="canSort" class="config-form-array__handle">
            <ElIcon><Rank /></ElIcon>
          </div>

          <!-- 数组项内容 -->
          <div class="config-form-array__content">
            <FieldRenderer
              :field="itemField"
              :path="`${path}.${index}`"
              :context="createItemContext(item, index)"
            >
              <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                <slot :name="slotName" v-bind="slotProps" />
              </template>
            </FieldRenderer>
          </div>

          <!-- 数组项操作 -->
          <div class="config-form-array__actions">
            <!-- 复制 -->
            <ElTooltip v-if="canCopy" content="复制" placement="top">
              <ElButton
                type="primary"
                link
                :icon="CopyDocument"
                :disabled="isMaxReached"
                @click="copyItem(index)"
              />
            </ElTooltip>

            <!-- 上移 -->
            <ElTooltip v-if="canMove" content="上移" placement="top">
              <ElButton
                type="primary"
                link
                :icon="ArrowUp"
                :disabled="index === 0"
                @click="moveItem(index, index - 1)"
              />
            </ElTooltip>

            <!-- 下移 -->
            <ElTooltip v-if="canMove" content="下移" placement="top">
              <ElButton
                type="primary"
                link
                :icon="ArrowDown"
                :disabled="index >= (modelValue?.length || 0) - 1"
                @click="moveItem(index, index + 1)"
              />
            </ElTooltip>

            <!-- 删除 -->
            <ElTooltip v-if="canRemove" content="删除" placement="top">
              <ElButton
                type="danger"
                link
                :icon="Delete"
                :disabled="isMinReached"
                @click="removeItem(index)"
              />
            </ElTooltip>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 空状态 -->
    <div v-if="!modelValue?.length" class="config-form-array__empty">
      <ElEmpty description="暂无数据" :image-size="60" />
    </div>

    <!-- 添加按钮 -->
    <div v-if="canAdd && !isMaxReached" class="config-form-array__footer">
      <ElButton
        type="primary"
        :icon="Plus"
        @click="addItem"
      >
        {{ addButtonText }}
      </ElButton>
    </div>

    <!-- 数量限制提示（仅在配置 showLimitTip 或按钮被禁用时显示） -->
    <div v-if="showLimitTipText" class="config-form-array__limit">
      {{ limitTipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArrayFieldConfig, FieldConfig, FormContext } from '../_types'
import { ArrowDown, ArrowUp, CopyDocument, Delete, Plus, Rank } from '@element-plus/icons-vue'
import { ElButton, ElEmpty, ElIcon, ElMessageBox, ElTooltip } from 'element-plus'
import { computed, inject } from 'vue'
import { executeExpression } from '../_utils'
import FieldRenderer from './FieldRenderer.vue'

defineOptions({
  name: 'ArrayFieldRenderer',
})

const props = defineProps<{
  /** 字段配置 */
  field: ArrayFieldConfig
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
}>()

const emit = defineEmits<{
  (e: 'change', value: any[]): void
}>()

const modelValue = defineModel<any[]>({ default: () => [] })

const formHandlers = inject<Record<string, (...args: any[]) => any>>('configFormHandlers', {})

// 数组项字段配置
const itemField = computed<FieldConfig>(() => {
  return props.field.items
})

// 计算标题
const computedTitle = computed(() => {
  if (!props.field.title)
    return undefined
  return executeExpression(props.field.title, props.context, { handlers: formHandlers })
})

// 计算最小项数
const computedMinItems = computed(() => {
  if (props.field.minItems === undefined)
    return 0
  return executeExpression(props.field.minItems, props.context, { handlers: formHandlers })
})

// 计算最大项数
const computedMaxItems = computed(() => {
  if (props.field.maxItems === undefined)
    return Infinity
  return executeExpression(props.field.maxItems, props.context, { handlers: formHandlers })
})

// 操作配置
const operations = computed(() => props.field.operations || {})

// 是否可添加
const canAdd = computed(() => {
  const op = operations.value.add
  if (op === false)
    return false
  return true
})

// 是否可删除
const canRemove = computed(() => {
  const op = operations.value.remove
  if (op === false)
    return false
  return true
})

// 是否可复制
const canCopy = computed(() => {
  return operations.value.copy === true
})

// 是否可移动
const canMove = computed(() => {
  return operations.value.move === true
})

// 是否可排序
const canSort = computed(() => {
  return operations.value.sort === true
})

// 是否达到最大数量
const isMaxReached = computed(() => {
  return (modelValue.value?.length || 0) >= computedMaxItems.value
})

// 是否达到最小数量
const isMinReached = computed(() => {
  return (modelValue.value?.length || 0) <= computedMinItems.value
})

// 添加按钮文本
const addButtonText = computed(() => {
  const op = operations.value.add
  if (typeof op === 'object' && op.text) {
    return op.text
  }
  return '添加'
})

// 数量限制提示文本
const limitTipText = computed(() => {
  const min = computedMinItems.value
  const max = computedMaxItems.value
  const parts: string[] = []
  if (min > 0)
    parts.push(`最少 ${min} 项`)
  if (max < Infinity)
    parts.push(`最多 ${max} 项`)
  return parts.join('，')
})

// 是否显示数量限制提示（仅在达到限制时才显示提示）
const showLimitTipText = computed(() => {
  // 只有当添加或删除按钮被禁用时才显示提示
  return (isMinReached.value && canRemove.value) || (isMaxReached.value && canAdd.value)
})

// 删除确认配置
const removeConfirm = computed(() => {
  const op = operations.value.remove
  if (typeof op === 'object') {
    return {
      enabled: op.confirm !== false,
      text: op.confirmText || '确定要删除这一项吗？',
    }
  }
  return { enabled: false, text: '' }
})

/**
 * 获取数组项的唯一 key
 */
function getItemKey(item: any, index: number): string {
  // 优先使用 item 的 id 或 key 字段
  if (item?.id)
    return String(item.id)
  if (item?.key)
    return String(item.key)
  return `${props.path}-${index}`
}

/**
 * 创建数组项的上下文
 */
function createItemContext(item: any, index: number): FormContext {
  return {
    ...props.context,
    $record: item,
    $index: index,
  }
}

/**
 * 创建默认值
 */
function createDefaultValue(): any {
  const itemConfig = itemField.value

  // 对象类型
  if (itemConfig.type === 'object' && 'properties' in itemConfig) {
    const obj: Record<string, any> = {}
    for (const [key, field] of Object.entries(itemConfig.properties || {})) {
      if (field.default !== undefined) {
        obj[key] = executeExpression(field.default, props.context, { handlers: formHandlers })
      }
    }
    return obj
  }

  // 基础类型
  if (itemConfig.default !== undefined) {
    return executeExpression(itemConfig.default, props.context, { handlers: formHandlers })
  }

  return undefined
}

/**
 * 添加项
 */
function addItem() {
  if (isMaxReached.value)
    return

  const newValue = [...(modelValue.value || []), createDefaultValue()]
  modelValue.value = newValue
  emit('change', newValue)
}

/**
 * 删除项
 */
async function removeItem(index: number) {
  if (isMinReached.value)
    return

  // 确认删除
  if (removeConfirm.value.enabled) {
    try {
      await ElMessageBox.confirm(removeConfirm.value.text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    }
    catch {
      return
    }
  }

  const newValue = [...(modelValue.value || [])]
  newValue.splice(index, 1)
  modelValue.value = newValue
  emit('change', newValue)
}

/**
 * 复制项
 */
function copyItem(index: number) {
  if (isMaxReached.value)
    return

  const newValue = [...(modelValue.value || [])]
  const copiedItem = JSON.parse(JSON.stringify(newValue[index]))
  newValue.splice(index + 1, 0, copiedItem)
  modelValue.value = newValue
  emit('change', newValue)
}

/**
 * 移动项
 */
function moveItem(fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= (modelValue.value?.length || 0))
    return

  const newValue = [...(modelValue.value || [])]
  const [item] = newValue.splice(fromIndex, 1)
  newValue.splice(toIndex, 0, item)
  modelValue.value = newValue
  emit('change', newValue)
}
</script>

<style scoped>
.config-form-array {
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.config-form-array__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.config-form-array__title {
  font-size: 14px;
  font-weight: 500;
}

.config-form-array__count {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.config-form-array__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-form-array__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  transition: all 0.3s;
}

.config-form-array__item:hover {
  background: var(--el-fill-color);
}

.config-form-array__handle {
  cursor: move;
  color: var(--el-text-color-secondary);
  padding: 8px 4px;
}

.config-form-array__content {
  flex: 1;
  min-width: 0;
}

.config-form-array__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.config-form-array__empty {
  padding: 20px 0;
}

.config-form-array__footer {
  margin-top: 16px;
  text-align: center;
}

.config-form-array__limit {
  margin-top: 8px;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 过渡动画 */
.array-item-enter-active,
.array-item-leave-active {
  transition: all 0.3s ease;
}

.array-item-enter-from,
.array-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.array-item-move {
  transition: transform 0.3s ease;
}
</style>
