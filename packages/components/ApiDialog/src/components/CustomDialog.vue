<template>
  <ElDialog
    v-model="dialogVisible"
    :title="title || '自定义对话框'"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    @close="handleClose"
  >
    <div class="dialog-custom-content">
      <p>这是一个自定义对话框组件</p>
      <p v-if="data">
        传入的数据: {{ JSON.stringify(data) }}
      </p>
      <slot />
    </div>

    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <ElButton @click="handleClose">
            取消
          </ElButton>
          <ElButton type="primary" @click="handleConfirm">
            确认
          </ElButton>
        </div>
      </slot>
    </template>
  </ElDialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElButton, ElDialog } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '50%',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

// 计算属性用于处理v-model
const dialogVisible = computed({
  get() { return props.modelValue },
  set(val) { emit('update:modelValue', val) },
})

// 导出方法给createApiDialog使用
defineExpose({
  close() {
    dialogVisible.value = false
  },
})

// 处理关闭
function handleClose() {
  emit('close')
  emit('update:modelValue', false)
}

// 处理确认
function handleConfirm() {
  emit('confirm', {
    success: true,
    message: '来自自定义对话框的数据',
    timestamp: new Date().toLocaleString(),
  })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.dialog-custom-content {
  padding: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
