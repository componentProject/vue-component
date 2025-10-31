<!-- 表单项渲染组件模板 -->
<template>
  <!-- 表单项容器 -->
  <div class="ap-form-item ap-form-control" @click.stop="handleItemClick">
    <!-- Element Plus 表单项组件 -->
    <ElFormItem
      :class="[item.customClass || '']"
      :prop="item.field"
      :label="item.label"
      :label-width="item.labelWidth"
      :label-position="item.labelPosition"
    >
      <!-- 标签插槽 -->
      <template v-if="item.label" #label>
        <slot :name="item.labelSlot">
          <!-- 标签内容 -->
          <span class="inline-flex items-center">
            <!-- 标签文字 -->
            <span>{{ item.label }}</span>
            <!-- 提示图标 -->
            <ElTooltip
              v-if="item.tooltip"
              v-bind="tooltipProps"
              :content="item.tooltip"
            >
              <ElIcon class="ml-1"><QuestionFilled /></ElIcon>
            </ElTooltip>
          </span>
        </slot>
      </template>
      <!-- 控件插槽 -->
      <template #default>
        <!-- 如果点击组件也要选中干掉这个div -->
        <div class="contents" @click.stop>
          <!-- 纯文本类型 -->
          <template v-if="item.type === 'text'">
            <div class="ap-form-control--text">
              {{ formData[item.field] || emptyText }}
            </div>
          </template>
          <template v-else>
            <!-- 自定义插槽 -->
            <template v-if="item.slot">
              <slot :name="item.slot" :item="item" :readonly="readonly" />
            </template>
            <template v-else>
              <!-- 带子组件 -->
              <template v-if="childComps.includes(getComponentName(item.component))">
                <!-- 编辑状态 -->
                <component
                  :is="item.component"
                  v-if="!readonly"
                  :key="getComponentKey(item.component, item.field)"
                  :class="[item.controlClass || '']"
                  v-bind="item.props"
                  v-on="item.events"
                >
                  <!-- 子组件选项 -->
                  <template v-for="opt in item.options" :key="opt[item.valueKey]">
                    <component
                      :is="item.childComp"
                      :item="opt"
                      :value="opt[item.valueKey!]"
                      :label="opt[item.labelKey!]"
                    >
                      {{ opt[item.labelKey!] }}
                    </component>
                  </template>
                </component>
                <!-- 只读状态 -->
                <div v-else class="ap-form-control--text">
                  {{ getOptionLabel(item.props.modelValue, item) || emptyText }}
                </div>
              </template>
              <!-- 多行文本框 -->
              <template
                v-else-if="
                  item.component === 'el-textarea' || item.component === 'textarea'
                "
              >
                <!-- 编辑状态 -->
                <ElInput
                  v-if="!readonly"
                  type="textarea"
                  :class="[item.controlClass || '']"
                  v-bind="item.props"
                  v-on="item.events"
                />
                <!-- 只读状态 -->
                <div v-else class="ap-form-control--text">
                  {{ item.props.modelValue || emptyText }}
                </div>
              </template>
              <!-- 一般表单控件/全局控件 -->
              <template v-else>
                <!-- 编辑状态 -->
                <component
                  :is="item.component"
                  v-if="!readonly"
                  :key="getComponentKey(item.component, item.field)"
                  :class="[item.controlClass || '']"
                  v-bind="item.props"
                  v-on="item.events"
                />
                <!-- 只读状态 -->
                <div v-else class="ap-form-control--text">
                  {{ item.props.modelValue || emptyText }}
                </div>
              </template>
            </template>
          </template>
          <!-- 提示信息 -->
          <div
            v-if="item.tips"
            class="ap-form-control--tip" :class="[item.tipsClass || '']"
          >
            {{ item.tips || "" }}
          </div>
        </div>
      </template>
    </ElFormItem>
  </div>
</template>

<!-- 表单项渲染组件脚本 -->
<script setup lang="ts">
/** 导入 Element Plus 图标 */
import { QuestionFilled } from '@element-plus/icons-vue'
/** 导入 Vue 组合式 API */
import { inject } from 'vue'
/** 导入 lodash 工具函数 */
import { isArray, isUndefined } from 'lodash'
/** 导入常量定义 */
import { HAS_CHILD_COMPONENT_MAP } from '../_utils/constants'
/** 导入类型定义 */
import type { ReFormItem } from '../_types'
/** 导入工具函数 */
import { getComponentName } from '../_utils'
/** 导入 Element Plus 组件 */
import { ElFormItem, ElIcon, ElInput, ElTooltip } from 'element-plus'

/** 组件选项配置 */
defineOptions({
  name: 'ReFormRenderItem',
})

/** 组件属性定义 */
const props = defineProps<{
  /** 表单项配置 */
  item: ReFormItem
}>()
const emits = defineEmits<{
  (e: 'formItemClick', val: any): void
}>()
/** 生成稳定的组件key，确保组件实例复用 */
function getComponentKey(component: any, field?: string): string {
  /** 基础key基于组件名称 */
  const baseKey = getComponentName(component)

  /** 如果有字段名，将字段名也加入key中，确保不同表单项的组件实例独立 */
  return field ? `${baseKey}_${field}` : baseKey
}

/** 覆盖childComps的使用，确保使用组件名称进行比较 */
const childComps = Object.keys(HAS_CHILD_COMPONENT_MAP)

/** 注入表单上下文 */
const { formData, tooltipProps, readonly, emptyText } = inject(
  Symbol.for('ap-re-form'),
) as any

/** 获取选项标签文字 */
function getOptionLabel(
  modelValue: Array<unknown>,
  item: ReFormItem,
  joinChar = ',',
): string {
  /** 初始化格式化前数组 */
  let beforeFormat = []
  /** 初始化标签数组 */
  let labelArr = []
  /** 如果是数组类型 */
  if (isArray(modelValue)) {
    beforeFormat = [...modelValue]
  }
  /** 如果不是undefined */
  else if (!isUndefined(modelValue)) {
    beforeFormat = [modelValue]
  }

  /** 映射标签数组 */
  labelArr = beforeFormat.map((val: unknown) => {
    /** 查找对应的选项 */
    const opt = item.options?.find(opt => opt[item.valueKey] === val)
    /** 返回标签或值 */
    return opt?.[item.labelKey] ?? val
  })
  /** 返回拼接后的标签 */
  return labelArr.join(joinChar)
}

/** 处理表单项点击事件 */
function handleItemClick() {
  emits('formItemClick', {
    bubbles: true,
    detail: {
      field: props.item.field,
      item: props.item,
    },
  })
}
</script>

<!-- 表单项渲染组件样式 -->
<style lang="scss" scoped>
.ap-form-control {
  /** 相对定位，全宽 */
  @apply relative w-full;

  /** 文本样式 */
  .ap-form-control--text {
    /** 全宽 */
    @apply w-full;

    /** 文本颜色 */
    color: var(--el-text-color-regular);
    /** 文字换行 */
    word-break: break-word;
  }

  /** 提示样式 */
  .ap-form-control--tip {
    //TODO: 有报错
    //@apply mt-1;

    /** 行高 */
    line-height: 1.2;
    /** 提示颜色 */
    color: var(--el-text-color-placeholder);
    /** 文字换行 */
    word-break: break-word;
  }
}
</style>
