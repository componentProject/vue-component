<template>
  <div class="ap-form-item ap-form-control">
    <ElFormItem
      :class="[item.customClass || '']"
      :prop="item.field"
      :label="item.label"
      :label-width="item.labelWidth"
      :label-position="item.labelPosition"
    >
      <!-- 标签 -->
      <template v-if="item.label" #label>
        <slot :name="item.labelSlot">
          <span class="inline-flex items-center">
            <span>{{ item.label }}</span>
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
      <!-- 控件 -->
      <template #default>
        <template v-if="item.type === 'text'">
          <div class="ap-form-control--text">
            {{ formData[item.field] || emptyText }}
          </div>
        </template>
        <template v-else>
          <template v-if="item.slot">
            <slot :name="item.slot" :item="item" :readonly="readonly" />
          </template>
          <template v-else>
            <!-- 带子组件 -->
            <template v-if="childComps.includes(getComponentName(item.component))">
              <component
                :is="item.component"
                v-if="!readonly"
                :key="getComponentKey(item.component, item.field)"
                :class="[item.controlClass || '']"
                v-bind="item.props"
                v-on="item.events"
              >
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
              <ElInput
                v-if="!readonly"
                type="textarea"
                :class="[item.controlClass || '']"
                v-bind="item.props"
                v-on="item.events"
              />
              <div v-else class="ap-form-control--text">
                {{ item.props.modelValue || emptyText }}
              </div>
            </template>
            <!-- 一般表单控件/全局控件 -->
            <template v-else>
              <component
                :is="item.component"
                v-if="!readonly"
                :key="getComponentKey(item.component, item.field)"
                :class="[item.controlClass || '']"
                v-bind="item.props"
                v-on="item.events"
              />
              <div v-else class="ap-form-control--text">
                {{ item.props.modelValue || emptyText }}
              </div>
            </template>
          </template>
        </template>
        <div
          v-if="item.tips"
          class="ap-form-control--tip" :class="[item.tipsClass || '']"
        >
          {{ item.tips || "" }}
        </div>
      </template>
    </ElFormItem>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { inject } from 'vue'
import { isArray, isUndefined } from 'lodash'
import { HAS_CHILD_COMPONENT_MAP } from '../_utils/constants'
import type { ReFormItem } from '../_types'
import { getComponentName } from '../_utils'
import { ElFormItem, ElIcon, ElInput, ElTooltip } from 'element-plus'

defineOptions({
  name: 'ReFormRenderItem',
})

const props = defineProps<{
  item: ReFormItem
}>()

// 生成稳定的组件key，确保组件实例复用
function getComponentKey(component: any, field?: string): string {
  // 基础key基于组件名称
  const baseKey = getComponentName(component)

  // 如果有字段名，将字段名也加入key中，确保不同表单项的组件实例独立
  return field ? `${baseKey}_${field}` : baseKey
}

// 覆盖childComps的使用，确保使用组件名称进行比较
const childComps = Object.keys(HAS_CHILD_COMPONENT_MAP)

const { formData, tooltipProps, readonly, emptyText } = inject(
  Symbol.for('ap-re-form'),
) as any

function getOptionLabel(
  modelValue: Array<unknown>,
  item: ReFormItem,
  joinChar = ',',
): string {
  let beforeFormat = []
  let labelArr = []
  if (isArray(modelValue)) {
    beforeFormat = [...modelValue]
  }
  else if (!isUndefined(modelValue)) {
    beforeFormat = [modelValue]
  }

  labelArr = beforeFormat.map((val: unknown) => {
    const opt = item.options?.find(opt => opt[item.valueKey] === val)
    return opt?.[item.labelKey] ?? val
  })
  return labelArr.join(joinChar)
}
</script>

<style lang="scss" scoped>
.ap-form-control {
  @apply relative w-full;

  .ap-form-control--text {
    @apply w-full;

    color: var(--el-text-color-regular);
    word-break: break-word;
  }

  .ap-form-control--tip {
    //TODO: 有报错
    //@apply mt-1;

    line-height: 1.2;
    color: var(--el-text-color-placeholder);
    word-break: break-word;
  }
}
</style>
