<!-- FieldRenderer - 字段渲染器组件 -->
<template>
  <template v-if="shouldRender">
    <!-- 布局类型字段 -->
    <template v-if="isVoidField">
      <VoidFieldRenderer
        :field="voidField"
        :path="path"
        :context="context"
      >
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotScope">
          <slot :name="slotName" v-bind="slotScope || {}" />
        </template>
      </VoidFieldRenderer>
    </template>

    <!-- 数组类型字段 -->
    <template v-else-if="isArrayField">
      <ArrayFieldRenderer
        v-model="fieldValue"
        :field="arrayField"
        :path="path"
        :context="context"
        @change="handleChange"
      >
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotScope">
          <slot :name="slotName" v-bind="slotScope || {}" />
        </template>
      </ArrayFieldRenderer>
    </template>

    <!-- 对象类型字段 -->
    <template v-else-if="isObjectField">
      <ObjectFieldRenderer
        v-model="fieldValue"
        :field="objectField"
        :path="path"
        :context="context"
        @change="handleChange"
      >
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotScope">
          <slot :name="slotName" v-bind="slotScope || {}" />
        </template>
      </ObjectFieldRenderer>
    </template>

    <!-- 基础类型字段 -->
    <template v-else>
      <component
        :is="layoutComponents.formItem"
        :label="computedLabel"
        :rules="computedRules"
        :required="computedRequired"
        v-bind="computedFormItemProps"
      >
        <!-- 标签插槽 -->
        <template v-if="$slots[`field-label-${fieldName}`]" #label>
          <slot :name="`field-label-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" />
        </template>

        <div class="config-form-field">
          <!-- 前缀插槽 -->
          <slot :name="`field-prefix-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" />

          <!-- 自定义字段插槽 -->
          <template v-if="$slots[`field-${fieldName}`]">
            <slot :name="`field-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" :disabled="isDisabled" :readonly="isReadonly" :read-pretty="isReadPretty" />
          </template>

          <!-- ReadPretty 模式 - 纯文本展示（业界标准做法） -->
          <template v-else-if="isReadPretty">
            <div
              class="config-form-field__read-pretty"
              :class="readPrettyClass"
              :style="readPrettyStyle"
            >
              <!-- 颜色字段特殊展示 -->
              <template v-if="field.type === 'color' && fieldValue">
                <span class="config-form-field__color-preview" :style="{ backgroundColor: fieldValue }" />
                <span class="config-form-field__text">{{ fieldValue }}</span>
              </template>
              <!-- 上传字段特殊展示 -->
              <template v-else-if="field.type === 'upload' && Array.isArray(fieldValue)">
                <div class="config-form-field__files">
                  <span v-for="(file, index) in fieldValue" :key="index" class="config-form-field__file">
                    {{ file.name || file.url || file }}
                  </span>
                </div>
              </template>
              <!-- 文本域多行展示 -->
              <template v-else-if="field.type === 'textarea'">
                <div class="config-form-field__textarea-preview">
                  {{ formattedValue }}
                </div>
              </template>
              <!-- 富文本预览 -->
              <template v-else-if="field.type === 'richText'">
                <div class="config-form-field__rich-text-preview" v-html="formattedValue" />
              </template>
              <!-- 代码预览 -->
              <template v-else-if="field.type === 'codeEditor'">
                <pre class="config-form-field__code-preview"><code>{{ formattedValue }}</code></pre>
              </template>
              <!-- 默认文本展示 -->
              <template v-else>
                <span class="config-form-field__text">{{ formattedValue }}</span>
              </template>
            </div>
          </template>

          <!-- 标准字段组件 -->
          <template v-else>
            <!-- 使用动态组件渲染所有字段 -->
            <component
              :is="fieldComponent"
              v-model="fieldValue"
              :disabled="isDisabled"
              :readonly="isReadonly"
              v-bind="computedComponentProps"
              @change="handleChange"
              @focus="handleFocus"
              @blur="handleBlur"
            >
              <!-- Select/Radio/Checkbox 的选项渲染 (通过子组件方式，如 Element Plus) -->
              <template v-if="hasOptions && !useOptionsAsProps">
                <component
                  :is="getOptionComponent(field.type)"
                  v-for="opt in computedOptions"
                  :key="opt.value"
                  :label="getOptionLabel(field.type, opt)"
                  :value="opt.value"
                  :disabled="opt.disabled"
                >
                  <template v-if="needsOptionContent">
                    {{ opt.label }}
                  </template>
                </component>
              </template>
            </component>
          </template>

          <!-- 后缀插槽 -->
          <slot :name="`field-suffix-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" />
        </div>

        <!-- 额外内容插槽 -->
        <template v-if="$slots[`field-extra-${fieldName}`]" #extra>
          <slot :name="`field-extra-${fieldName}`" :field="field" :path="path" :value="fieldValue" :context="context" />
        </template>

        <!-- 描述信息 -->
        <template v-else-if="computedDescription" #extra>
          <span class="config-form-field__description">{{ computedDescription }}</span>
        </template>
      </component>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { ArrayFieldConfig, FieldConfig, FieldState, FormContext, ObjectFieldConfig, SelectFieldConfig, UIAdapter, VoidFieldConfig } from '../_types'
import { computed, defineAsyncComponent, inject, toRef, watch } from 'vue'
import { executeExpression } from '../_utils'
import { useFieldExpression } from '../composables/useFieldExpression'

/**
 * 表单项规则接口（跨框架通用）
 */
interface FormItemRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (rule: any, value: any, callback: any) => void
  [key: string]: any
}

defineOptions({
  name: 'FieldRenderer',
})

const props = defineProps<{
  /** 字段配置 */
  field: FieldConfig
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
}>()

const emit = defineEmits<{
  (e: 'change', value: any): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

/**
 * 根据格式模式格式化 Date 对象
 * 支持常见的日期格式符号：YYYY, MM, DD, HH, mm, ss
 * @param date - Date 对象
 * @param pattern - 格式模式，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
function formatDateByPattern(date: Date, pattern: string): string {
  const padZero = (num: number, length = 2) => String(num).padStart(length, '0')

  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MM: padZero(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    DD: padZero(date.getDate()),
    D: String(date.getDate()),
    HH: padZero(date.getHours()),
    H: String(date.getHours()),
    mm: padZero(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: padZero(date.getSeconds()),
    s: String(date.getSeconds()),
  }

  // 按 token 长度降序排列，确保 YYYY 在 YY 之前被替换
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length)

  let result = pattern
  for (const token of sortedTokens) {
    result = result.replace(new RegExp(token, 'g'), tokens[token])
  }

  return result
}

// 异步加载复杂字段渲染器
const VoidFieldRenderer = defineAsyncComponent(() => import('./VoidFieldRenderer.vue'))
const ArrayFieldRenderer = defineAsyncComponent(() => import('./ArrayFieldRenderer.vue'))
const ObjectFieldRenderer = defineAsyncComponent(() => import('./ObjectFieldRenderer.vue'))

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

// 布局组件快捷访问
const layoutComponents = computed(() => adapter?.value.components.layout || {})

// 字段组件快捷访问
const fieldComponents = computed(() => adapter?.value.components.fields || {})

// 适配器功能配置
const adapterFeatures = computed(() => adapter?.value.features || {})

// 是否通过 props 传递选项（而不是子组件）
const useOptionsAsProps = computed(() => adapterFeatures.value.optionsAsProps === true)

// 选项组件（用于子组件渲染方式）
const optionComponents = computed(() => adapterFeatures.value.optionComponents || {})

/**
 * 字段名称（用于插槽命名等）
 * 如果 field.name 未指定，使用 path 作为默认值
 */
const fieldName = computed(() => props.field.name || props.path)

// 注入字段状态 Map
const fieldStates = inject<Map<string, FieldState>>('configFormFieldStates', new Map())

// 字段值
const fieldValue = computed({
  get() {
    return getNestedValue(formValues, props.path)
  },
  set(value) {
    setNestedValue(formValues, props.path, value)
  },
})

// 字段状态
const fieldState = computed(() => fieldStates.get(props.path))

// 使用表达式 composable（提取关键字常量 + 表达式执行逻辑）
const {
  formValues,
  formHandlers,
  executeDisplay,
  executePattern,
  executeRequired,
} = useFieldExpression(
  toRef(props, 'field'),
  fieldValue,
  fieldState,
  toRef(props, 'context'),
)

// 序列化所有表单值用于依赖追踪
const formValuesJSON = computed(() => JSON.stringify(formValues))

// 判断字段类型
const isVoidField = computed(() => ['void', 'group', 'card', 'collapse', 'tabs', 'divider', 'alert'].includes(props.field.type))
const isArrayField = computed(() => props.field.type === 'array')
const isObjectField = computed(() => props.field.type === 'object')

// 类型化的字段（用于子组件）
const voidField = computed(() => props.field as VoidFieldConfig)
const arrayField = computed(() => props.field as ArrayFieldConfig)
const objectField = computed(() => props.field as ObjectFieldConfig)

// 是否应该渲染 - 显式依赖 formValuesJSON 以触发响应式更新
const shouldRender = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  const display = executeDisplay()
  return display !== 'none'
})

// 是否禁用 - 显式依赖 formValuesJSON 以触发响应式更新
// 注意：readPretty 模式不应该设置 disabled，只通过 CSS 禁止交互
const isDisabled = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  const pattern = executePattern()
  return pattern === 'disabled'
})

// 是否只读 - 显式依赖 formValuesJSON 以触发响应式更新
// 注意：readPretty 模式不应该设置 readonly，只通过 CSS 禁止交互
const isReadonly = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  const pattern = executePattern()
  return pattern === 'readOnly'
})

// 是否阅读态（纯文本展示）- 显式依赖 formValuesJSON 以触发响应式更新
const isReadPretty = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  const pattern = executePattern()
  return pattern === 'readPretty'
})

/**
 * 格式化字段值用于 readPretty 模式展示
 * @returns 格式化后的文本
 */
const formattedValue = computed(() => {
  const value = fieldValue.value
  const type = props.field.type

  // 空值处理
  if (value === undefined || value === null || value === '') {
    return '-'
  }

  // 根据字段类型格式化
  switch (type) {
    case 'switch':
      return value ? '是' : '否'

    case 'select':
    case 'radio': {
      // 从选项中找到对应的 label
      const options = computedOptions.value
      const option = options.find(opt => opt.value === value)
      return option?.label || value
    }

    case 'multiSelect':
    case 'checkbox': {
      // 多选值，从选项中找到对应的 labels
      if (!Array.isArray(value)) {
        return value
      }
      const options = computedOptions.value
      const labels = value.map((v) => {
        const option = options.find(opt => opt.value === v)
        return option?.label || v
      })
      return labels.join('、')
    }

    case 'date':
    case 'datetime':
    case 'time': {
      // 日期时间格式化展示
      // 业界标准：使用 componentProps.format 作为显示格式
      const displayFormat = computedComponentProps.value.format
      const defaultFormats: Record<string, string> = {
        date: 'YYYY-MM-DD',
        datetime: 'YYYY-MM-DD HH:mm:ss',
        time: 'HH:mm:ss',
      }
      const format = displayFormat || defaultFormats[type]

      // dayjs 或 moment 对象：使用 format 方法
      if (value && typeof value === 'object' && typeof value.format === 'function') {
        return value.format(format)
      }

      // Date 对象：转换为本地格式
      if (value instanceof Date) {
        // 如果有自定义格式，需要手动格式化
        if (displayFormat) {
          // 简单的格式化实现（支持常见的格式符号）
          return formatDateByPattern(value, format)
        }
        // 无自定义格式时使用本地化
        return type === 'time'
          ? value.toLocaleTimeString()
          : type === 'datetime'
            ? value.toLocaleString()
            : value.toLocaleDateString()
      }

      // 字符串：直接返回（已经是格式化后的值）
      return value || '-'
    }

    case 'dateRange':
    case 'datetimeRange': {
      // 日期范围格式化展示
      const displayFormat = computedComponentProps.value.format
      const defaultFormat = type === 'datetimeRange' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
      const format = displayFormat || defaultFormat

      if (Array.isArray(value) && value.length === 2) {
        const formatValue = (v: any) => {
          if (!v)
            return '-'
          if (typeof v === 'object' && typeof v.format === 'function') {
            return v.format(format)
          }
          return v
        }
        return `${formatValue(value[0])} 至 ${formatValue(value[1])}`
      }
      return value || '-'
    }

    case 'rate':
      return `${value} 星`

    case 'slider':
      return `${value}`

    case 'color':
      return value

    case 'number':
      return typeof value === 'number' ? value.toString() : value

    case 'textarea':
      return value

    case 'password':
      return '******'

    case 'upload':
      // 上传文件列表
      if (Array.isArray(value)) {
        return value.map((f: any) => f.name || f.url || f).join('、')
      }
      return value

    case 'richText':
      // 富文本内容（可能包含 HTML）
      return value

    case 'codeEditor':
      // 代码内容
      return value

    default:
      // 默认直接返回值
      return typeof value === 'object' ? JSON.stringify(value) : value
  }
})

// ReadPretty 模式下的样式计算
// 使用 adapter transformer 提取样式，支持不同 UI 框架的配置方式
// Element Plus: 从 inputStyle 提取 (Input 内部样式)
// Ant Design Vue: 从 style 提取
const readPrettyStyle = computed(() => {
  const componentProps = props.field.componentProps || {}
  const fieldType = props.field.type

  // 使用 adapter 的 transformer.readPrettyStyle 提取用户样式
  // 如果 adapter 没有定义，默认从 style 获取
  let userStyle: Record<string, any> | string = {}
  if (adapter?.value?.transformer?.readPrettyStyle) {
    userStyle = adapter.value.transformer.readPrettyStyle(fieldType, componentProps)
  }
  else {
    // 默认 fallback：直接从 style 获取
    userStyle = componentProps.style || {}
  }

  // 默认样式
  const defaultStyles: Record<string, any> = {
    minHeight: '32px',
    lineHeight: '32px',
  }

  // 如果用户传递了 style，提取相关的样式属性
  if (typeof userStyle === 'object') {
    const styleKeys = [
      'padding',
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'lineHeight',
      'height',
      'minHeight',
      'textAlign',
      'color',
      'backgroundColor',
      'borderRadius',
    ]
    for (const key of styleKeys) {
      if (userStyle[key] !== undefined) {
        defaultStyles[key] = userStyle[key]
      }
    }
  }
  else if (typeof userStyle === 'string') {
    // 如果是字符串格式的 style，直接返回用户样式
    return userStyle
  }

  return defaultStyles
})

// ReadPretty 模式下的 class 计算
const readPrettyClass = computed(() => {
  return props.field.componentProps?.class || ''
})

// 计算标签
const computedLabel = computed(() => {
  if (!props.field.title) {
    return undefined
  }
  return executeExpression(props.field.title, props.context, { handlers: formHandlers })
})

// 计算描述
const computedDescription = computed(() => {
  if (!props.field.description) {
    return undefined
  }
  return executeExpression(props.field.description, props.context, { handlers: formHandlers })
})

// 计算是否必填（支持语法糖）
const computedRequired = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  return executeRequired()
})

// 计算校验规则
const computedRules = computed<FormItemRule[]>(() => {
  const rules: FormItemRule[] = []

  // 添加必填规则
  if (computedRequired.value) {
    rules.push({
      required: true,
      message: `${computedLabel.value || fieldName.value}不能为空`,
      trigger: props.field.validateTrigger || 'blur',
    })
  }

  // 处理其他规则
  if (props.field.rules) {
    for (const rule of props.field.rules) {
      if ('required' in rule && rule.required) {
        rules.push({
          required: true,
          message: rule.message || `${computedLabel.value || fieldName.value}不能为空`,
          trigger: rule.trigger || 'blur',
        })
      }
      else if ('minLength' in rule) {
        rules.push({
          min: rule.minLength,
          message: rule.message || `最少输入${rule.minLength}个字符`,
          trigger: rule.trigger || 'blur',
        })
      }
      else if ('maxLength' in rule) {
        rules.push({
          max: rule.maxLength,
          message: rule.message || `最多输入${rule.maxLength}个字符`,
          trigger: rule.trigger || 'blur',
        })
      }
      else if ('min' in rule) {
        rules.push({
          type: 'number',
          min: rule.min,
          message: rule.message || `不能小于${rule.min}`,
          trigger: rule.trigger || 'blur',
        })
      }
      else if ('max' in rule) {
        rules.push({
          type: 'number',
          max: rule.max,
          message: rule.message || `不能大于${rule.max}`,
          trigger: rule.trigger || 'blur',
        })
      }
      else if ('pattern' in rule) {
        rules.push({
          pattern: new RegExp(rule.pattern, rule.flags),
          message: rule.message || '格式不正确',
          trigger: rule.trigger || 'blur',
        })
      }
      else if ('format' in rule) {
        const formatPatterns: Record<string, RegExp> = {
          email: /^[\w.-]+@[\w.-]+\.\w+$/,
          url: /^https?:\/\/.+/,
          phone: /^1[3-9]\d{9}$/,
          idcard: /^[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i,
          ip: /^(\d{1,3}\.){3}\d{1,3}$/,
        }
        const pattern = formatPatterns[rule.format]
        if (pattern) {
          rules.push({
            pattern,
            message: rule.message || `${rule.format}格式不正确`,
            trigger: rule.trigger || 'blur',
          })
        }
      }
      else if ('$expr' in rule) {
        rules.push({
          validator: (_rule, value, callback) => {
            const result = executeExpression(
              `{{${rule.$expr}}}`,
              { ...props.context, $value: value },
              { handlers: formHandlers },
            )
            if (result) {
              callback()
            }
            else {
              callback(new Error(rule.message || '校验失败'))
            }
          },
          trigger: rule.trigger || 'blur',
        })
      }
    }
  }

  return rules
})

// 计算组件属性
const computedComponentProps = computed(() => {
  const baseProps: Record<string, any> = {}

  // 处理 componentProps
  if (props.field.componentProps) {
    for (const [key, value] of Object.entries(props.field.componentProps)) {
      baseProps[key] = executeExpression(value, props.context, { handlers: formHandlers })
    }
  }

  // 处理 multiSelect - 添加 multiple 属性
  if (props.field.type === 'multiSelect') {
    baseProps.multiple = true
  }

  // 如果 adapter 配置使用 props 传递选项，则添加 options
  if (useOptionsAsProps.value && hasOptions.value) {
    baseProps.options = computedOptions.value
  }

  // 使用 adapter 的 transformer 转换 props
  if (adapter?.value.transformer?.field) {
    return adapter.value.transformer.field(props.field.type, baseProps, {
      field: props.field,
      path: props.path,
    })
  }

  return baseProps
})

// 选项类型
interface OptionItem {
  label: string
  value: any
  disabled?: boolean
  children?: OptionItem[]
}

// 计算选项 - 显式依赖 formValuesJSON 以触发响应式更新
const computedOptions = computed<OptionItem[]>(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value

  // 类型断言：只有 SelectFieldConfig 类型才有 dataSource
  const field = props.field as SelectFieldConfig
  const dataSource = field.dataSource
  if (!dataSource) {
    return []
  }

  switch (dataSource.type) {
    case 'static':
      // 静态数据
      return (dataSource.data || []) as OptionItem[]

    case 'computed':
      // 计算表达式数据
      if (dataSource.expr) {
        const result = executeExpression(dataSource.expr, props.context, { handlers: formHandlers })
        return Array.isArray(result) ? result : []
      }
      return []

    case 'dict':
      // 字典数据（从 context 获取）
      if (dataSource.code) {
        const dictData = props.context.$context?.dicts?.[dataSource.code]
        return Array.isArray(dictData) ? dictData : []
      }
      return []

    case 'api':
      // API 数据需要异步加载，返回已缓存的数据
      // 实际实现需要 useFieldDataSource composable
      return fieldState.value?.dataSource || []

    case 'cascade':
      // 级联数据 - 从父字段依赖获取
      if (dataSource.dependsOn) {
        const parentValue = getNestedValue(formValues, dataSource.dependsOn)
        // 如果父级有值，返回缓存的级联数据
        if (parentValue != null && parentValue !== '') {
          return fieldState.value?.dataSource || []
        }
      }
      return []

    default:
      return []
  }
})

// 计算装饰器属性（不含字段名属性）
const decoratorProps = computed(() => {
  const baseProps: Record<string, any> = {}

  // 处理 decoratorProps
  if (props.field.decoratorProps) {
    for (const [key, value] of Object.entries(props.field.decoratorProps)) {
      baseProps[key] = executeExpression(value, props.context, { handlers: formHandlers })
    }
  }

  return baseProps
})

/**
 * Convert dot-separated path to array path
 * 将点分隔的路径转换为数组路径
 * @example 'workExperience.0.position' => ['workExperience', 0, 'position']
 */
function pathToArray(path: string): (string | number)[] {
  return path.split('.').map((key) => {
    const num = Number.parseInt(key, 10)
    return Number.isNaN(num) ? key : num
  })
}

// 计算 FormItem 完整属性（包含字段名属性）
const computedFormItemProps = computed(() => {
  const baseProps: Record<string, any> = { ...decoratorProps.value }

  // 根据 adapter 配置设置字段名属性
  const nameProp = adapterFeatures.value.formItemNameProp || 'prop'
  if (nameProp === 'name') {
    // Ant Design Vue 需要数组格式的路径用于嵌套字段验证
    baseProps.name = props.path.includes('.') ? pathToArray(props.path) : props.path
  }
  else {
    baseProps.prop = props.path
  }

  // 使用 adapter 的 transformer 转换 formItem props
  if (adapter?.value.transformer?.formItem) {
    return adapter.value.transformer.formItem({
      ...baseProps,
      label: computedLabel.value,
    })
  }

  return baseProps
})

// 是否有选项（select/radio/checkbox）
const hasOptions = computed(() => ['select', 'multiSelect', 'radio', 'checkbox'].includes(props.field.type))

// 是否需要选项内容（radio/checkbox 需要显示 label 文本）
const needsOptionContent = computed(() => ['radio', 'checkbox'].includes(props.field.type))

/**
 * 获取字段组件（从 adapter 中获取）
 */
const fieldComponent = computed(() => {
  const field = props.field as any

  // 自定义组件优先
  if (field.type === 'custom' && field.customComponent) {
    return field.customComponent
  }

  // 指定组件名
  if (field.component) {
    return Array.isArray(field.component) ? field.component[0] : field.component
  }

  // 从 adapter 获取组件
  const type = field.type as string
  const components = fieldComponents.value
  return components[type] || components.input
})

/**
 * 获取选项组件（从 adapter 的 features.optionComponents 获取）
 */
function getOptionComponent(type: string) {
  const components = optionComponents.value
  switch (type) {
    case 'select':
    case 'multiSelect':
      return components.select
    case 'radio':
      return components.radio
    case 'checkbox':
      return components.checkbox
    default:
      return components.select
  }
}

/**
 * 获取选项的 label prop 值
 * Element Plus Select.Option 使用 label prop
 * Radio/Checkbox 使用 value prop
 */
function getOptionLabel(type: string, opt: { label: string, value: any }) {
  if (type === 'select' || type === 'multiSelect') {
    return opt.label
  }
  return opt.value
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

/**
 * 设置嵌套对象的值
 */
function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((acc, key) => {
    if (acc[key] === undefined) {
      acc[key] = {}
    }
    return acc[key]
  }, obj)
  target[lastKey] = value
}

/**
 * 创建 Handler 上下文
 * @param value - 当前字段值
 * @param event - 触发事件类型
 * @returns HandlerContext 对象
 */
function createHandlerContext(value: unknown, event: 'init' | 'change' | 'focus' | 'blur') {
  return {
    ...props.context,
    value,
    path: props.path,
    field: props.field,
    event,
  }
}

/**
 * 处理值变化
 * @param value - 新的字段值
 */
function handleChange(value: unknown) {
  emit('change', value)

  // 调用 onChange 处理函数
  if (props.field.onChange && formHandlers[props.field.onChange]) {
    formHandlers[props.field.onChange](createHandlerContext(value, 'change'))
  }
}

/**
 * 处理聚焦
 */
function handleFocus() {
  emit('focus')

  if (props.field.onFocus && formHandlers[props.field.onFocus]) {
    formHandlers[props.field.onFocus](createHandlerContext(fieldValue.value, 'focus'))
  }
}

/**
 * 处理失焦
 */
function handleBlur() {
  emit('blur')

  if (props.field.onBlur && formHandlers[props.field.onBlur]) {
    formHandlers[props.field.onBlur](createHandlerContext(fieldValue.value, 'blur'))
  }
}

// 监听字段初始化
watch(
  () => props.field,
  () => {
    if (props.field.onInit && formHandlers[props.field.onInit]) {
      formHandlers[props.field.onInit](createHandlerContext(fieldValue.value, 'init'))
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.config-form-field {
  display: flex;
  align-items: center;
  width: 100%;
}

.config-form-field__description {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;
}

/* ReadPretty 模式样式 - 纯文本展示（业界标准做法） */
.config-form-field__read-pretty {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 32px;
  line-height: 32px;
  color: var(--el-text-color-primary, #303133);
  width: 100%;
  box-sizing: border-box;
}

.config-form-field__text {
  word-break: break-word;
}

.config-form-field__color-preview {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color, #dcdfe6);
  margin-right: 8px;
  flex-shrink: 0;
}

.config-form-field__textarea-preview {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.config-form-field__files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.config-form-field__file {
  padding: 4px 8px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
  font-size: 12px;
}

.config-form-field__rich-text-preview {
  line-height: 1.6;
  word-break: break-word;
}

.config-form-field__rich-text-preview :deep(p) {
  margin: 0 0 0.5em;
}

.config-form-field__rich-text-preview :deep(ul),
.config-form-field__rich-text-preview :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.config-form-field__code-preview {
  margin: 0;
  padding: 12px;
  background-color: var(--el-fill-color-darker, #1e1e1e);
  border-radius: 4px;
  overflow-x: auto;
  width: 100%;
}

.config-form-field__code-preview code {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-color-white, #fff);
  white-space: pre;
}
</style>
