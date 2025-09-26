<template>
  <div class="ap-form-wrapper">
    <el-form
      ref="reFormRef"
      class="ap-form"
      :class="{ 'ap-form--readonly': readonly }"
      v-bind="$attrs"
      :model="formDataProxy"
      :rules="formRules"
      :disabled="disabled"
      :size="size"
      :scroll-to-error="scrollToError"
    >
      <!-- 使用动态class绑定，根据layout的值直接选择不同的布局类 -->
      <div :class="layout === 'flex' ? 'ap-form-flex' : 'ap-form-grid'" :style="gridTemplateStyle">
        <ReFormRenderItems :items="renderFormItems">
          <template v-for="slotName in slotsNames[0]" #[slotName]="slotScoped">
            <slot :name="slotName" v-bind="slotScoped" />
          </template>
          <template v-for="slotName in slotsNames[1]" #[slotName]>
            <slot :name="slotName" />
          </template>
        </ReFormRenderItems>
        <div
          v-if="!hideBtns"
          class="ap-form-grid-item"
          :style="localBtnSpanStyle"
        >
          <el-form-item :label="btnLabelText" :label-width="btnLabelWidth">
            <template v-if="btnLabelText" #label>
              <div style="display: inline-block; width: 1px">
                {{ btnLabelText }}
              </div>
            </template>
            <slot name="btns">
              <el-button
                type="primary"
                :disabled="disabled"
                @click="handleSubmit"
              >
                {{ submitBtnText }}
              </el-button>
              <el-button @click="handleCancel">
                {{ cancelBtnText }}
              </el-button>
            </slot>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, provide, unref, useAttrs } from 'vue'
import type { ReFormEmits, ReFormProps } from './_types'
import useForm, { useWatchForm } from './_utils/useForm'
import { cloneDeep, isUndefined } from 'lodash'
import { getSlotsNames, unwrapperShadowRef } from './_utils'
import useGridCols from './_utils/useGridCols'
import type { CSSProperties, Ref } from 'vue'
import type { Arrayable } from '@vueuse/core'
import type { FormValidateCallback } from 'element-plus'
import ReFormRenderItems from './components/renderItems.vue'

defineOptions({
  name: 'ReForm',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ReFormProps>(), {
  // cols: 1,
  colGap: 16,
  size: 'default',
  disabled: false,
  editable: true,
  emptyText: '-',
  ignoreBtnLabel: true,
  scrollToError: true,
  autoCollapseInValidate: true,
  submitBtnText: '确定',
  cancelBtnText: '取消',
  layout: 'grid', // 默认使用grid布局
})

const emits = defineEmits<ReFormEmits>()

const localItems = computed(() => props.items)

// 根据layout属性设置不同的cols默认值
const effectiveCols = computed(() => {
  // 无论哪种布局，未指定cols时都使用相同的默认值
  if (isUndefined(props.cols)) {
    return { lg: 24, sm: 24, xl: 24, md: 24 }
  }
  else {
    return { lg: props.cols, sm: props.cols, xl: props.cols, md: props.cols }
  }
})

const {
  submiting,
  reFormRef,
  formData,
  formRules,
  formItems,
  formVisible,
  formCollapsed,
  formGroupDependency,
} = useForm(localItems, props.modelValue, effectiveCols, props.layout)

const { renderFormItems, formDataProxy } = useWatchForm(
  formItems,
  formData,
  props,
  emits,
)

const $attrs = useAttrs()

const slotsNames = computed<[string[], string[]]>(() =>
  getSlotsNames(unref(renderFormItems)),
)

const { gridResponsive, responsiveWidth, localBtnSpan } = useGridCols(
  effectiveCols,
  props.btnSpan,
)

const labelWidth = computed(() =>
  Number.parseInt(`${$attrs['label-width'] || $attrs.labelWidth}`),
)
const labelPosition = computed(
  () => $attrs['label-position'] || $attrs.labelPosition,
)

const gridTemplateStyle = computed(() => {
  const style: CSSProperties = {}

  if (props.layout === 'grid') {
    style['column-gap'] = `${props.colGap}px`
    style['row-gap'] = 0
    // 关键修复：确保grid容器的列数至少为24
    const effectiveColumns = Math.max(gridResponsive.value, 24)
    style['grid-template-columns'] = `repeat(${effectiveColumns}, 1fr)`
  }
  else {
    style.marginBottom = `${props.colGap}px`
  }

  return style
})

const localBtnSpanStyle = computed<string>(() => {
  if (props.layout === 'grid') {
    return props.btnSpanStyle || `grid-column-start: span ${localBtnSpan.value}`
  }
  else {
    // flex布局下的按钮组样式
    const width = (100 / gridResponsive.value) * localBtnSpan.value
    return props.btnSpanStyle || `width: calc(${width}% - ${(props.colGap * (localBtnSpan.value - 1)) / gridResponsive.value}px)`
  }
})

const tooltipProps: Ref<ReFormProps['tooltipProps']> = computed(() => {
  return {
    effect: 'light',
    placement: 'right',
    ...(props.tooltipProps || {}),
  } as ReFormProps['tooltipProps']
})

const readonly = computed<boolean>(() => !props.editable)
const emptyText = computed<string>(() => props.emptyText ?? '')
const btnLabelWidth = computed<number | undefined>(() =>
  props.ignoreBtnLabel ? 0 : undefined,
)
const btnLabelText = computed<string>(() => {
  if (props.ignoreBtnLabel)
    return ''
  if (
    ($attrs.labelPosition as string) === 'top'
    || ($attrs['label-position'] as string) === 'top'
  ) {
    return ' '
  }
  return ''
})

// 根据分组依赖自动展开分组-获取校验失败定位
function autoCollapseByErrors(errors?: Record<string, any>) {
  if (!props.autoCollapseInValidate || !errors)
    return
  const childKeys = Object.keys(unref(formGroupDependency))
  const errorKeys = Object.keys(errors)
  const collapsedKeys = [] as string[]
  for (const key of errorKeys) {
    if (childKeys.includes(key)) {
      // 存在分组字段校验失败
      const path = unref(formGroupDependency)[key]
      for (const field of path) {
        if (formCollapsed.value[field]) {
          formCollapsed.value[field] = false // 自动展开
          collapsedKeys.push(field)
        }
      }
    }
  }
  if (props.scrollToError && !!collapsedKeys.length) {
    // 存在展开变化，重新自动滚动到第一个校验错误字段
    nextTick(() => {
      const formFields = reFormRef.value.fields.map((field: { prop: any }) =>
        unref(field.prop),
      ) as string[]
      const field = formFields.find(field => errorKeys.includes(field))
      if (field) {
        reFormRef.value.scrollToField(field)
      }
    })
  }
}

function handleSubmit() {
  reFormRef.value
  && reFormRef.value.validate((valid: boolean, errors: Record<string, any>) => {
    if (valid) {
      const submitData = cloneDeep(unwrapperShadowRef(formData))
      emits('submit', submitData)
      if (props.request) {
        submiting.value = true
        props
          .request(submitData)
          .then((res: any) => {
            emits('success', res)
          })
          .catch((err: any) => {
            emits('error', err)
          })
          .finally(() => {
            submiting.value = false
          })
      }
    }
    else {
      autoCollapseByErrors(errors)
    }
  })
}

function handleCancel() {
  reFormRef.value && reFormRef.value.clearValidate()
  emits('cancel')
}

function resetFields(props?: Arrayable<string> | undefined) {
  reFormRef.value && reFormRef.value.resetFields(props)
}

function validateField(
  props?: Arrayable<string> | undefined,
  callback?: FormValidateCallback | undefined,
) {
  reFormRef.value
  && reFormRef.value.validateField(
    props,
    (valid: boolean, errors?: Record<string, any>) => {
      callback && callback(valid, errors)
      if (!valid) {
        autoCollapseByErrors(errors)
      }
    },
  )
}

function clearValidate() {
  reFormRef.value && reFormRef.value.clearValidate()
}

function validate(callback: FormValidateCallback) {
  reFormRef.value && reFormRef.value.validate(callback)
}

function handleSwitchCollapsed(field: string) {
  formCollapsed.value[field] = !formCollapsed.value[field]
}

// 在provide中确保layout属性正确注入
provide(Symbol.for('ap-re-form'), {
  gridTemplateStyle,
  gridResponsive,
  responsiveWidth,
  readonly,
  emptyText,
  formData,
  formCollapsed,
  formVisible,
  formRules,
  tooltipProps,
  labelWidth,
  labelPosition,
  handleSwitchCollapsed,
  layout: computed(() => props.layout),
})

onMounted(() => {
  if (props.formRef) {
    props.formRef(unref(reFormRef))
  }
  reFormRef.value && reFormRef.value.clearValidate() // 默认清空校验 - 避免初始化就飘红色
})

defineExpose({
  submiting,
  reFormRef,
  formData,
  formRules,
  formItems,
  formVisible,
  formCollapsed,
  validate,
  clearValidate,
  validateField,
  resetFields,
  handleSwitchCollapsed,
  autoCollapseByErrors,
})
</script>

<style lang="scss" scoped>
.ap-form-wrapper {
  @apply relative;

  .ap-form-grid {
    @apply grid;

    transition: grid-template-columns 0.2s ease; /* 过渡效果 */
  }
}
</style>

<style lang="scss" scoped>
.ap-form {
  --ap-form-readonly-height-small: 20px;
  --ap-form-readonly-height-default: 24px;
  --ap-form-readonly-height-large: 28px;

  :deep(.el-input) {
    width: 100%;
  }
  :deep(.el-input-number) {
    width: 100%;
  }

  // 移除未定义的 m mixin 使用，直接使用类选择器
  .el-form-item--small {
    .el-form-item__label {
      height: var(--ap-form-readonly-height-small);
      line-height: var(--ap-form-readonly-height-small);
    }

    .el-form-item__content {
      line-height: var(--ap-form-readonly-height-small);
    }
  }

  .el-form-item--default {
    .el-form-item__label {
      height: var(--ap-form-readonly-height-default);
      line-height: var(--ap-form-readonly-height-default);
    }

    .el-form-item__content {
      line-height: var(--ap-form-readonly-height-default);
    }
  }

  .el-form-item--large {
    .el-form-item__label {
      height: var(--ap-form-readonly-height-large);
      line-height: var(--ap-form-readonly-height-large);
    }

    .el-form-item__content {
      line-height: var(--ap-form-readonly-height-large);
    }
  }
}
.ap-form-wrapper {
  @apply relative;

  .ap-form-grid {
    @apply grid;
    transition: all 0.2s ease; /* 过渡效果 */
  }

  /* 独立的flex布局容器样式 */
  .ap-form-flex {
    @apply flex flex-wrap;
  }
}

/* 优化表单元素在两种布局下的样式 */
.ap-form-grid-item {
  transition: all 0.2s ease;
  box-sizing: border-box;
  /* 确保宽度计算正确应用 */
}

/* 确保按钮组在两种布局下都能正确显示 */
.ap-form-grid-item.btn-group {
  box-sizing: border-box;
}
</style>
