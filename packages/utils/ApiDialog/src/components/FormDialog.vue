<!-- FormDialog.vue的对话框组件 -->
<template>
  <ElDialog
    v-model="dialogVisible"
    :title="title || '数据表单对话框'"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="formData" label-width="80px" :rules="rules">
      <ElFormItem label="姓名" prop="name">
        <ElInput v-model="formData.name" placeholder="请输入姓名" />
      </ElFormItem>
      <ElFormItem label="邮箱" prop="email">
        <ElInput v-model="formData.email" placeholder="请输入邮箱" />
      </ElFormItem>
      <ElFormItem label="年龄" prop="age">
        <ElInput v-model="formData.age" placeholder="请输入年龄" />
      </ElFormItem>

      <slot />
    </ElForm>
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <ElButton @click="handleClose">
            取消
          </ElButton>
          <ElButton type="primary" @click="handleSubmit">
            提交
          </ElButton>
        </div>
      </slot>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import { computed, ref, useTemplateRef } from 'vue'

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
    default: '500px',
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

// 表单数据
const formData = ref({
  name: '',
  email: '',
  age: '',
})

// 表单规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
}

const formRef = useTemplateRef('formRef')

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
  resetForm()
}

// 处理表单提交
function handleSubmit() {
  if (!formRef.value) {
    return
  }

  formRef.value.validate((valid) => {
    if (valid) {
      emit('confirm', { ...formData.value })
      emit('update:modelValue', false)
      resetForm()
    }
    else {
      ElMessage.warning('请填写正确的表单信息')
    }
  })
}

// 重置表单
function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<style scoped>
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
