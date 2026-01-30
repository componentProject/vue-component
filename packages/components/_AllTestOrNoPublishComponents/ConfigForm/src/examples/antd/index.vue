<!-- AntDesignVueExample - Ant Design Vue 配置化表单示例 -->
<template>
  <div class="config-form-example-antd">
    <!-- 示例切换 Tab -->
    <ATabs v-model:active-key="activeTab" type="card" class="example-tabs">
      <!-- Tab 1: 完整表单示例 -->
      <ATabPane key="full" tab="完整表单">
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
            <ARadioButton value="readPretty">
              阅读态
            </ARadioButton>
          </ARadioGroup>

          <AButton type="primary" size="small" @click="showSchema = !showSchema">
            {{ showSchema ? '隐藏' : '显示' }} Schema
          </AButton>
        </div>

        <!-- 表单 -->
        <ConfigForm
          ref="formRef"
          v-model="currentValues"
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
        <ACollapse v-if="showSchema" v-model:active-key="activeCollapse" class="example-schema">
          <ACollapsePanel key="schema" header="表单 Schema 配置">
            <pre>{{ JSON.stringify(formSchema, null, 2) }}</pre>
          </ACollapsePanel>
          <ACollapsePanel key="values" header="当前表单值">
            <pre>{{ JSON.stringify(currentValues, null, 2) }}</pre>
          </ACollapsePanel>
        </ACollapse>
      </ATabPane>

      <!-- Tab 2: 搜索栏示例 -->
      <ATabPane key="search" tab="搜索栏布局">
        <div class="search-example">
          <div class="example-desc">
            <h3>三种布局类型演示</h3>
            <p>通过修改 <code>layout.type</code> 即可切换布局类型</p>
          </div>

          <ATabs v-model:active-key="searchLayout" type="card" class="layout-tabs">
            <ATabPane key="inline" tab="Inline 布局">
              <div class="layout-desc">
                <strong>inline:</strong> 所有字段在一行内水平排列，适合简单搜索栏
              </div>
              <ConfigForm
                :schema="getSearchSchemaByLayout('inline')"
                :initial-values="searchInitialValues"
                :adapter="antDesignVueAdapter"
                @submit="handleSearch"
              />
            </ATabPane>

            <ATabPane key="horizontal" tab="Horizontal 布局">
              <div class="layout-desc">
                <strong>horizontal:</strong> 标签在左侧，输入框在右侧，适合表单详情
              </div>
              <ConfigForm
                :schema="getSearchSchemaByLayout('horizontal')"
                :initial-values="searchInitialValues"
                :adapter="antDesignVueAdapter"
                @submit="handleSearch"
              />
            </ATabPane>

            <ATabPane key="vertical" tab="Vertical 布局">
              <div class="layout-desc">
                <strong>vertical:</strong> 标签在上方，输入框在下方，适合紧凑表单
              </div>
              <ConfigForm
                :schema="getSearchSchemaByLayout('vertical')"
                :initial-values="searchInitialValues"
                :adapter="antDesignVueAdapter"
                @submit="handleSearch"
              />
            </ATabPane>
          </ATabs>

          <div v-if="searchResult" class="search-result">
            <strong>搜索条件：</strong>
            <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
          </div>
        </div>
      </ATabPane>

      <!-- Tab 3: 自定义组件示例 -->
      <ATabPane key="custom" tab="自定义组件">
        <div class="custom-example">
          <div class="example-desc">
            <h3>自定义组件接入方式（参考 Formily x-component）</h3>
            <p>通过 <code>component</code> 属性传入自定义组件，<code>type</code> 用于表示数据类型/语义</p>
          </div>

          <ConfigForm
            v-model="customComponentValues"
            :schema="customComponentSchema"
            :initial-values="customComponentInitialValues"
            :adapter="antDesignVueAdapter"
            @submit="handleCustomSubmit"
          />

          <ACollapse v-model:active-key="customActiveCollapse" class="example-schema">
            <ACollapsePanel key="schema" header="Schema 配置">
              <pre>{{ JSON.stringify(customComponentSchema, null, 2) }}</pre>
            </ACollapsePanel>
            <ACollapsePanel key="values" header="当前表单值">
              <pre>{{ JSON.stringify(customComponentValues, null, 2) }}</pre>
            </ACollapsePanel>
          </ACollapse>
        </div>
      </ATabPane>
    </ATabs>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormSchema, PatternType } from '../../types'
import type { LayoutType } from '../../types/constants'
import {
  Button as AButton,
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
  message as AMessage,
  RadioButton as ARadioButton,
  RadioGroup as ARadioGroup,
  TabPane as ATabPane,
  Tabs as ATabs,
} from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { antDesignVueAdapter } from '../../adapters'
import ConfigForm from '../../index.vue'
// 导入自定义组件
import { StarRating, TagInput } from '../components'

defineOptions({
  name: 'AntDesignVueExample',
})

// ==================== 通用状态 ====================
const activeTab = ref('full')

// ==================== Tab 1: 完整表单示例 ====================

// 表单引用
const formRef = ref<FormInstance>()
defineExpose({ formRef })

// 表单模式
const formPattern = ref<PatternType>('editable')

// 是否显示 Schema
const showSchema = ref(true)

// 展开的折叠面板
const activeCollapse = ref(['schema', 'values'])

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

// 完整表单 Schema
const formSchema: FormSchema = {
  id: 'antd-vue-example-form',
  layout: {
    type: 'horizontal',
    labelWidth: '100px',
    colon: true,
    size: 'default',
  },
  properties: {
    // ===== 基础信息 =====
    basicInfo: {
      layout: 'card',
      title: '基础信息',
      properties: {
        username: {
          type: 'input',
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
          onBlur: 'onUsernameBlur',
        },
        email: {
          type: 'input',
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
          onChange: 'onUserTypeChange',
        },
        vipLevel: {
          type: 'select',
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
          title: '启用状态',
          default: true,
          col: { span: 12 },
        },
        age: {
          type: 'number',
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
          title: '生日',
          componentProps: {
            style: { width: '100%' },
          },
          col: { span: 12 },
        },
      },
    },

    // ===== 通知设置 =====
    notificationSettings: {
      layout: 'collapse',
      title: '通知设置',
      panels: [
        {
          key: 'notify',
          title: '通知配置',
          properties: {
            notifyMethod: {
              type: 'radio',
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
              title: '通知邮箱',
              requiredWhen: 'notifyMethod === "email"',
              disabledWhen: 'notifyMethod !== "email"',
              rules: [{ format: 'email', message: '请输入正确的邮箱格式' }],
              componentProps: { placeholder: '请输入通知邮箱' },
              col: { span: 12 },
            },
            notifyPhone: {
              type: 'input',
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
        properties: {
          company: {
            type: 'input',
            title: '公司名称',
            required: true,
            componentProps: { placeholder: '请输入公司名称' },
            col: { span: 12 },
          },
          position: {
            type: 'input',
            title: '职位',
            required: true,
            componentProps: { placeholder: '请输入职位名称' },
            col: { span: 12 },
          },
          isCurrent: {
            type: 'switch',
            title: '至今',
            default: false,
            col: { span: 12 },
          },
          leaveDate: {
            type: 'date',
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
      layout: 'group',
      title: '其他信息',
      properties: {
        remark: {
          type: 'textarea',
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
    agreementRequired: ({ value }) => {
      if (!value || !Array.isArray(value) || !value.includes(true)) {
        return '请阅读并同意用户协议'
      }
      return true
    },
  },
  handlers: {
    onUsernameBlur: ({ value, setFieldValue }) => {
      if (typeof value === 'string' && value !== value.trim()) {
        setFieldValue('username', value.trim())
        console.log('[Handler] 用户名已去除首尾空格:', value.trim())
      }
    },
    onUserTypeChange: ({ value, setFieldValue }) => {
      console.log('[Handler] 用户类型变化:', value)
      if (value === 'normal') {
        setFieldValue('vipLevel', undefined)
        console.log('[Handler] 已清空 VIP 等级')
      }
    },
  },
}

// 初始值
const initialValues = {
  username: '李四',
  email: 'lisi@example.com',
  userType: 'admin',
  vipLevel: 2,
  gender: 'female',
  isActive: true,
  age: 32,
  birthday: '1992-08-20',
  notifyMethod: 'sms',
  notifyEmail: 'admin@example.com',
  notifyPhone: '13900139000',
  workExperience: [
    { company: '字节跳动', position: '技术总监', isCurrent: true, leaveDate: '' },
    { company: '美团', position: '高级工程师', isCurrent: false, leaveDate: '2021-12-31' },
  ],
  remark: '这是 Ant Design Vue 示例的备注信息。',
  agreement: [true],
}

function handleChange(values: Record<string, any>, changedField: string, changedValue: any) {
  console.log('[Ant Design Vue] 表单变化:', changedField, '=', changedValue)
}

function handleFieldChange(fieldName: string, value: any, oldValue: any) {
  console.log('[Ant Design Vue] 字段变化:', fieldName, oldValue, '->', value)
}

function handleSubmit(values: Record<string, any>) {
  console.log('[Ant Design Vue] 表单提交:', values)
  AMessage.success('表单提交成功')
}

function handleReset() {
  console.log('[Ant Design Vue] 表单重置')
  AMessage.info('表单已重置')
}

// ==================== Tab 2: 搜索栏示例 ====================

const searchLayout = ref<LayoutType>('inline')
const searchResult = ref<Record<string, unknown> | null>(null)

const searchBaseProperties = {
  keyword: {
    type: 'input',
    title: '关键词',
    componentProps: {
      placeholder: '请输入关键词',
      allowClear: true,
    },
    col: { span: 8 },
  },
  status: {
    type: 'select',
    title: '状态',
    dataSource: {
      type: 'static',
      data: [
        { label: '全部', value: '' },
        { label: '待处理', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' },
      ],
    },
    componentProps: {
      placeholder: '请选择状态',
      allowClear: true,
    },
    col: { span: 8 },
  },
  dateRange: {
    type: 'dateRange',
    title: '时间',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
    col: { span: 8 },
  },
} as const

function getSearchSchemaByLayout(layoutType: LayoutType): FormSchema {
  return {
    id: `antd-vue-search-form-${layoutType}`,
    name: '搜索表单',
    layout: {
      type: layoutType,
      labelWidth: layoutType === 'inline' ? '70px' : '100px',
    },
    properties: searchBaseProperties as FormSchema['properties'],
    submit: {
      text: '搜索',
      buttonProps: { type: 'primary' },
    },
    reset: {
      text: '重置',
    },
  }
}

const searchInitialValues = {
  keyword: '',
  status: '',
  dateRange: [],
}

function handleSearch(values: Record<string, unknown>) {
  console.log(`[Ant Design Vue - ${searchLayout.value}] 搜索条件:`, values)
  searchResult.value = values
  AMessage.success('搜索成功')
}

// ==================== Tab 3: 自定义组件示例 ====================

const customComponentValues = ref<Record<string, any>>({})
const customActiveCollapse = ref(['schema', 'values'])

const customComponentSchema: FormSchema = {
  id: 'antd-custom-component-schema',
  layout: {
    type: 'horizontal',
    labelWidth: '140px',
  },
  properties: {
    // 方式一：component 直接传入组件实例（推荐）
    tags: {
      type: 'array',
      title: '标签输入',
      description: 'component 直接传入组件实例（推荐方式）',
      component: TagInput,
      componentProps: {
        placeholder: '输入标签后按 Enter 添加',
        maxTags: 5,
        separator: ',',
      },
      col: { span: 12 },
    },
    // 方式二：component 传入另一个自定义组件
    starRating: {
      type: 'number',
      title: '星级评分',
      description: 'component 传入星级评分组件',
      component: StarRating,
      componentProps: {
        maxStars: 5,
        showText: true,
        texts: ['很差', '较差', '一般', '较好', '很好'],
        activeColor: '#1890ff',
      },
      col: { span: 12 },
    },
    // 方式三：[组件, 默认props] 元组形式
    tagInputWithDefaults: {
      type: 'array',
      title: '带默认配置的标签输入',
      description: '[组件, 默认props] 元组形式',
      component: [TagInput, { maxTags: 3, placeholder: '最多3个标签' }],
      componentProps: {
        separator: '，',
      },
      col: { span: 12 },
    },
    // 方式四：不指定 component，使用 type 对应的默认组件
    normalInput: {
      type: 'input',
      title: '普通输入框（对比）',
      description: '不指定 component，使用 type 默认组件',
      componentProps: {
        placeholder: '这是普通的输入框',
      },
      col: { span: 12 },
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

const customComponentInitialValues = {
  tags: ['Vue', 'TypeScript', 'Ant Design'],
  starRating: 4,
  tagInputWithDefaults: ['前端', '后端'],
  normalInput: '普通输入内容',
}

function handleCustomSubmit(values: Record<string, any>) {
  console.log('[自定义组件] 表单提交:', values)
  AMessage.success('自定义组件表单提交成功')
}
</script>

<style scoped>
.config-form-example-antd {
  padding: 16px;
}

.example-tabs {
  min-height: 600px;
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

/* 搜索栏示例样式 */
.search-example {
  padding: 16px 0;
}

.example-desc {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  border-radius: 8px;
  color: #fff;
}

.example-desc h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.example-desc p {
  margin: 0;
  opacity: 0.9;
}

.example-desc code {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  font-family: monospace;
}

.layout-tabs {
  margin-bottom: 16px;
}

.layout-desc {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #e6f7ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 14px;
}

.layout-desc strong {
  color: #096dd9;
}

.search-result {
  margin-top: 16px;
  padding: 12px;
  background: #e6f7ff;
  border-radius: 4px;
  border: 1px solid #91d5ff;
}

.search-result strong {
  color: #1890ff;
}

.search-result pre {
  margin: 8px 0 0;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
}

/* 自定义组件示例样式 */
.custom-example {
  padding: 16px 0;
}
</style>

