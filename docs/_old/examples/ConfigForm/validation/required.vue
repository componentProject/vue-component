<template>
  <div style="padding: 16px;">
    <ConfigForm
      ref="formRef"
      :form-options="formOptions"
      :rows="rows"
    />

    <div style="margin-top: 16px;">
      <button
        style="padding: 8px 16px; background-color: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="validateForm"
      >
        验证表单
      </button>
    </div>

    <div v-if="validationResult" style="margin-top: 16px; padding: 12px; background-color: #f0f9ff; border: 1px solid #b3e5fc; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: #1976d2;">
        验证结果：
      </h4>
      <p style="margin: 0; color: #1976d2;">
        {{ validationResult }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const validationResult = ref('')

const formOptions = reactive({
  model: {
    name: '',
    email: '',
    phone: '',
  },
  labelWidth: '100px',
  required: true,
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
      {
        prop: 'phone',
        label: '电话',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入电话',
        },
      },
    ],
  },
])

async function validateForm() {
  try {
    const valid = await formRef.value.validate()
    validationResult.value = valid ? '表单验证通过！' : '表单验证失败！'
  }
  catch (error) {
    validationResult.value = '表单验证失败！'
  }
}
</script>
