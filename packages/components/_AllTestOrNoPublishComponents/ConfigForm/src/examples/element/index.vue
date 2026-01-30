<!-- ElementPlusExample - Element Plus 配置化表单示例 -->
<template>
  <div class="config-form-example">
    <!-- 示例切换 Tab -->
    <ElTabs v-model="activeTab" type="border-card" class="example-tabs">
      <!-- Tab 1: 完整表单示例 -->
      <ElTabPane label="完整表单" name="full">
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
          v-model="currentValues"
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
        <ElCollapse v-if="showSchema" v-model="activeCollapse" class="example-schema">
          <ElCollapseItem title="表单 Schema 配置" name="schema">
            <pre>{{ JSON.stringify(formSchema, null, 2) }}</pre>
          </ElCollapseItem>
          <ElCollapseItem title="当前表单值" name="values">
            <pre>{{ JSON.stringify(currentValues, null, 2) }}</pre>
          </ElCollapseItem>
        </ElCollapse>
      </ElTabPane>

      <!-- Tab 2: 搜索栏示例 -->
      <ElTabPane label="搜索栏布局" name="search">
        <div class="search-example">
          <div class="example-desc">
            <h3>三种布局类型演示</h3>
            <p>通过修改 <code>layout.type</code> 即可切换布局类型</p>
          </div>

          <ElTabs v-model="searchLayout" type="card" class="layout-tabs">
            <ElTabPane label="Inline 布局" name="inline">
              <div class="layout-desc">
                <strong>inline:</strong> 所有字段在一行内水平排列，适合简单搜索栏
              </div>
              <ConfigForm
                :schema="getSearchSchemaByLayout('inline')"
                :initial-values="searchInitialValues"
                @submit="handleSearch"
              />
            </ElTabPane>

            <ElTabPane label="Horizontal 布局" name="horizontal">
              <div class="layout-desc">
                <strong>horizontal:</strong> 标签在左侧，输入框在右侧，适合表单详情
              </div>
              <ConfigForm
                :schema="getSearchSchemaByLayout('horizontal')"
                :initial-values="searchInitialValues"
                @submit="handleSearch"
              />
            </ElTabPane>

            <ElTabPane label="Vertical 布局" name="vertical">
              <div class="layout-desc">
                <strong>vertical:</strong> 标签在上方，输入框在下方，适合紧凑表单
              </div>
              <ConfigForm
                :schema="getSearchSchemaByLayout('vertical')"
                :initial-values="searchInitialValues"
                @submit="handleSearch"
              />
            </ElTabPane>
          </ElTabs>

          <div v-if="searchResult" class="search-result">
            <strong>搜索条件：</strong>
            <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
          </div>
        </div>
      </ElTabPane>

      <!-- Tab 3: 自定义组件示例 -->
      <ElTabPane label="自定义组件" name="custom">
        <div class="custom-example">
          <div class="example-desc">
            <h3>自定义组件接入方式（参考 Formily x-component / x-decorator）</h3>
            <p>通过 <code>component</code> 属性传入自定义组件，<code>decorator: false</code> 可禁用 FormItem 包装</p>
          </div>

          <ConfigForm
            v-model="customComponentValues"
            :schema="customComponentSchema"
            :initial-values="customComponentInitialValues"
            @submit="handleCustomSubmit"
          />

          <ElCollapse v-model="customActiveCollapse" class="example-schema">
            <ElCollapseItem title="Schema 配置" name="schema">
              <pre>{{ JSON.stringify(customComponentSchema, null, 2) }}</pre>
            </ElCollapseItem>
            <ElCollapseItem title="当前表单值" name="values">
              <pre>{{ JSON.stringify(customComponentValues, null, 2) }}</pre>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormSchema, PatternType } from '../../types'
import type { LayoutType } from '../../types/constants'
import { ElButton, ElCollapse, ElCollapseItem, ElMessage, ElRadioButton, ElRadioGroup, ElTabPane, ElTabs } from 'element-plus'
import { reactive, ref } from 'vue'
import ConfigForm from '../../index.vue'
// 导入自定义组件（用于演示传入组件实例的方式）
import { StarRating, TagInput } from '../components'

defineOptions({
  name: 'ElementPlusExample',
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
          componentProps: {
            activeText: '启用',
            inactiveText: '禁用',
          },
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
      layout: 'tabs',
      title: '通知设置',
      tabs: [
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
        {
          key: 'appearance',
          title: '外观设置',
          properties: {
            themeColor: {
              type: 'color',
              title: '主题颜色',
              default: '#409EFF',
              col: { span: 12 },
            },
          },
        },
      ],
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
            componentProps: { activeText: '是', inactiveText: '否' },
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
            maxlength: 500,
            showWordLimit: true,
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
  username: '张三',
  email: 'zhangsan@example.com',
  userType: 'vip',
  vipLevel: 2,
  gender: 'male',
  isActive: true,
  age: 28,
  birthday: '1996-05-15',
  notifyMethod: 'email',
  notifyEmail: 'notify@example.com',
  themeColor: '#67C23A',
  workExperience: [
    { company: '阿里巴巴', position: '高级前端工程师', isCurrent: true, leaveDate: '' },
    { company: '腾讯', position: '前端工程师', isCurrent: false, leaveDate: '2022-06-30' },
  ],
  remark: '这是一段备注信息。',
  agreement: [true],
}

function handleChange(values: Record<string, any>, changedField: string, changedValue: any) {
  console.log('[Element Plus] 表单变化:', changedField, '=', changedValue)
}

function handleFieldChange(fieldName: string, value: any, oldValue: any) {
  console.log('[Element Plus] 字段变化:', fieldName, oldValue, '->', value)
}

function handleSubmit(values: Record<string, any>) {
  console.log('[Element Plus] 表单提交:', values)
  ElMessage.success('表单提交成功')
}

function handleReset() {
  console.log('[Element Plus] 表单重置')
  ElMessage.info('表单已重置')
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
      clearable: true,
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
      clearable: true,
    },
    col: { span: 8 },
  },
  dateRange: {
    type: 'dateRange',
    title: '时间',
    componentProps: {
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
    },
    col: { span: 8 },
  },
} as const

function getSearchSchemaByLayout(layoutType: LayoutType): FormSchema {
  return {
    id: `element-plus-search-form-${layoutType}`,
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
  console.log(`[Element Plus - ${searchLayout.value}] 搜索条件:`, values)
  searchResult.value = values
  ElMessage.success('搜索成功')
}

// ==================== Tab 3: 自定义组件示例 ====================

const customComponentValues = ref<Record<string, any>>({})
const customActiveCollapse = ref(['schema', 'values'])

const customComponentSchema: FormSchema = {
  id: 'custom-component-schema',
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
        activeColor: '#ff9900',
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
    // ===== 无 FormItem 包装示例（低代码场景） =====
    noDecoratorSection: {
      layout: 'card',
      cardTitle: 'Decorator 配置演示',
      description: '通过 decorator: false 实现无 FormItem 包装',
      properties: {
        // 方式五：decorator: false - 不包装 FormItem（低代码场景）
        rawInput: {
          type: 'input',
          decorator: false,
          componentProps: {
            placeholder: '无 FormItem 包装的输入框（无标签）',
            style: { width: '300px' },
          },
        },
        // 方式六：自定义组件 + decorator: false（完全自包含）
        fullCustom: {
          type: 'number',
          decorator: false,
          component: StarRating,
          componentProps: {
            maxStars: 5,
            showText: true,
            texts: ['很差', '较差', '一般', '较好', '很好'],
            activeColor: '#e91e63',
          },
        },
        // 方式七：同时演示 title 和 decorator 配合
        withTitle: {
          type: 'input',
          title: '带标题（有 FormItem）',
          componentProps: {
            placeholder: '对比：这个有 FormItem 包装',
          },
        },
        noTitle: {
          type: 'input',
          decorator: false,
          componentProps: {
            placeholder: '对比：这个无 FormItem 包装',
          },
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

const customComponentInitialValues = {
  tags: ['Vue', 'TypeScript', 'ConfigForm'],
  starRating: 4,
  tagInputWithDefaults: ['前端', '后端'],
  normalInput: '普通输入内容',
  // Decorator 示例初始值
  rawInput: '无包装输入',
  fullCustom: 3,
  withTitle: '有标题',
  noTitle: '无标题',
}

function handleCustomSubmit(values: Record<string, any>) {
  console.log('[自定义组件] 表单提交:', values)
  ElMessage.success('自定义组件表单提交成功')
}
</script>

<style scoped>
.config-form-example {
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

/* 搜索栏示例样式 */
.search-example {
  padding: 16px 0;
}

.example-desc {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
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
  background: #ecf5ff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
}

.layout-desc strong {
  color: #337ecc;
}

.search-result {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 4px;
  border: 1px solid #c2e7b0;
}

.search-result strong {
  color: #67c23a;
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

