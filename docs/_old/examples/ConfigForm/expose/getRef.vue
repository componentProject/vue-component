<template>
  <div style="padding: 16px;">
    <ConfigForm
      ref="formRef"
      :form-options="formOptions"
      :rows="rows"
    />

    <div style="margin-top: 16px;">
      <button
        style="padding: 8px 16px; background-color: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        @click="focusNameInput"
      >
        聚焦姓名输入框
      </button>

      <button
        style="padding: 8px 16px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        @click="getFormRef"
      >
        获取表单引用
      </button>

      <button
        style="padding: 8px 16px; background-color: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="clearValidation"
      >
        清除验证
      </button>
    </div>

    <div v-if="refInfo" style="margin-top: 16px; padding: 12px; background-color: #f0f9ff; border: 1px solid #b3e5fc; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: #1976d2;">
        引用信息：
      </h4>
      <p style="margin: 0; color: #1976d2;">
        {{ refInfo }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const refInfo = ref('')

const formOptions = reactive({
  model: {
    name: '',
    email: '',
  },
  labelWidth: '100px',
  rules: {
    name: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          ref: 'nameInput',
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入邮箱',
        },
      },
    ],
  },
])

function focusNameInput() {
  const nameInputRef = formRef.value.getRef('nameInput')
  if (nameInputRef && nameInputRef.focus) {
    nameInputRef.focus()
    refInfo.value = '已聚焦到姓名输入框'
  }
  else {
    refInfo.value = '无法获取姓名输入框引用'
  }
}

function getFormRef() {
  const elFormRef = formRef.value.getRef('form')
  if (elFormRef) {
    refInfo.value = `成功获取到 el-form 引用，类型：${elFormRef.$el?.tagName}`
  }
  else {
    refInfo.value = '无法获取表单引用'
  }
}

function clearValidation() {
  const elFormRef = formRef.value.getRef('form')
  if (elFormRef && elFormRef.clearValidate) {
    elFormRef.clearValidate()
    refInfo.value = '已清除表单验证状态'
  }
  else {
    refInfo.value = '无法清除验证状态'
  }
}
</script>
