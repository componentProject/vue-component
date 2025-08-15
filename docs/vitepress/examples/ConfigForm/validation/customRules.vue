<template>
  <div style="padding: 16px;">
    <ConfigForm
      ref="formRef"
      :formOptions="formOptions"
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
      <h4 style="margin: 0 0 8px 0; color: #1976d2;">验证结果：</h4>
      <p style="margin: 0; color: #1976d2;">{{ validationResult }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const validationResult = ref('')

const formOptions = reactive({
  model: {
    email: '',
    age: '',
    password: '',
    confirmPassword: ''
  },
  labelWidth: '120px',
  rules: {
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    age: [
      { required: true, message: '年龄不能为空', trigger: 'blur' },
      { type: 'number', min: 1, max: 120, message: '年龄必须在1-120之间', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度必须在6-20位之间', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '确认密码不能为空', trigger: 'blur' },
      {
        validator: (rule: any, value: string, callback: Function) => {
          if (value !== formOptions.model.password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入邮箱地址'
        }
      },
      {
        prop: 'age',
        label: '年龄',
        type: 'input-number',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入年龄',
          min: 1,
          max: 120
        }
      },
      {
        prop: 'password',
        label: '密码',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'password',
          placeholder: '请输入密码'
        }
      },
      {
        prop: 'confirmPassword',
        label: '确认密码',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'password',
          placeholder: '请再次输入密码'
        }
      }
    ]
  }
])

const validateForm = async () => {
  try {
    const valid = await formRef.value.validate()
    validationResult.value = valid ? '表单验证通过！' : '表单验证失败！'
  } catch (error) {
    validationResult.value = '表单验证失败！'
  }
}
</script>
