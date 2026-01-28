<!-- ElementPlusExample - Element Plus 配置化表单示例 -->
<template>
  <div class="config-form-example">
    <!-- 模式切换 -->
    <div class="example-toolbar">
      <ElRadioGroup v-model="formPattern" size="small">
        <ElRadioButton value="editable">
          编辑模式
        </ElRadioButton>
        <ElRadioButton value="disabled">
          禁用模式
        </ElRadioButton>
        <ElRadioButton value="readOnly">
          只读模式
        </ElRadioButton>
        <ElRadioButton value="readPretty">
          阅读态
        </ElRadioButton>
      </ElRadioGroup>

      <ElButton type="primary" size="small" @click="showSchema = !showSchema">
        {{ showSchema ? '隐藏' : '显示' }} Schema
      </ElButton>
    </div>

    <!-- 表单 -->
    <ConfigForm
      ref="formRef"
      :schema="formSchema"
      :initial-values="initialValues"
      :pattern="formPattern"
      :context="formContext"
      @change="handleChange"
      @field-change="handleFieldChange"
      @submit="handleSubmit"
      @reset="handleReset"
    />

    <!-- Schema 展示 -->
    <ElCollapse v-if="showSchema" class="example-schema">
      <ElCollapseItem title="表单 Schema 配置" name="schema">
        <pre>{{ JSON.stringify(formSchema, null, 2) }}</pre>
      </ElCollapseItem>
      <ElCollapseItem title="当前表单值" name="values">
        <pre>{{ JSON.stringify(currentValues, null, 2) }}</pre>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormSchema } from '../_types'
import { ElButton, ElCollapse, ElCollapseItem, ElMessage, ElRadioButton, ElRadioGroup } from 'element-plus'
import { reactive, ref } from 'vue'
import ConfigForm from '../index.vue'

defineOptions({
  name: 'ElementPlusExample',
})

// 表单引用
const formRef = ref<FormInstance>()
defineExpose({ formRef })

// 表单模式
const formPattern = ref<'editable' | 'disabled' | 'readOnly' | 'readPretty'>('editable')

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

// 表单 Schema
const formSchema: FormSchema = {
  id: 'element-plus-form-schema',
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
          onBlur: 'onUsernameBlur', // 失焦时触发 handler
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
          onFocus: 'onEmailFocus', // 聚焦时触发 handler
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
          onChange: 'onUserTypeChange', // 值变化时触发 handler
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
      type: 'tabs',
      name: '',
      title: '通知设置',
      tabs: [
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
        {
          key: 'appearance',
          title: '外观设置',
          properties: {
            themeColor: {
              type: 'color',
              name: 'themeColor',
              title: '主题颜色',
              default: '#409EFF',
              col: { span: 12 },
            },
          },
        },
        {
          key: 'advanced',
          title: '高级设置',
          properties: {
            introduction: {
              type: 'richText',
              name: 'introduction',
              title: '个人简介',
              description: '支持富文本格式的个人简介',
              componentProps: {
                placeholder: '请输入您的个人简介...',
              },
              col: { span: 24 },
            },
            customScript: {
              type: 'codeEditor',
              name: 'customScript',
              title: '自定义脚本',
              description: '支持 JavaScript 代码编辑',
              componentProps: {
                placeholder: '// 请输入自定义脚本代码...',
                language: 'javascript',
              },
              col: { span: 24 },
            },
          },
        },
      ],
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
            maxlength: 500,
            showWordLimit: true,
          },
          col: { span: 24 },
        },

        // ===== 自定义样式测试 =====
        customStyleInput: {
          type: 'input',
          name: 'customStyleInput',
          title: '自定义样式输入框',
          description: '测试 readPretty 模式下样式继承（大号字体 + 大内边距）',
          componentProps: {
            placeholder: '这是一个大号输入框',
            style: {
              fontSize: '18px',
              padding: '8px 20px',
              height: '48px',
              lineHeight: '30px',
            },
            class: 'custom-large-input',
          },
          col: { span: 12 },
        },
        customStyleInput2: {
          type: 'input',
          name: 'customStyleInput2',
          title: '小号样式输入框',
          description: '测试 readPretty 模式下样式继承（小号字体 + 小内边距）',
          componentProps: {
            placeholder: '这是一个小号输入框',
            style: {
              fontSize: '12px',
              padding: '2px 8px',
            },
          },
          col: { span: 12 },
        },
        highlightInput: {
          type: 'input',
          name: 'highlightInput',
          title: '高亮样式',
          description: '测试 readPretty 模式下自定义背景色和字体颜色',
          componentProps: {
            placeholder: '带背景色的输入框',
            // Element Plus 使用 inputStyle 设置 Input 内部样式（官方标准用法）
            inputStyle: {
              backgroundColor: '#f0f9eb',
              color: '#67c23a',
              fontWeight: 'bold',
            },
          },
          col: { span: 12 },
        },
        alignTestInput: {
          type: 'input',
          name: 'alignTestInput',
          title: '对齐测试',
          description: '普通输入框，用于对比对齐效果',
          componentProps: {
            placeholder: '普通输入框',
          },
          col: { span: 12 },
        },

        agreement: {
          type: 'checkbox',
          name: 'agreement',
          required: true,
          rules: [
            {
              validator: 'agreementRequired',
              message: '请阅读并同意用户协议',
            },
          ],
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
  validators: {
    agreementRequired: (value: any) => {
      // checkbox 的值是一个数组，勾选后包含 true
      if (!value || !Array.isArray(value) || !value.includes(true)) {
        return '请阅读并同意用户协议'
      }
      return true
    },
  },
  handlers: {
    // 用户名失焦时去除首尾空格
    onUsernameBlur: (value: any, context: any) => {
      if (typeof value === 'string' && value !== value.trim()) {
        context.setFieldValue('username', value.trim())
        console.log('[Handler] 用户名已去除首尾空格:', value.trim())
      }
    },
    // 用户类型变化时的处理
    onUserTypeChange: (value: any, context: any) => {
      console.log('[Handler] 用户类型变化:', value)
      // 当切换为普通用户时，清空 VIP 等级
      if (value === 'normal') {
        context.setFieldValue('vipLevel', undefined)
        console.log('[Handler] 已清空 VIP 等级')
      }
    },
    // 邮箱聚焦时打印日志
    onEmailFocus: (value: any) => {
      console.log('[Handler] 邮箱字段获得焦点，当前值:', value)
    },
  },
}

// 初始值（填充完整测试数据）
const initialValues = {
  username: '张三',
  email: 'zhangsan@example.com',
  userType: 'vip',
  vipLevel: 'gold',
  gender: 'male',
  isActive: true,
  age: 28,
  birthday: '1996-05-15',
  score: 75,
  satisfaction: 4,
  notifyMethod: 'email',
  notifyEmail: 'notify@example.com',
  notifyPhone: '13800138000',
  themeColor: '#67C23A',
  workExperience: [
    { company: '阿里巴巴', position: '高级前端工程师', isCurrent: true, leaveDate: '' },
    { company: '腾讯', position: '前端工程师', isCurrent: false, leaveDate: '2022-06-30' },
  ],
  remark: '这是一段备注信息，用于测试文本域的展示效果。',
  // 自定义样式测试字段
  customStyleInput: '大号字体输入框',
  customStyleInput2: '小号字体输入框',
  highlightInput: '绿色高亮文本',
  alignTestInput: '普通输入框内容',
  agreement: [true],
  // 高级设置字段（字段名与 schema 中的 name 对应）
  introduction: '<p>这是一段<strong>富文本</strong>内容，支持<em>HTML格式</em>。</p>',
  customScript: 'function hello() {\n  console.log("Hello World!");\n}',
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
  console.log('[Element Plus] 字段变化:', fieldName, oldValue, '->', value)
}

/**
 * 处理表单提交
 */
function handleSubmit(values: Record<string, any>) {
  console.log('[Element Plus] 表单提交:', values)
  ElMessage.success('表单提交成功')
}

/**
 * 处理表单重置
 */
function handleReset() {
  console.log('[Element Plus] 表单重置')
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.config-form-example {
  padding: 16px;
}

.example-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.example-schema {
  margin-top: 24px;
}

.example-schema pre {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
}
</style>
