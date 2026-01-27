<!-- ConfigForm Example - 配置化表单示例 -->
<template>
  <div class="config-form-example">
    <h1>ConfigForm 配置化表单示例</h1>

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
      @submit-success="handleSubmitSuccess"
      @submit-error="handleSubmitError"
      @reset="handleReset"
      @validate="handleValidate"
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
import type { FormInstance, FormSchema } from './_types'
import { ElButton, ElCollapse, ElCollapseItem, ElMessage, ElRadioButton, ElRadioGroup } from 'element-plus'
import { reactive, ref } from 'vue'
import ConfigForm from './index.vue'

// 表单引用（用于外部调用表单方法）
const formRef = ref<FormInstance>()
// 暴露给父组件使用
defineExpose({ formRef })

// 表单模式
const formPattern = ref<'editable' | 'disabled' | 'readOnly'>('editable')

// 是否显示 Schema
const showSchema = ref(false)

// 当前表单值
const currentValues = ref<Record<string, any>>({})

// 外部上下文
const formContext = reactive({
  userId: '12345',
  isVip: true,
  permissions: ['user:create', 'user:edit'],
})

// 初始值
const initialValues = {
  // 基础信息
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  userType: 'normal',
  phone: '',
  gender: '',
  isActive: true,
  age: undefined,
  birthday: '',
  validPeriod: [],
  score: 60,
  satisfaction: 3,
  // 高级设置
  notifyMethod: 'email',
  notifyEmail: '',
  notifyPhone: '',
  themeColor: '#409EFF',
  workTime: '',
  // 地址
  address: {
    province: '',
    city: '',
    detail: '',
  },
  // 工作经历
  workExperiences: [{ company: '', position: '', startDate: '', endDate: '', isCurrent: false }],
  // 标签和权限
  tags: [],
  permissions: [{ module: '', actions: [] }],
  remark: '',
  agreement: false,
}

// 表单 Schema
const formSchema: FormSchema = {
  id: 'user-form',
  name: '用户信息表单',
  version: '1.0.0',

  layout: {
    type: 'horizontal',
    labelWidth: '80px', // label 固定宽度，输入框占满剩余空间
    colon: true,
    size: 'default',
  },

  properties: {
    // 基础信息分组（布局容器 name 为空，避免数据路径嵌套）
    basicInfo: {
      type: 'card',
      name: '', // 布局容器不需要 name
      title: '基础信息',
      collapsible: true,
      defaultExpanded: true,
      properties: {
        username: {
          type: 'input',
          name: 'username',
          title: '用户名',
          description: '用户名由字母、数字、下划线组成，3-20个字符',
          required: true,
          rules: [
            { minLength: 3, message: '用户名至少3个字符' },
            { maxLength: 20, message: '用户名最多20个字符' },
            { pattern: '^[a-zA-Z][a-zA-Z0-9_]*$', message: '用户名必须以字母开头' },
          ],
          componentProps: {
            placeholder: '请输入用户名',
            clearable: true,
          },
          col: { span: 12 },
        },

        // ========== 密码字段 + 确认密码联动 ==========
        password: {
          type: 'password',
          name: 'password',
          title: '密码',
          required: true,
          rules: [
            { minLength: 6, message: '密码至少6个字符' },
            { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)', message: '密码需包含大小写字母和数字' },
          ],
          componentProps: {
            placeholder: '请输入密码',
            showPassword: true,
          },
          col: { span: 12 },
        },

        confirmPassword: {
          type: 'password',
          name: 'confirmPassword',
          title: '确认密码',
          required: true,
          // ✅ requiredWhen 测试：密码有值时必填
          requiredWhen: 'password',
          rules: [
            // 表达式验证：密码一致性校验
            { $expr: '$value === $values.password', message: '两次密码输入不一致' },
          ],
          componentProps: {
            placeholder: '请再次输入密码',
            showPassword: true,
          },
          col: { span: 12 },
        },

        email: {
          type: 'input',
          name: 'email',
          title: '邮箱',
          required: true,
          rules: [
            { format: 'email', message: '请输入正确的邮箱格式' },
          ],
          componentProps: {
            placeholder: '请输入邮箱',
            clearable: true,
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
          // ✅ 使用语法糖简化联动（替代 userType 上的 reactions）
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

        phone: {
          type: 'input',
          name: 'phone',
          title: '手机号',
          rules: [
            { format: 'phone', message: '请输入正确的手机号' },
          ],
          componentProps: {
            placeholder: '请输入手机号',
          },
          col: { span: 12 },
        },

        tags: {
          type: 'select',
          name: 'tags',
          title: '标签',
          multiple: true,
          dataSource: {
            type: 'static',
            data: [
              { label: '技术', value: 'tech' },
              { label: '产品', value: 'product' },
              { label: '设计', value: 'design' },
              { label: '运营', value: 'operation' },
            ],
          },
          componentProps: {
            placeholder: '请选择标签',
            multiple: true,
            collapseTags: true,
            maxCollapseTags: 2,
          },
          col: { span: 12 },
        },

        // Radio 单选框组
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

        // Switch 开关
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

        // Number 数字输入
        age: {
          type: 'number',
          name: 'age',
          title: '年龄',
          rules: [
            { min: 1, message: '年龄必须大于0' },
            { max: 150, message: '年龄不能超过150' },
          ],
          componentProps: {
            min: 1,
            max: 150,
            step: 1,
            placeholder: '请输入年龄',
          },
          col: { span: 12 },
        },

        // Date 日期选择
        birthday: {
          type: 'date',
          name: 'birthday',
          title: '生日',
          componentProps: {
            placeholder: '请选择生日',
            valueFormat: 'YYYY-MM-DD',
            style: { width: '100%' }, // 占满宽度
          },
          col: { span: 12 },
        },

        // DateRange 日期范围
        validPeriod: {
          type: 'dateRange',
          name: 'validPeriod',
          title: '有效期',
          componentProps: {
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'YYYY-MM-DD',
            style: { width: '100%' }, // 占满宽度
          },
          col: { span: 12 },
        },

        // Slider 滑块
        score: {
          type: 'slider',
          name: 'score',
          title: '评分',
          default: 60,
          componentProps: {
            min: 0,
            max: 100,
            step: 10,
            showStops: true,
            showInput: true,
          },
          col: { span: 12 },
        },

        // Rate 评分
        satisfaction: {
          type: 'rate',
          name: 'satisfaction',
          title: '满意度',
          default: 3,
          componentProps: {
            max: 5,
            allowHalf: true,
            texts: ['很差', '较差', '一般', '满意', '非常满意'],
            showText: true,
          },
          col: { span: 12 },
        },
      },
    },

    // 地址信息（void 类型的布局容器不产生数据，使用空 name）
    addressInfo: {
      type: 'collapse',
      name: '', // 布局容器不需要 name，避免路径嵌套
      panels: [
        {
          key: 'address',
          title: '地址信息',
          properties: {
            'address.province': {
              type: 'select',
              name: 'province',
              title: '省份',
              dataSource: {
                type: 'static',
                data: [
                  { label: '北京', value: 'beijing' },
                  { label: '上海', value: 'shanghai' },
                  { label: '广东', value: 'guangdong' },
                  { label: '浙江', value: 'zhejiang' },
                ],
              },
              componentProps: {
                placeholder: '请选择省份',
              },
              col: { span: 8 },
              // 联动：省份变化时清空城市
              reactions: [
                {
                  target: 'address.city',
                  fulfill: {
                    state: { value: '' },
                  },
                },
              ],
            },

            'address.city': {
              type: 'select',
              name: 'city',
              title: '城市',
              // ✅ 使用语法糖：省份有值时显示城市
              showWhen: 'address?.province',
              dataSource: {
                type: 'computed',
                expr: '{{({ beijing: [{ label: "朝阳区", value: "chaoyang" }, { label: "海淀区", value: "haidian" }], shanghai: [{ label: "浦东新区", value: "pudong" }, { label: "徐汇区", value: "xuhui" }], guangdong: [{ label: "广州", value: "guangzhou" }, { label: "深圳", value: "shenzhen" }], zhejiang: [{ label: "杭州", value: "hangzhou" }, { label: "宁波", value: "ningbo" }] })[$values.address?.province] || []}}',
                deps: ['address.province'],
              },
              componentProps: {
                placeholder: '请选择城市',
              },
              col: { span: 8 },
            },

            'address.detail': {
              type: 'textarea',
              name: 'detail',
              title: '详细地址',
              componentProps: {
                placeholder: '请输入详细地址',
                rows: 2,
                maxlength: 200,
                showWordLimit: true,
              },
              col: { span: 24 },
            },
          },
        },
      ],
      defaultActiveKey: ['address'],
    },

    // ========== 高级设置（Tabs 布局 + disabledWhen 测试） ==========
    advancedSettings: {
      type: 'tabs',
      name: '', // 布局容器不需要 name
      tabs: [
        {
          key: 'notification',
          title: '通知设置',
          properties: {
            notifyMethod: {
              type: 'radio',
              name: 'notifyMethod',
              title: '通知方式',
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

            // ✅ disabledWhen 测试：通知方式为"不通知"时禁用
            notifyEmail: {
              type: 'input',
              name: 'notifyEmail',
              title: '通知邮箱',
              // 通知方式不是邮件时禁用
              disabledWhen: 'notifyMethod !== "email"',
              // 通知方式是邮件时必填
              requiredWhen: 'notifyMethod === "email"',
              rules: [
                { format: 'email', message: '请输入正确的邮箱格式' },
              ],
              componentProps: {
                placeholder: '请输入通知邮箱',
              },
              col: { span: 12 },
            },

            notifyPhone: {
              type: 'input',
              name: 'notifyPhone',
              title: '通知手机',
              // ✅ showWhen + disabledWhen 组合测试
              showWhen: 'notifyMethod === "sms"',
              requiredWhen: 'notifyMethod === "sms"',
              rules: [
                { pattern: '^1[3-9]\\d{9}$', message: '请输入正确的手机号' },
              ],
              componentProps: {
                placeholder: '请输入接收短信的手机号',
              },
              col: { span: 12 },
            },
          },
        },
        {
          key: 'appearance',
          title: '外观设置',
          properties: {
            // ✅ 颜色选择器
            themeColor: {
              type: 'color',
              name: 'themeColor',
              title: '主题颜色',
              default: '#409EFF',
              componentProps: {
                showAlpha: true,
                predefine: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
              },
              col: { span: 12 },
            },

            // ✅ 时间选择器
            workTime: {
              type: 'time',
              name: 'workTime',
              title: '上班时间',
              componentProps: {
                placeholder: '选择上班时间',
                style: { width: '100%' },
              },
              col: { span: 12 },
            },
          },
        },
      ],
    },

    // ========== 工作经历（复杂数组字段 + 联动） ==========
    workExperiences: {
      type: 'array',
      name: 'workExperiences',
      title: '工作经历',
      description: '填写您的工作经历，至少填写一段',
      minItems: 1,
      maxItems: 10,
      operations: {
        add: { text: '添加工作经历' },
        remove: { confirm: true, confirmText: '确定删除此工作经历吗？' },
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
            componentProps: {
              placeholder: '请输入公司名称',
            },
            col: { span: 12 },
          },
          position: {
            type: 'input',
            name: 'position',
            title: '职位',
            required: true,
            componentProps: {
              placeholder: '请输入职位名称',
            },
            col: { span: 12 },
          },
          startDate: {
            type: 'date',
            name: 'startDate',
            title: '入职日期',
            required: true,
            componentProps: {
              placeholder: '选择入职日期',
              style: { width: '100%' },
            },
            col: { span: 8 },
          },
          // ✅ 数组项内的联动：勾选"至今"时禁用离职日期
          isCurrent: {
            type: 'switch',
            name: 'isCurrent',
            title: '至今',
            componentProps: {
              activeText: '是',
              inactiveText: '否',
            },
            col: { span: 8 },
          },
          endDate: {
            type: 'date',
            name: 'endDate',
            title: '离职日期',
            // ✅ 数组项内联动：勾选至今时隐藏
            // 注意：数组项内需要使用 $record 引用当前项的字段
            display: '{{$record?.isCurrent ? "none" : "visible"}}',
            componentProps: {
              placeholder: '选择离职日期',
              style: { width: '100%' },
            },
            col: { span: 8 },
          },
        },
      },
    },

    // 权限配置（数组）
    permissions: {
      type: 'array',
      name: 'permissions',
      title: '权限配置',
      minItems: 1,
      maxItems: 5,
      operations: {
        add: { text: '添加权限' },
        remove: { confirm: true, confirmText: '确定删除此权限配置吗？' },
        copy: true,
        move: true,
      },
      items: {
        type: 'object',
        name: '',
        properties: {
          module: {
            type: 'select',
            name: 'module',
            title: '模块',
            required: true,
            dataSource: {
              type: 'static',
              data: [
                { label: '用户管理', value: 'user' },
                { label: '订单管理', value: 'order' },
                { label: '商品管理', value: 'product' },
                { label: '系统设置', value: 'system' },
              ],
            },
            col: { span: 8 },
          },
          actions: {
            type: 'checkbox',
            name: 'actions',
            title: '操作权限',
            dataSource: {
              type: 'static',
              data: [
                { label: '查看', value: 'view' },
                { label: '新增', value: 'create' },
                { label: '编辑', value: 'edit' },
                { label: '删除', value: 'delete' },
              ],
            },
            col: { span: 16 },
          },
        },
      },
    },

    // 其他信息
    otherInfo: {
      type: 'group',
      name: 'otherInfo',
      title: '其他信息',
      properties: {
        remark: {
          type: 'textarea',
          name: 'remark',
          title: '备注',
          componentProps: {
            placeholder: '请输入备注信息',
            rows: 3,
            maxlength: 500,
            showWordLimit: true,
          },
          col: { span: 24 },
        },

        agreement: {
          type: 'checkbox',
          name: 'agreement',
          title: '',
          required: '{{$values.userType === "vip"}}',
          rules: [
            { $expr: '$value === true', message: '请阅读并同意用户协议' },
          ],
          dataSource: {
            type: 'static',
            data: [
              { label: '我已阅读并同意《用户协议》', value: true },
            ],
          },
          col: { span: 24 },
        },
      },
    },
  },

  // 全局副作用
  effects: [
    {
      name: '自动填充邮箱',
      watch: 'username',
      when: '{{$values.username && !$values.email}}',
      run: {
        $set: {
          target: 'email',
          value: '{{$values.username + "@example.com"}}',
        },
      },
      debounce: 500,
    },
  ],

  // 提交配置
  submit: {
    text: '提交',
    validate: true,
    confirm: {
      title: '确认提交',
      content: '请确认信息填写正确，确定要提交吗？',
    },
    onSuccess: [
      { $notify: { type: 'success', message: '提交成功！' } },
    ],
    onError: [
      { $notify: { type: 'error', message: '{{$error.message || "提交失败"}}' } },
    ],
  },

  reset: {
    text: '重置',
    confirm: true,
  },

  // 处理函数
  handlers: {
    handleUsernameChange(value: string, ctx: any) {
      console.log('用户名变化:', value)
    },
  },
}

/**
 * 表单值变化
 */
function handleChange(values: Record<string, any>, field: string, value: any) {
  currentValues.value = values
  console.log('表单值变化:', { field, value, values })
}

/**
 * 字段值变化
 */
function handleFieldChange(field: string, value: any, oldValue: any) {
  console.log('字段值变化:', { field, value, oldValue })
}

/**
 * 表单提交
 */
function handleSubmit(values: Record<string, any>) {
  console.log('表单提交:', values)
}

/**
 * 提交成功
 */
function handleSubmitSuccess(response: any, values: Record<string, any>) {
  console.log('提交成功:', { response, values })
  ElMessage.success('表单提交成功！')
}

/**
 * 提交失败
 */
function handleSubmitError(error: Error, values: Record<string, any>) {
  console.error('提交失败:', { error, values })
}

/**
 * 表单重置
 */
function handleReset() {
  console.log('表单已重置')
  currentValues.value = {}
}

/**
 * 表单校验
 */
function handleValidate(result: any) {
  console.log('校验结果:', result)
}
</script>

<style scoped>
.config-form-example {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.config-form-example h1 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

.example-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.example-schema {
  margin-top: 24px;
}

.example-schema pre {
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 400px;
}
</style>
