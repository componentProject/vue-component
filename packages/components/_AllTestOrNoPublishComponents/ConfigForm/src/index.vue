<!-- ConfigForm - 配置化表单主组件 -->
<template>
  <div class="config-form" :class="formClass">
    <!-- 加载状态 -->
    <template v-if="props.loading">
      <slot name="loading">
        <div class="config-form__loading">
          <component :is="layoutComponents.skeleton" :rows="5" animated />
        </div>
      </slot>
    </template>

    <!-- 表单内容 -->
    <template v-else>
      <!-- 头部插槽 -->
      <slot name="header" :context="formContext" />

      <component
        :is="layoutComponents.form"
        ref="formRef"
        :model="values"
        :label-width="isAntdLayoutStyle ? undefined : labelWidth"
        :label-position="isAntdLayoutStyle ? undefined : labelPosition"
        :size="formSize"
        :disabled="formDisabled"
        :scroll-to-error="props.scrollToFirstError"
        v-bind="formProps"
      >
        <!-- 默认插槽 - 自定义整个表单 -->
        <slot :context="formContext">
          <!-- 操作按钮 - 顶部 -->
          <div v-if="showTopActions" class="config-form__actions config-form__actions--top" :style="actionsStyle">
            <slot name="actions" :context="formContext" :submit="handleSubmit" :reset="handleReset" :validate="handleValidate" :submitting="submitting" :validating="formState.validating" :valid="formState.valid">
              <slot name="submitButton" :context="formContext" :submit="handleSubmit" :submitting="submitting">
                <component
                  :is="layoutComponents.button"
                  v-if="props.showSubmit"
                  type="primary"
                  :loading="submitting"
                  v-bind="submitButtonProps"
                  @click="handleSubmit"
                >
                  {{ submitButtonText }}
                </component>
              </slot>
              <slot name="resetButton" :context="formContext" :reset="handleReset">
                <component
                  :is="layoutComponents.button"
                  v-if="props.showReset"
                  v-bind="resetButtonProps"
                  @click="handleReset"
                >
                  {{ resetButtonText }}
                </component>
              </slot>
            </slot>
          </div>

          <!-- 字段渲染 - inline 布局时不使用 Row/Col -->
          <template v-if="isInlineLayout">
            <template v-for="(field, fieldName) in schema.properties" :key="fieldName">
              <FieldRenderer
                :field="field"
                :path="fieldName as string"
                :context="formContext"
                @change="handleFieldChange(fieldName as string, $event)"
                @focus="handleFieldFocus(fieldName as string)"
                @blur="handleFieldBlur(fieldName as string)"
              >
                <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FieldRenderer>
            </template>
          </template>

          <!-- 字段渲染 - 非 inline 布局使用 Row/Col -->
          <component :is="layoutComponents.row" v-else :gutter="16">
            <template v-for="(field, fieldName) in schema.properties" :key="fieldName">
              <component :is="layoutComponents.col" v-bind="getColProps(field)">
                <FieldRenderer
                  :field="field"
                  :path="fieldName as string"
                  :context="formContext"
                  @change="handleFieldChange(fieldName as string, $event)"
                  @focus="handleFieldFocus(fieldName as string)"
                  @blur="handleFieldBlur(fieldName as string)"
                >
                  <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FieldRenderer>
              </component>
            </template>
          </component>

          <!-- 操作按钮 - 底部 -->
          <div v-if="showBottomActions" class="config-form__actions config-form__actions--bottom" :style="actionsStyle">
            <slot name="actions" :context="formContext" :submit="handleSubmit" :reset="handleReset" :validate="handleValidate" :submitting="submitting" :validating="formState.validating" :valid="formState.valid">
              <slot name="submitButton" :context="formContext" :submit="handleSubmit" :submitting="submitting">
                <component
                  :is="layoutComponents.button"
                  v-if="props.showSubmit"
                  type="primary"
                  :loading="submitting"
                  v-bind="submitButtonProps"
                  @click="handleSubmit"
                >
                  {{ submitButtonText }}
                </component>
              </slot>
              <slot name="resetButton" :context="formContext" :reset="handleReset">
                <component
                  :is="layoutComponents.button"
                  v-if="props.showReset"
                  v-bind="resetButtonProps"
                  @click="handleReset"
                >
                  {{ resetButtonText }}
                </component>
              </slot>
            </slot>
          </div>
        </slot>
      </component>

      <!-- 底部插槽 -->
      <slot name="footer" :context="formContext" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { emitsType, FieldConfig, FormContext, FormInstance, FormSchema, propsType, slotsType, UIAdapter } from './_types'
import { computed, onMounted, onUnmounted, provide, toRaw, useTemplateRef } from 'vue'
import { elementPlusAdapter } from './adapters'
import { FieldRenderer } from './components'
import { useFormState, useFormSubmit, useFormValidation } from './composables'

defineOptions({
  name: 'ConfigForm',
})

const props = withDefaults(defineProps<propsType>(), {
  initialValues: () => ({}),
  pattern: 'editable',
  context: () => ({}),
  showSubmit: true,
  showReset: true,
  showActions: true,
  actionsPosition: 'bottom',
  actionsAlign: 'right',
  validateOnChange: true,
  validateOnBlur: true,
  scrollToFirstError: true,
  preserveHiddenValue: true,
  loading: false,
  disabled: false,
})

const emit = defineEmits<emitsType>()

defineSlots<slotsType>()

/**
 * 表单值双向绑定（支持 v-model）
 * 用于实时同步表单值到父组件
 */
const modelValue = defineModel<Record<string, any>>('modelValue', { default: () => ({}) })

// 使用传入的 adapter 或默认的 Element Plus adapter
const adapter = computed<UIAdapter>(() => props.adapter || elementPlusAdapter)

// 布局组件快捷访问
const layoutComponents = computed(() => adapter.value.layout)

// 表单引用（使用 useTemplateRef 获取动态组件实例）
const formRef = useTemplateRef<ComponentPublicInstance>('formRef')

// Schema 计算属性
const schema = computed<FormSchema>(() => props.schema)

// 初始化表单状态
const formStateManager = useFormState({
  schema: schema.value,
  initialValues: props.initialValues,
  context: props.context,
  handlers: schema.value.handlers as Record<string, (...args: any[]) => any>,
})

const { values, formState, fieldStates, getFieldsValue, setFieldsValue, getFieldValue, setFieldValue, resetFields, getFieldState, setFieldState, getExpressionContext, executor } = formStateManager

// 初始化表单校验
const formValidationManager = useFormValidation({
  schema: schema.value,
  formState: formStateManager,
  context: props.context,
})

const { validateField, validateFields, clearValidate, setFieldError, clearFieldError } = formValidationManager

// 初始化表单提交
const formSubmitManager = useFormSubmit({
  schema: schema.value,
  formState: formStateManager,
  formValidation: formValidationManager,
  adapter: props.adapter,
  requestAdapter: props.requestAdapter,
  onBeforeSubmit: async (vals) => {
    emit('submit', vals)
    return vals
  },
  onSubmitSuccess: (response, vals) => {
    emit('submitSuccess', response, vals)
  },
  onSubmitError: (error, vals) => {
    emit('submitError', error, vals)
  },
})

const { submitting, submit, reset } = formSubmitManager

// 表单上下文
const formContext = computed<FormContext>(() => {
  const ctx = getExpressionContext()
  return {
    ...ctx,
    getFieldValue,
    setFieldValue,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    setFieldDisplay: (path, display) => setFieldState(path, { display }),
    setFieldPattern: (path, pattern) => setFieldState(path, { pattern }),
    setFieldRequired: (path, required) => {
      // 需要更新字段配置
    },
    setFieldError,
    clearFieldError,
    setFieldProps: (path, fieldProps) => {
      const state = getFieldState(path)
      if (state) {
        // 合并属性
      }
    },
    setFieldTitle: (path, title) => {
      // 更新字段标题
    },
    setFieldDataSource: (path, dataSource) => {
      const state = getFieldState(path)
      if (state) {
        state.dataSource = dataSource
      }
    },
    reloadFieldDataSource: async (path, params) => {
      // 重新加载数据源
    },
    getDataSourceItem: (path, value) => {
      const state = getFieldState(path)
      return state?.dataSource?.find(item => item.value === value)
    },
    validateField: async (path) => {
      const result = await validateField(path)
      return result.valid
    },
    validateFields: async (paths) => {
      const result = await validateFields(paths)
      return result.valid
    },
    clearValidate,
    arrayPush: (path, value) => {
      const current = getFieldValue(path) || []
      setFieldValue(path, [...current, value])
    },
    arrayRemove: (path, index) => {
      const current = getFieldValue(path) || []
      const newValue = [...current]
      newValue.splice(index, 1)
      setFieldValue(path, newValue)
    },
    arrayMove: (path, fromIndex, toIndex) => {
      const current = getFieldValue(path) || []
      const newValue = [...current]
      const [item] = newValue.splice(fromIndex, 1)
      newValue.splice(toIndex, 0, item)
      setFieldValue(path, newValue)
    },
    arrayInsert: (path, index, value) => {
      const current = getFieldValue(path) || []
      const newValue = [...current]
      newValue.splice(index, 0, value)
      setFieldValue(path, newValue)
    },
    message: {
      success: (content) => {
        adapter.value.feedback.message?.success(content)
      },
      error: (content) => {
        adapter.value.feedback.message?.error(content)
      },
      warning: (content) => {
        adapter.value.feedback.message?.warning(content)
      },
      info: (content) => {
        adapter.value.feedback.message?.info(content)
      },
    },
    confirm: async ({ title, content }) => {
      if (adapter.value.feedback.messageBox?.confirm) {
        return adapter.value.feedback.messageBox.confirm({
          title,
          message: content || '',
        })
      }
      // eslint-disable-next-line no-alert
      return window.confirm(content || '')
    },
    request: async (config) => {
      if (props.requestAdapter) {
        return props.requestAdapter(config)
      }
      const response = await fetch(config.url, {
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      })
      return response.json()
    },
  }
})

// 提供给子组件
provide('configFormValues', values)
provide('configFormHandlers', schema.value.handlers || {})
provide('configFormFieldStates', fieldStates)
provide('configFormContext', formContext)
provide('configFormAdapter', adapter)
provide('configFormPattern', computed(() => props.pattern))

// 布局相关计算属性
const isAntdLayoutStyle = computed(() => {
  return adapter.value?.features?.formLayoutStyle === 'antd'
})

const labelWidth = computed(() => {
  // Ant Design Vue 不使用 label-width，使用 labelCol
  if (isAntdLayoutStyle.value) {
    return undefined
  }
  const layout = props.layout || schema.value.layout
  // 优先使用明确指定的 labelWidth
  if (layout?.labelWidth) {
    return layout.labelWidth
  }
  // 否则根据 labelCol 计算百分比
  if (typeof layout?.labelCol === 'number') {
    return `${(layout.labelCol / 24) * 100}%`
  }
  return layout?.labelCol?.span ? `${(layout.labelCol.span / 24) * 100}%` : '100px'
})

const labelPosition = computed(() => {
  // Ant Design Vue 不使用 label-position，使用 layout 属性
  if (isAntdLayoutStyle.value) {
    return undefined
  }
  const layout = props.layout || schema.value.layout
  return layout?.type === 'vertical' ? 'top' : 'right'
})

const formSize = computed(() => {
  const layout = props.layout || schema.value.layout
  return layout?.size || 'default'
})

const isInlineLayout = computed(() => {
  const layout = props.layout || schema.value.layout
  return layout?.type === 'inline'
})

const formDisabled = computed(() => {
  return props.disabled || props.pattern === 'disabled'
})

/**
 * 将 labelWidth 字符串转换为 labelCol 数值
 * @param labelWidth - 标签宽度字符串，如 '70px', '100px'
 * @returns labelCol 对象，用于 Ant Design Vue
 */
function parseLabelWidthToCol(labelWidth: string | undefined): { style: { width: string } } | undefined {
  if (!labelWidth) {
    return undefined
  }
  return { style: { width: labelWidth } }
}

const formProps = computed(() => {
  const layout = props.layout || schema.value.layout

  // Ant Design Vue 布局属性
  if (isAntdLayoutStyle.value) {
    const antdLayout = layout?.type === 'vertical' ? 'vertical' : layout?.type === 'inline' ? 'inline' : 'horizontal'
    const labelCol = layout?.labelCol || parseLabelWidthToCol(layout?.labelWidth)
    return {
      layout: antdLayout,
      labelCol,
      labelAlign: layout?.labelAlign,
      colon: layout?.colon,
      requiredMark: layout?.requiredMark,
    }
  }

  // Element Plus 布局属性
  return {
    labelAlign: layout?.labelAlign,
    colon: layout?.colon,
    requiredMark: layout?.requiredMark,
  }
})

// 表单类名
const formClass = computed(() => {
  const layout = props.layout || schema.value.layout
  return {
    [`config-form--${layout?.type || 'horizontal'}`]: true,
    'config-form--disabled': formDisabled.value,
    'config-form--readonly': props.pattern === 'readOnly',
  }
})

// 按钮显示逻辑
const showTopActions = computed(() => {
  return props.showActions && props.actionsPosition === 'top'
})

const showBottomActions = computed(() => {
  return props.showActions && props.actionsPosition === 'bottom'
})

// 按钮对齐样式
const actionsStyle = computed(() => {
  const alignMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }
  return {
    justifyContent: alignMap[props.actionsAlign || 'right'],
  }
})

// 按钮文本和属性
const submitButtonText = computed(() => {
  return props.submitText || schema.value.submit?.text || '提交'
})

const submitButtonProps = computed(() => {
  return schema.value.submit?.buttonProps || {}
})

const resetButtonText = computed(() => {
  return props.resetText || schema.value.reset?.text || '重置'
})

const resetButtonProps = computed(() => {
  return schema.value.reset?.buttonProps || {}
})

/**
 * 获取字段栅格属性
 */
function getColProps(field: FieldConfig) {
  if (field.col) {
    return executor.execute(field.col, {
      values: toRaw(values),
      context: props.context,
    })
  }
  return { span: 24 }
}

/**
 * 处理字段值变化
 */
function handleFieldChange(fieldName: string, value: any) {
  const oldValue = getFieldValue(fieldName)
  setFieldValue(fieldName, value)

  // 同步更新 v-model
  modelValue.value = { ...getFieldsValue() }

  emit('fieldChange', fieldName, value, oldValue)
  emit('change', getFieldsValue(), fieldName, value)

  // 自动校验
  if (props.validateOnChange) {
    validateField(fieldName)
  }
}

/**
 * 处理字段聚焦
 */
function handleFieldFocus(fieldName: string) {
  const state = getFieldState(fieldName)
  if (state) {
    state.focused = true
    state.active = true
  }
  emit('fieldFocus', fieldName)
}

/**
 * 处理字段失焦
 */
function handleFieldBlur(fieldName: string) {
  const state = getFieldState(fieldName)
  if (state) {
    state.focused = false
    state.visited = true
  }
  emit('fieldBlur', fieldName)

  // 失焦校验
  if (props.validateOnBlur) {
    validateField(fieldName)
  }
}

/**
 * 处理提交
 */
async function handleSubmit() {
  try {
    // 使用 adapter 配置的验证方法，触发 UI 层面的验证反馈
    const validateFn = adapter.value.formMethods?.validate
    if (validateFn) {
      const isValid = await validateFn(formRef.value)
      if (!isValid) {
        // 原生验证失败，不继续提交
        return
      }
    }

    await submit()
  }
  catch (error) {
    // 错误已在 submit 中处理
  }
}

/**
 * 处理重置
 */
async function handleReset() {
  await reset()
  emit('reset')
}

/**
 * 处理校验
 */
async function handleValidate() {
  const result = await validateFields()
  emit('validate', result)
  if (!result.valid) {
    emit('validateError', result.errors)
  }
  return result.valid
}

// 暴露表单实例
const formInstance: FormInstance = {
  formRef,
  getValues: getFieldsValue,
  setValues: setFieldsValue,
  reset: resetFields,
  submit,
  validate: handleValidate,
  clearValidate,
  getFieldValue,
  setFieldValue,
  setFieldState,
  getContext: () => formContext.value,
}

defineExpose(formInstance)

// 生命周期
onMounted(() => {
  // 初始化 v-model 值
  modelValue.value = { ...getFieldsValue() }
  emit('initialized')
})

onUnmounted(() => {
  emit('destroyed')
})
</script>

<style scoped>
.config-form {
  width: 100%;
}

.config-form__loading {
  padding: 20px;
}

.config-form__actions {
  display: flex;
  gap: 12px;
  padding: 16px 0;
}

.config-form__actions--top {
  margin-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.config-form__actions--bottom {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-light);
}

.config-form--horizontal {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
}

.config-form--vertical {
  :deep(.el-form-item__label) {
    text-align: left;
    padding-bottom: 8px;
  }
}

.config-form--inline {
  :deep(.el-form-item) {
    display: inline-flex;
    margin-right: 16px;
    margin-bottom: 16px;
  }
}

.config-form--disabled {
  opacity: 0.7;
  pointer-events: none;
}

.config-form--readonly {
  :deep(.el-input__inner),
  :deep(.el-textarea__inner) {
    cursor: default;
  }
}
</style>
