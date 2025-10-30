<!-- ReForm 表单组件模板 -->
<template>
  <!-- 表单包装器 -->
  <div class="ap-form-wrapper">
    <!-- Element Plus 表单组件 -->
    <ElForm
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
      <div
        ref="draggableContainerRef"
        :class="layout === 'flex' ? 'ap-form-flex' : 'ap-form-grid'"
        :style="gridTemplateStyle"
      >
        <!-- 表单项列表渲染组件 -->
        <ReFormRenderItems :items="renderFormItems" :draggable="draggable">
          <!-- 作用域插槽 -->
          <template v-for="slotName in slotsNames[0]" #[slotName]="slotScoped">
            <slot :name="slotName" v-bind="slotScoped" />
          </template>
          <!-- 命名插槽 -->
          <template v-for="slotName in slotsNames[1]" #[slotName]>
            <slot :name="slotName" />
          </template>
        </ReFormRenderItems>
        <!-- 表单按钮组 -->
        <div
          v-if="!hideBtns"
          class="ap-form-grid-item ap-form-grid-item--btns"
          :style="localBtnSpanStyle"
        >
          <!-- 按钮组表单项 -->
          <ElFormItem :label="btnLabelText" :label-width="btnLabelWidth">
            <!-- 按钮组标签 -->
            <template v-if="btnLabelText" #label>
              <div style="display: inline-block; width: 1px">
                {{ btnLabelText }}
              </div>
            </template>
            <!-- 按钮组插槽 -->
            <slot name="btns">
              <!-- 提交按钮 -->
              <ElButton
                type="primary"
                :disabled="disabled"
                @click="handleSubmit"
              >
                {{ submitBtnText }}
              </ElButton>
              <!-- 取消按钮 -->
              <ElButton @click="handleCancel">
                {{ cancelBtnText }}
              </ElButton>
            </slot>
          </ElFormItem>
        </div>
      </div>
    </ElForm>
  </div>
</template>

<!-- ReForm 表单组件脚本 -->
<script setup lang="ts">
/** 导入 Vue 组合式 API */
import { computed, nextTick, onMounted, onUnmounted, provide, ref, unref, useAttrs } from 'vue'
/** 导入类型定义 */
import type { ReFormEmits, ReFormProps, ReGridResponsive } from './_types'
/** 导入表单组合式函数 */
import useForm, { useWatchForm } from './_utils/useForm'
/** 导入 lodash 工具函数 */
import { cloneDeep, isUndefined } from 'lodash'
/** 导入工具函数 */
import { getSlotsNames, unwrapperShadowRef } from './_utils'
/** 导入栅格列数组合式函数 */
import useGridCols from './_utils/useGridCols'
/** 导入 Vue 类型定义 */
import type { CSSProperties, Ref } from 'vue'
/** 导入 VueUse 类型 */
import type { Arrayable } from '@vueuse/core'
/** 导入 Element Plus 类型 */
import type { FormValidateCallback } from 'element-plus'
/** 导入 Element Plus 组件 */
import { ElButton, ElForm, ElFormItem } from 'element-plus'
/** 导入表单项列表渲染组件 */
import ReFormRenderItems from './components/renderItems.vue'
/** 导入拖拽排序库 */
import Sortable from 'sortablejs'

/** 组件选项配置 */
defineOptions({
  name: 'ReForm',
  inheritAttrs: false,
})

/** 组件输入/输出 - props和emits定义 */
const props = withDefaults(defineProps<ReFormProps>(), {
  /** 列间距 */
  colGap: 16,
  /** 表单尺寸 */
  size: 'default',
  /** 是否禁用 */
  disabled: false,
  /** 是否可编辑 */
  editable: true,
  /** 空内容占位文字 */
  emptyText: '-',
  /** 是否忽略按钮标签 */
  ignoreBtnLabel: true,
  /** 是否滚动到错误字段 */
  scrollToError: true,
  /** 校验失败时是否自动展开分组 */
  autoCollapseInValidate: true,
  /** 提交按钮文字 */
  submitBtnText: '确定',
  /** 取消按钮文字 */
  cancelBtnText: '取消',
  /** 布局类型，默认使用grid布局 */
  layout: 'grid',
  /** 新增拖拽排序功能开关 */
  draggable: false,
})

/** 组件事件定义 */
const emits = defineEmits<ReFormEmits>()

/** 组件实例标识和核心服务初始化 */
const formInstanceId = Symbol('ap-re-form-instance')
/** 本地表单项配置 */
const localItems = computed({
  get: () => props.items,
  set: value => emits('update:items', value),
})

/** 拖拽功能相关 */
const draggableContainerRef = ref<HTMLElement>()
let sortableInstance: Sortable | null = null
let onEndDebounceTimer: ReturnType<typeof setTimeout> | null = null // 防抖计时器

/** 布局相关计算属性 */
const $attrs = useAttrs()
/** 布局类型 */
const layout = computed(() => props.layout || 'grid')
/** 有效列数（重命名为 computedCols） */
const computedCols = computed<ReGridResponsive>(() => {
  if (isUndefined(props.cols)) {
    return { lg: 24, sm: 24, xl: 24, md: 24 }
  }
  if (typeof props.cols === 'number') {
    const n = props.cols
    return { lg: n, sm: n, xl: n, md: n }
  }
  return props.cols as ReGridResponsive
})
//#region 按钮区域宽度计算（依赖 useGridCols 输出）
/** 按钮组栅格占比（用于计算按钮区域宽度/占比的基础配置） */
const btnSpanWithDefault = computed(() => {
  if (!isUndefined(props.btnSpan))
    return props.btnSpan
  return layout.value === 'flex' ? 6 : 24
})

/** 使用栅格列数组合式函数 */
const { gridResponsive, responsiveWidth, localBtnSpan } = useGridCols(
  computedCols,
  btnSpanWithDefault,
)

// （移动到按钮区域宽度计算区域之后，避免混入不相关逻辑）

/** 样式相关计算属性 */
const gridTemplateStyle = computed(() => {
  const style: CSSProperties = {}

  /** 如果是grid布局 */
  if (props.layout === 'grid') {
    /** 设置列间距 */
    style['column-gap'] = `${props.colGap}px`
    /** 设置行间距 */
    style['row-gap'] = `${props.colGap}px`
    /** 计算有效列数 */
    const effectiveColumns = Math.max(gridResponsive.value, 24)
    /** 设置网格模板列 */
    style['grid-template-columns'] = `repeat(${effectiveColumns}, 1fr)`
  }
  else {
    /** 设置flex布局间距 */
    style.gap = `${props.colGap}px`
  }

  return style
})

/** 按钮组栅格样式（grid 下使用 span，flex 下按百分比宽度计算） */
const localBtnSpanStyle = computed<string>(() => {
  /** 如果是grid布局 */
  if (layout.value === 'grid') {
    return props.btnSpanStyle || `grid-column-start: span ${localBtnSpan.value}`
  }
  else {
    /** flex布局下计算宽度 */
    const width = (100 / gridResponsive.value) * localBtnSpan.value
    return props.btnSpanStyle || `width: calc(${width}% - ${(props.colGap * (localBtnSpan.value - 1)) / gridResponsive.value}px)`
  }
})
//#endregion 按钮区域宽度计算（依赖 useGridCols 输出）

/** 表单核心状态 - 从useForm获取的核心状态 */
const {
  submiting,
  reFormRef,
  formData,
  formRules,
  formItems,
  formVisible,
  formCollapsed,
  formGroupDependency,
  clearItemConfigCache,
  itemConfigCache,
} = useForm(localItems, props.modelValue, computedCols, layout)

/** 使用表单监听组合式函数 */
const {
  renderFormItems,
  formDataProxy,
} = useWatchForm(
  formItems,
  formData,
  props,
  emits,
  itemConfigCache,
)

/** 标签和按钮相关计算属性 */
const labelWidth = computed(() =>
  Number.parseInt(`${$attrs['label-width'] || $attrs.labelWidth}`),
)

const labelPosition = computed(
  () => $attrs['label-position'] || $attrs.labelPosition,
)

/** 提示框属性 */
const tooltipProps: Ref<ReFormProps['tooltipProps']> = computed(() => {
  return {
    effect: 'light',
    placement: 'top',
    ...(props.tooltipProps || {}),
  } as ReFormProps['tooltipProps']
})

/** 只读状态 */
const readonly = computed<boolean>(() => !props.editable)
/** 空内容文字 */
const emptyText = computed<string>(() => props.emptyText ?? '')
/** 按钮标签宽度 */
const btnLabelWidth = computed<number | undefined>(() =>
  props.ignoreBtnLabel ? 0 : undefined,
)

/** 按钮标签文字 */
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

/** 插槽名称 */
const slotsNames = computed<[string[], string[]]>(() =>
  getSlotsNames(unref(renderFormItems)),
)

/** 表单功能方法 */
function autoCollapseByErrors(errors?: Record<string, any>) {
  /** 如果不启用自动展开或没有错误 */
  if (!props.autoCollapseInValidate || !errors)
    return
  /** 获取子字段键名 */
  const childKeys = Object.keys(unref(formGroupDependency))
  /** 获取错误字段键名 */
  const errorKeys = Object.keys(errors)
  /** 需要展开的字段 */
  const collapsedKeys = [] as string[]
  /** 遍历错误字段 */
  for (const key of errorKeys) {
    /** 如果存在分组字段校验失败 */
    if (childKeys.includes(key)) {
      /** 获取分组路径 */
      const path = unref(formGroupDependency)[key]
      /** 遍历路径中的字段 */
      for (const field of path) {
        /** 如果字段是折叠状态 */
        if (formCollapsed.value[field]) {
          /** 自动展开 */
          formCollapsed.value[field] = false
          collapsedKeys.push(field)
        }
      }
    }
  }
  /** 如果需要滚动到错误字段且存在展开变化 */
  if (props.scrollToError && !!collapsedKeys.length) {
    /** 存在展开变化，重新自动滚动到第一个校验错误字段 */
    nextTick(() => {
      /** 获取表单字段 */
      const formFields = (reFormRef.value.fields as any[]).map((field: any) =>
        unref(field?.prop as any),
      ) as string[]
      /** 查找第一个错误字段 */
      const field = formFields.find(field => errorKeys.includes(field))
      if (field) {
        /** 滚动到错误字段 */
        reFormRef.value.scrollToField(field)
      }
    })
  }
}

/** 表单交互方法 */
function handleSubmit() {
  /** 表单引用存在时执行校验 */
  reFormRef.value
  && reFormRef.value.validate((valid: boolean, errors: Record<string, any>) => {
    /** 如果校验通过 */
    if (valid) {
      /** 深拷贝表单数据 */
      const submitData = cloneDeep(unwrapperShadowRef(formData))
      /** 触发提交事件 */
      emits('submit', submitData)
      /** 如果有请求方法 */
      if (props.request) {
        /** 设置提交状态 */
        submiting.value = true
        /** 执行请求 */
        props
          .request(submitData)
          .then((res: any) => {
            /** 触发成功事件 */
            emits('success', res)
          })
          .catch((err: any) => {
            /** 触发错误事件 */
            emits('error', err)
          })
          .finally(() => {
            /** 重置提交状态 */
            submiting.value = false
          })
      }
    }
    else {
      /** 校验失败时自动展开分组 */
      autoCollapseByErrors(errors)
    }
  })
}

/** 处理取消操作 */
function handleCancel() {
  /** 清空校验 */
  reFormRef.value && reFormRef.value.clearValidate()
  /** 触发取消事件 */
  emits('cancel')
}

/** 重置表单字段 */
function resetFields(props?: Arrayable<string> | undefined) {
  reFormRef.value && reFormRef.value.resetFields(props)
}

/** 校验指定字段 */
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

/** 清空校验 */
function clearValidate() {
  // 增强健壮性，先检查reFormRef.value是否存在，再检查clearValidate方法是否存在
  if (reFormRef.value && typeof reFormRef.value.clearValidate === 'function') {
    reFormRef.value.clearValidate()
  }
}

/** 校验整个表单 */
function validate(callback: FormValidateCallback) {
  reFormRef.value && reFormRef.value.validate(callback)
}

/** 处理分组折叠状态切换 */
function handleSwitchCollapsed(field: string) {
  formCollapsed.value[field] = !formCollapsed.value[field]
}

/** 依赖注入 */
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
  itemWidth: computed(() => props.itemWidth),
  colGap: computed(() => props.colGap),
  formInstanceId, // 传递实例ID
})

/** 生命周期钩子 */
onMounted(async () => {
  /** 如果传入了表单引用回调 */
  if (props.formRef) {
    props.formRef(unref(reFormRef))
  }
  /** 默认清空校验 - 避免初始化就飘红色 */
  reFormRef.value && reFormRef.value.clearValidate()

  /** 初始化拖拽功能 */
  if (props.draggable && draggableContainerRef.value) {
    await nextTick()
    /** 确保ReFormRenderItems已经渲染完成 */
    sortableInstance = new Sortable(draggableContainerRef.value, {
      sort: true,
      delay: 0,
      delayOnTouch0nly: false,
      touchStartThreshold: 0,
      animation: 150,
      handle: '.ap-form-grid-item',
      filter: '.ap-form-grid-item--btns', // 排除按钮区域
      onEnd: () => {
        /** 清除之前的计时器，实现防抖 */
        if (onEndDebounceTimer) {
          clearTimeout(onEndDebounceTimer)
        }
        /** 使用防抖延迟处理，确保DOM已经稳定 */
        onEndDebounceTimer = setTimeout(() => {
          try {
            /** 获取真实的DOM状态，使用document.querySelectorAll确保获取的是最新DOM结构 */
            const formItems = document.querySelectorAll('.ap-form-grid-item[data-field]')
            const fieldNames = Array.from(formItems).map(el => el.getAttribute('data-field'))

            /** 创建新数组并按照DOM中的顺序重新排列 */
            const newItems = []
            fieldNames.forEach((field) => {
              const item = props.items.find(i => i.field === field)
              if (item)
                newItems.push(cloneDeep(item))
            })

            /** 验证重新排序是否有效 */
            const isDifferent = JSON.stringify(newItems) !== JSON.stringify(props.items)
            if (isDifferent) {
              /** 确保在Vue的下一个更新周期中更新数据 */
              nextTick(() => {
                localItems.value = newItems
                emits('update:items', newItems)
                console.log('拖拽更新后的数据:', newItems)
              })
            }
          }
          catch (error) {
            console.error('拖拽排序失败:', error)
          }
          finally {
            onEndDebounceTimer = null
          }
        }, 50) // 50ms防抖延迟
      },
    })
  }
})
onUnmounted(() => {
  /** 如果传入了表单引用回调 */
  if (props.formRef) {
    clearItemConfigCache() // 调用实例的清理方法
  }

  /** 清理拖拽实例 */
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
  /** 清理防抖计时器 */
  if (onEndDebounceTimer) {
    clearTimeout(onEndDebounceTimer)
    onEndDebounceTimer = null
  }
})
/** 暴露给父组件的方法和属性 */
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
  getRef: () => reFormRef.value,
})
</script>

<!-- ReForm 表单组件样式 -->
<style lang="scss" scoped>
/** 拖拽相关样式 */
.ap-form-grid-item {
  /** 移动光标 */
  cursor: move;
  &:hover {
    /** 悬停背景色 */
    background-color: rgba(0, 0, 0, 0.02);
  }
}

/** 排除按钮区域的拖拽样式 */
.ap-form-grid-item--btns {
  /** 默认光标 */
  cursor: default;
  &:hover {
    /** 悬停时透明背景 */
    background-color: transparent;
  }
}
</style>

/** 全局拖拽状态样式 */
:global(.sortable-ghost) {
  /** 幽灵状态透明度 */
  opacity: 0.5;
  /** 幽灵状态背景色 */
  background: #c8ebfb;
}

:global(.sortable-chosen) {
  /** 选中状态背景色 */
  background-color: rgba(144, 224, 239, 0.3);
}

:global(.sortable-drag) {
  /** 拖拽状态透明度 */
  opacity: 0;
}

<style lang="scss" scoped>
.ap-form {
  /** 只读状态高度变量 */
  --ap-form-readonly-height-small: 20px;
  --ap-form-readonly-height-default: 24px;
  --ap-form-readonly-height-large: 28px;

  /** 输入框样式 */
  :deep(.el-input) {
    width: 100%;
  }
  /** 数字输入框样式 */
  :deep(.el-input-number) {
    width: 100%;
  }

  // 移除未定义的 m mixin 使用，直接使用类选择器
  /** 小尺寸表单项样式 */
  .el-form-item--small {
    .el-form-item__label {
      height: var(--ap-form-readonly-height-small);
      line-height: var(--ap-form-readonly-height-small);
    }

    .el-form-item__content {
      line-height: var(--ap-form-readonly-height-small);
    }
  }

  /** 默认尺寸表单项样式 */
  .el-form-item--default {
    .el-form-item__label {
      height: var(--ap-form-readonly-height-default);
      line-height: var(--ap-form-readonly-height-default);
    }

    .el-form-item__content {
      line-height: var(--ap-form-readonly-height-default);
    }
  }

  /** 大尺寸表单项样式 */
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
/** 表单包装器样式 */
.ap-form-wrapper {
  // @apply relative;

  /** 网格布局样式 */
  .ap-form-grid {
    @apply grid;
    /** 过渡效果 */
    transition: all 0.2s ease;
  }

  /** 独立的flex布局容器样式 */
  .ap-form-flex {
    @apply flex flex-wrap;
  }
}

/** 优化表单元素在两种布局下的样式 */
.ap-form-grid-item {
  /** 过渡效果 */
  transition: all 0.2s ease;
  /** 盒模型 */
  box-sizing: border-box;
  /* 确保宽度计算正确应用 */
}

/** 确保按钮组在两种布局下都能正确显示 */
.ap-form-grid-item.btn-group {
  /** 盒模型 */
  box-sizing: border-box;
}
</style>
