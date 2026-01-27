<!-- AntDesignVueExample - Ant Design Vue 配置化表单示例 -->
<template>
  <div class="config-form-example-antd">
    <!-- 模式切换 -->
    <div class="example-toolbar">
      <ARadioGroup v-model:value="formPattern" size="small">
        <ARadioButton value="editable">
          编辑模式
        </ARadioButton>
        <ARadioButton value="disabled">
          禁用模式
        </ARadioButton>
        <ARadioButton value="readOnly">
          只读模式
        </ARadioButton>
      </ARadioGroup>

      <AButton type="primary" size="small" @click="showSchema = !showSchema">
        {{ showSchema ? '隐藏' : '显示' }} Schema
      </AButton>
    </div>

    <!-- 表单 -->
    <ConfigForm
      ref="formRef"
      :schema="formSchema"
      :adapter="antDesignVueAdapter"
      :initial-values="initialValues"
      :pattern="formPattern"
      :context="formContext"
      @change="handleChange"
      @field-change="handleFieldChange"
      @submit="handleSubmit"
      @reset="handleReset"
    />

    <!-- Schema 展示 -->
    <ACollapse v-if="showSchema" class="example-schema">
      <ACollapsePanel key="schema" header="表单 Schema 配置">
        <pre>{{ JSON.stringify(formSchema, null, 2) }}</pre>
      </ACollapsePanel>
      <ACollapsePanel key="values" header="当前表单值">
        <pre>{{ JSON.stringify(currentValues, null, 2) }}</pre>
      </ACollapsePanel>
    </ACollapse>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormSchema } from '../_types'
import {
  Button as AButton,
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
  message as AMessage,
  RadioButton as ARadioButton,
  RadioGroup as ARadioGroup,
} from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { antDesignVueAdapter } from '../adapters'
import ConfigForm from '../index.vue'

defineOptions({
  name: 'AntDesignVueExample',
})

// 表单引用
const formRef = ref<FormInstance>()
defineExpose({ formRef })

// 表单模式
const formPattern = ref<'editable' | 'disabled' | 'readOnly'>('editable')

// 是否显示 Schema
const showSchema = ref(false)

// 当前表单值
const currentValues = ref<Record<string, any>>({})

// 表单上下文
const formContext = reactive({
  dicts: {
    userType: [
      { label: '普通用户', value: 'normal' },
      { label: 'VIP用户', value: 'vip' },
      { label: '管理员', value: 'admin' },
    ],
  },
})

// 表单 Schema（与 Element Plus 示例相同，展示跨框架兼容性）
const formSchema: FormSchema = {
  layout: {
    type: 'horizontal',
    labelWidth: '100px',
    colon: true,
    size: 'default',
  },
  properties: {
    // ===== 基础信息 =====
    basicInfo: {
      type: 'card',
      name: '',
      title: '基础信息',
      properties: {
        username: {
          type: 'input',
          name: 'username',
          title: '用户名',
          required: true,
          rules: [
            { minLength: 3, message: '用户名至少3个字符' },
            { maxLength: 20, message: '用户名最多20个字符' },
          ],
          componentProps: {
            placeholder: '请输入用户名',
          },
          col: { span: 12 },
        },
        email: {
          type: 'input',
          name: 'email',
          title: '邮箱',
          required: true,
          rules: [{ format: 'email', message: '请输入正确的邮箱格式' }],
          componentProps: {
            placeholder: '请输入邮箱',
          },
          col: { span: 12 },
        },
        userType: {
          type: 'select',
          name: 'userType',
          title: '用户类型',
          required: true,
          dataSource: {
            type: 'static',
            data: [
              { label: '普通用户', value: 'normal' },
              { label: 'VIP用户', value: 'vip' },
              { label: '管理员', value: 'admin' },
            ],
          },
          componentProps: {
            placeholder: '请选择用户类型',
          },
          col: { span: 12 },
        },
        vipLevel: {
          type: 'select',
          name: 'vipLevel',
          title: 'VIP等级',
          showWhen: 'userType === "vip"',
          dataSource: {
            type: 'static',
            data: [
              { label: 'VIP1', value: 1 },
              { label: 'VIP2', value: 2 },
              { label: 'VIP3', value: 3 },
            ],
          },
          col: { span: 12 },
        },
        gender: {
          type: 'radio',
          name: 'gender',
          title: '性别',
          dataSource: {
            type: 'static',
            data: [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
              { label: '保密', value: 'secret' },
            ],
          },
          col: { span: 12 },
        },
        isActive: {
          type: 'switch',
          name: 'isActive',
          title: '启用状态',
          default: true,
          componentProps: {
            activeText: '启用',
            inactiveText: '禁用',
          },
          col: { span: 12 },
        },
        age: {
          type: 'number',
          name: 'age',
          title: '年龄',
          componentProps: {
            min: 0,
            max: 150,
            placeholder: '请输入年龄',
          },
          col: { span: 12 },
        },
        birthday: {
          type: 'date',
          name: 'birthday',
          title: '生日',
          componentProps: {
            style: { width: '100%' },
          },
          col: { span: 12 },
        },
        score: {
          type: 'slider',
          name: 'score',
          title: '评分',
          default: 60,
          componentProps: {
            min: 0,
            max: 100,
          },
          col: { span: 12 },
        },
        satisfaction: {
          type: 'rate',
          name: 'satisfaction',
          title: '满意度',
          default: 3,
          col: { span: 12 },
        },
      },
    },

    // ===== 通知设置 =====
    notificationSettings: {
      type: 'collapse',
      name: '',
      title: '通知设置',
      panels: [
        {
          key: 'notify',
          title: '通知配置',
          properties: {
            notifyMethod: {
              type: 'radio',
              name: 'notifyMethod',
              title: '通知方式',
              default: 'email',
              dataSource: {
                type: 'static',
                data: [
                  { label: '邮件通知', value: 'email' },
                  { label: '短信通知', value: 'sms' },
                  { label: '不通知', value: 'none' },
                ],
              },
              col: { span: 24 },
            },
            notifyEmail: {
              type: 'input',
              name: 'notifyEmail',
              title: '通知邮箱',
              requiredWhen: 'notifyMethod === "email"',
              disabledWhen: 'notifyMethod !== "email"',
              rules: [{ format: 'email', message: '请输入正确的邮箱格式' }],
              componentProps: { placeholder: '请输入通知邮箱' },
              col: { span: 12 },
            },
            notifyPhone: {
              type: 'input',
              name: 'notifyPhone',
              title: '通知手机',
              showWhen: 'notifyMethod === "sms"',
              requiredWhen: 'notifyMethod === "sms"',
              rules: [{ format: 'phone', message: '请输入正确的手机号' }],
              componentProps: { placeholder: '请输入接收短信的手机号' },
              col: { span: 12 },
            },
          },
        },
      ],
      defaultActiveKey: ['notify'],
    },

    // ===== 工作经历 =====
    workExperience: {
      type: 'array',
      name: 'workExperience',
      title: '工作经历',
      minItems: 1,
      maxItems: 5,
      operations: {
        add: { text: '添加工作经历' },
        remove: { confirm: true, confirmText: '确定删除这条工作经历？' },
        copy: true,
        move: true,
      },
      items: {
        type: 'object',
        name: '',
        properties: {
          company: {
            type: 'input',
            name: 'company',
            title: '公司名称',
            required: true,
            componentProps: { placeholder: '请输入公司名称' },
            col: { span: 12 },
          },
          position: {
            type: 'input',
            name: 'position',
            title: '职位',
            required: true,
            componentProps: { placeholder: '请输入职位名称' },
            col: { span: 12 },
          },
          isCurrent: {
            type: 'switch',
            name: 'isCurrent',
            title: '至今',
            default: false,
            componentProps: { activeText: '是', inactiveText: '否' },
            col: { span: 12 },
          },
          leaveDate: {
            type: 'date',
            name: 'leaveDate',
            title: '离职日期',
            display: '{{$record?.isCurrent ? "none" : "visible"}}',
            componentProps: { style: { width: '100%' } },
            col: { span: 12 },
          },
        },
      },
    },

    // ===== 其他信息 =====
    otherInfo: {
      type: 'group',
      name: '',
      title: '其他信息',
      properties: {
        remark: {
          type: 'textarea',
          name: 'remark',
          title: '备注',
          componentProps: {
            placeholder: '请输入备注信息',
            maxLength: 500,
            showCount: true,
          },
          col: { span: 24 },
        },
        agreement: {
          type: 'checkbox',
          name: 'agreement',
          dataSource: {
            type: 'static',
            data: [{ label: '我已阅读并同意《用户协议》', value: true }],
          },
          col: { span: 24 },
        },
      },
    },
  },
  submit: {
    text: '提交',
    buttonProps: { type: 'primary' },
  },
  reset: {
    text: '重置',
  },
}

// 初始值
const initialValues = {
  username: '',
  email: '',
  userType: 'normal',
  vipLevel: undefined,
  gender: '',
  isActive: true,
  age: undefined,
  birthday: '',
  score: 60,
  satisfaction: 3,
  notifyMethod: 'email',
  notifyEmail: '',
  notifyPhone: '',
  workExperience: [{ company: '', position: '', isCurrent: false, leaveDate: '' }],
  remark: '',
  agreement: [],
}

/**
 * 处理表单值变化
 */
function handleChange(values: Record<string, any>) {
  currentValues.value = values
}

/**
 * 处理字段值变化
 */
function handleFieldChange(fieldName: string, value: any, oldValue: any) {
  console.log('[Ant Design Vue] 字段变化:', fieldName, oldValue, '->', value)
}

/**
 * 处理表单提交
 */
function handleSubmit(values: Record<string, any>) {
  console.log('[Ant Design Vue] 表单提交:', values)
  AMessage.success('表单提交成功')
}

/**
 * 处理表单重置
 */
function handleReset() {
  console.log('[Ant Design Vue] 表单重置')
  AMessage.info('表单已重置')
}
</script>

<style scoped>
.config-form-example-antd {
  padding: 16px;
}

.example-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.example-schema {
  margin-top: 24px;
}

.example-schema pre {
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
}
</style>
