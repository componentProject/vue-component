<template>
  <template v-for="item in items" :key="item.field">
    <div
      v-if="formVisible[item.field]"
      class="ap-form-grid-item"
      :style="getItemStyle(item)"
      :data-field="item.field"
    >
      <template v-if="item.type === 'group'">
        <div class="ap-form-group">
          <div class="ap-form-group__trigger">
            <slot :name="item.slot" :collpased="formCollapsed[item.field]">
              <ReCollapsedBtn
                v-bind="item.collapsedTriggerProps"
                :collapsed-text="item.collapsedText"
                :style="{
                  marginLeft: item.collapsedTriggerIndex
                    ? `${collapsedTriggerMargin}px`
                    : 0,
                }"
                :model-value="formCollapsed[item.field]"
                @click="handleSwitchCollapsed(item.field)"
              />
            </slot>
          </div>
          <el-collapse-transition
            v-if="!!item.children && item.children.length"
          >
            <div
              v-show="!formCollapsed[item.field]"
              class="ap-form-group__content"
              :class="layout === 'flex' ? 'ap-form-flex' : 'ap-form-grid'"
              :style="gridTemplateStyle"
            >
              <ReFormRenderItems :items="item.children">
                <template
                  v-for="slotName in item.groupSlots[0]"
                  #[slotName]="slotScoped"
                >
                  <slot :name="slotName" v-bind="slotScoped" />
                </template>
                <template v-for="slotName in item.groupSlots[1]" #[slotName]>
                  <slot :name="slotName" />
                </template>
              </ReFormRenderItems>
            </div>
          </el-collapse-transition>
        </div>
      </template>
      <template v-else>
        <ReFormRenderItem :item="item">
          <template v-if="item.labelSlot" #[item.labelSlot]>
            <slot :name="item.labelSlot" />
          </template>
          <template v-if="item.slot" #[item.slot]="slotScoped">
            <slot :name="item.slot" v-bind="slotScoped" />
          </template>
        </ReFormRenderItem>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import ReCollapsedBtn from './ReCollapsedBtn.vue'
import { computed, inject, unref } from 'vue'
import type { ReFormItem } from '../_types'
import ReFormRenderItem from './renderItem.vue'

defineOptions({
  name: 'ReFormRenderItems',
})

const props = defineProps<{
  items: ReFormItem[]
}>()

const {
  gridTemplateStyle,
  gridResponsive,
  formCollapsed,
  formVisible,
  labelWidth,
  labelPosition,
  handleSwitchCollapsed,
  layout,
  itemWidth = computed(() => undefined),
  colGap = computed(() => 16), // 新增colGap注入，默认16px
} = inject(Symbol.for('ap-re-form')) as any

// 提取为单独的方法，提高可读性和可维护性
function getItemStyle(item: ReFormItem): string {
  const span = typeof item.span === 'number' ? item.span : 24
  if (layout.value === 'grid') {
    // 关键修复：使用更可靠的grid布局语法
    if (span === 24) {
      // 当span为24时，使用grid-column: 1 / -1确保横跨整个容器
      return 'grid-column: 1 / -1'
    }
    else {
      // 对于其他span值，使用标准的grid-column-start
      return `grid-column-start: span ${span}`
    }
  }
  else {
    // flex布局下优先检查表单项的itemWidth，其次是全局的itemWidth
    const finalItemWidth = item.itemWidth !== undefined ? item.itemWidth : unref(itemWidth.value)

    if (finalItemWidth) {
      // 如果设置了itemWidth，使用固定宽度
      let width = finalItemWidth
      // 检查是否需要添加px单位
      if (typeof finalItemWidth === 'number') {
        // 数字类型直接添加px单位
        width = `${finalItemWidth}px`
      }
      else if (typeof finalItemWidth === 'string') {
        // 字符串类型检查是否是纯数字字符串，如果是则添加px单位
        // 排除已经包含单位的情况（如'100px', '20rem', '50%'等）
        if (/^\d+(?:\.\d+)?$/.test(finalItemWidth)) {
          width = `${finalItemWidth}px`
        }
      }
      return `width: ${width}; flex-shrink: 0;`
    }

    // 没有设置itemWidth时保持原有逻辑
    const safeGridResponsive = Math.max(unref(gridResponsive) || 1, 1)
    const safeColGap = Math.max(unref(colGap) || 0, 0)
    const width = (100 / safeGridResponsive) * span
    const gapCompensation = (((100 / width) - 1) * safeColGap) / (100 / width)
    return `width: calc(${width}% - ${gapCompensation}px); flex-shrink: 0;`
  }
}

const collapsedTriggerMargin = computed(() => {
  if (unref(labelPosition) === 'left' || unref(labelPosition) === 'right') {
    return unref(labelWidth)
  }
  return 0
})
</script>

<style lang="scss" scoped>
.ap-form-group {
  @apply relative w-full;

  &__trigger {
    @apply relative w-full mb-4;
  }

  &__content {
    @apply grid;

    transition: grid-template-columns 0.2s ease; /* 过渡效果 */
  }
  .ap-form-flex {
    @apply flex flex-wrap;
  }
}
</style>
