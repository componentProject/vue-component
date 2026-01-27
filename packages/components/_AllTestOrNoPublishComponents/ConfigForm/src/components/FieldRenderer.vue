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
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="scope">
          <!-- @ts-ignore 动态 slot 转发的类型推断限制 -->
          <slot :name="slotName" v-bind="scope || {}" />
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
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="scope">
          <!-- @ts-ignore 动态 slot 转发的类型推断限制 -->
          <slot :name="slotName" v-bind="scope || {}" />
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
        <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="scope">
          <!-- @ts-ignore 动态 slot 转发的类型推断限制 -->
          <slot :name="slotName" v-bind="scope || {}" />
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
        <template v-if="$slots[`field-label-${field.name}`]" #label>
          <slot :name="`field-label-${field.name}`" :field="field" :path="path" :value="fieldValue" :context="context" />
        </template>

        <div class="config-form-field">
          <!-- 前缀插槽 -->
          <slot :name="`field-prefix-${field.name}`" :field="field" :path="path" :value="fieldValue" :context="context" />

          <!-- 自定义字段插槽 -->
          <template v-if="$slots[`field-${field.name}`]">
            <slot :name="`field-${field.name}`" :field="field" :path="path" :value="fieldValue" :context="context" :disabled="isDisabled" :readonly="isReadonly" />
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
          <slot :name="`field-suffix-${field.name}`" :field="field" :path="path" :value="fieldValue" :context="context" />
        </div>

        <!-- 额外内容插槽 -->
        <template v-if="$slots[`field-extra-${field.name}`]" #extra>
          <slot :name="`field-extra-${field.name}`" :field="field" :path="path" :value="fieldValue" :context="context" />
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

// Adapter 功能配置
const adapterFeatures = computed(() => adapter?.value.features || {})

// 是否通过 props 传递选项（而不是子组件）
const useOptionsAsProps = computed(() => adapterFeatures.value.optionsAsProps === true)

// 选项组件（用于子组件渲染方式）
const optionComponents = computed(() => adapterFeatures.value.optionComponents || {})

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
const isDisabled = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  const pattern = executePattern()
  return pattern === 'disabled' || pattern === 'readOnly' || pattern === 'readPretty'
})

// 是否只读 - 显式依赖 formValuesJSON 以触发响应式更新
const isReadonly = computed(() => {
  // 显式追踪 formValues 的变化
  void formValuesJSON.value
  const pattern = executePattern()
  return pattern === 'readOnly' || pattern === 'readPretty'
})

// 是否多选（简化为单行表达式）
const isMultiSelect = computed(() =>
  props.field.type === 'multiSelect' || !!(props.field as SelectFieldConfig).multiple,
)

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
      message: `${computedLabel.value || props.field.name}不能为空`,
      trigger: props.field.validateTrigger || 'blur',
    })
  }

  // 处理其他规则
  if (props.field.rules) {
    for (const rule of props.field.rules) {
      if ('required' in rule && rule.required) {
        rules.push({
          required: true,
          message: rule.message || `${computedLabel.value || props.field.name}不能为空`,
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
      // API 数据需要异步加载，这里返回已加载的缓存数据
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
 * 处理值变化
 */
function handleChange(value: any) {
  emit('change', value)

  // 调用 onChange 处理函数
  if (props.field.onChange && formHandlers[props.field.onChange]) {
    formHandlers[props.field.onChange](value, props.context)
  }
}

/**
 * 处理聚焦
 */
function handleFocus() {
  emit('focus')

  if (props.field.onFocus && formHandlers[props.field.onFocus]) {
    formHandlers[props.field.onFocus](fieldValue.value, props.context)
  }
}

/**
 * 处理失焦
 */
function handleBlur() {
  emit('blur')

  if (props.field.onBlur && formHandlers[props.field.onBlur]) {
    formHandlers[props.field.onBlur](fieldValue.value, props.context)
  }
}

// 监听字段初始化
watch(
  () => props.field,
  () => {
    if (props.field.onInit && formHandlers[props.field.onInit]) {
      formHandlers[props.field.onInit](fieldValue.value, props.context)
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
</style>
