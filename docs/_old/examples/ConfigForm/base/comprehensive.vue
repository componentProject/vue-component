<template>
  <div style="padding: 16px;">
    <ConfigForm
      ref="formRef"
      :formOptions="formOptions"
      :rows="rows"
      @update:rows="updateRows"
    />

    <div style="margin-top: 16px; display: flex; gap: 8px;">
      <button
        style="padding: 8px 16px; background-color: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="validateForm"
      >
        验证表单
      </button>

      <button
        style="padding: 8px 16px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="resetForm"
      >
        重置表单
      </button>

      <button
        style="padding: 8px 16px; background-color: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="fillSampleData"
      >
        填充示例数据
      </button>
    </div>

    <div v-if="validationResult" style="margin-top: 16px; padding: 12px; border-radius: 4px;" :style="{ backgroundColor: validationResult.success ? '#f0f9ff' : '#fef0f0', border: validationResult.success ? '1px solid #b3e5fc' : '1px solid #fbc4c4' }">
      <h4 style="margin: 0 0 8px 0;" :style="{ color: validationResult.success ? '#1976d2' : '#f56c6c' }">{{ validationResult.title }}</h4>
      <p style="margin: 0;" :style="{ color: validationResult.success ? '#1976d2' : '#f56c6c' }">{{ validationResult.message }}</p>
    </div>

    <div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0;">表单数据：</h4>
      <pre style="margin: 0; font-size: 12px; max-height: 300px; overflow: auto;">{{ JSON.stringify(formOptions.model, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const validationResult = ref<{ success: boolean; title: string; message: string } | null>(null)

const formOptions = reactive({
  model: {
    // 基本信息
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',

    // 地址信息
    country: '',
    city: '',
    address: '',

    // 偏好设置
    hobbies: [],
    notifications: false,
    level: 3,

    // 其他
    description: '',
    agree: false
  },
  labelWidth: '120px',
  rules: {
    name: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '电话不能为空', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    gender: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    agree: [
      {
        validator: (rule: any, value: boolean, callback: Function) => {
          if (!value) {
            callback(new Error('请同意用户协议'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入姓名',
          clearable: true
        }
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入邮箱',
          clearable: true
        }
      },
      {
        prop: 'phone',
        label: '电话',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入手机号码',
          clearable: true
        }
      }
    ]
  },
  {
    formItems: [
      {
        prop: 'gender',
        label: '性别',
        type: 'radio-group',
        colConfig: { span: 8 },
        config: {
          radios: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]
        }
      },
      {
        prop: 'birthday',
        label: '出生日期',
        type: 'date-picker',
        colConfig: { span: 8 },
        config: {
          type: 'date',
          placeholder: '请选择出生日期',
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD'
        }
      },
      {
        prop: 'level',
        label: '等级',
        type: 'slider',
        colConfig: { span: 8 },
        config: {
          min: 1,
          max: 5,
          showStops: true,
          showTooltip: true
        }
      }
    ]
  },
  {
    formItems: [
      {
        prop: 'country',
        label: '国家',
        type: 'select',
        colConfig: { span: 8 },
        config: {
          placeholder: '请选择国家',
          clearable: true,
          options: [
            { label: '中国', value: 'china' },
            { label: '美国', value: 'usa' },
            { label: '日本', value: 'japan' },
            { label: '韩国', value: 'korea' }
          ]
        }
      },
      {
        prop: 'city',
        label: '城市',
        type: 'select',
        colConfig: { span: 8 },
        config: {
          placeholder: '请选择城市',
          clearable: true,
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' }
          ]
        }
      },
      {
        prop: 'notifications',
        label: '消息通知',
        type: 'switch',
        colConfig: { span: 8 },
        config: {
          activeText: '开启',
          inactiveText: '关闭'
        }
      }
    ]
  },
  {
    formItems: [
      {
        prop: 'address',
        label: '详细地址',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入详细地址',
          clearable: true
        }
      }
    ]
  },
  {
    formItems: [
      {
        prop: 'hobbies',
        label: '兴趣爱好',
        type: 'checkbox-group',
        colConfig: { span: 24 },
        config: {
          checkboxs: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
            { label: '旅行', value: 'travel' },
            { label: '电影', value: 'movies' },
            { label: '游戏', value: 'gaming' }
          ]
        }
      }
    ]
  },
  {
    formItems: [
      {
        prop: 'description',
        label: '个人描述',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'textarea',
          placeholder: '请输入个人描述',
          rows: 4,
          maxlength: 200,
          showWordLimit: true
        }
      }
    ]
  },
  {
    formItems: [
      {
        prop: 'agree',
        label: '用户协议',
        type: 'checkbox',
        colConfig: { span: 24 },
        config: {
          label: '我已阅读并同意用户协议和隐私政策'
        }
      }
    ]
  }
])

const updateRows = (newRows: any) => {
  Object.assign(rows, newRows)
}

const validateForm = async () => {
  try {
    const valid = await formRef.value.validate()
    validationResult.value = {
      success: valid,
      title: valid ? '验证成功' : '验证失败',
      message: valid ? '所有字段验证通过！' : '请检查表单中的错误信息。'
    }
  } catch (error) {
    validationResult.value = {
      success: false,
      title: '验证失败',
      message: '表单验证过程中出现错误。'
    }
  }
}

const resetForm = () => {
  const elFormRef = formRef.value.getRef('form')
  if (elFormRef && elFormRef.resetFields) {
    elFormRef.resetFields()
    validationResult.value = null
  }
}

const fillSampleData = () => {
  Object.assign(formOptions.model, {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    gender: 'male',
    birthday: '1990-01-01',
    country: 'china',
    city: 'beijing',
    address: '北京市朝阳区xxx街道xxx号',
    hobbies: ['reading', 'sports', 'music'],
    notifications: true,
    level: 4,
    description: '这是一个示例用户的个人描述信息。',
    agree: true
  })
  validationResult.value = null
}
</script>
