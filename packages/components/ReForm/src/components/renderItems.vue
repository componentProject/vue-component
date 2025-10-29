<!-- 表单项列表渲染组件模板 -->
<template>
  <!-- 遍历表单项 -->
  <template v-for="item in items" :key="item.field">
    <!-- 表单项容器 -->
    <div
      v-if="formVisible[item.field]"
      class="ap-form-grid-item" :class="[{ 'ap-form-grid-item-draggable': props.draggable }]"
      :style="getItemStyle(item)"
      :data-field="item.field"
    >
      <!-- 真实的拖拽手柄元素，可用于绑定拖拽功能 -->
      <div v-if="props.draggable" class="ap-form-drag-handle">
        ⋮⋮
      </div>
      <!-- 分组类型表单项 -->
      <template v-if="item.type === 'group'">
        <div class="ap-form-group">
          <!-- 分组触发器 -->
          <div class="ap-form-group__trigger">
            <slot :name="item.slot" :collpased="formCollapsed[item.field]">
              <!-- 折叠按钮 -->
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
          <!-- 分组内容折叠动画 -->
          <ElCollapseTransition
            v-if="!!item.children && item.children.length"
          >
            <div
              v-show="!formCollapsed[item.field]"
              class="ap-form-group__content"
              :class="layout === 'flex' ? 'ap-form-flex' : 'ap-form-grid'"
              :style="gridTemplateStyle"
            >
              <!-- 递归渲染子项 -->
              <ReFormRenderItems :items="item.children">
                <!-- 作用域插槽 -->
                <template
                  v-for="slotName in item.groupSlots[0]"
                  #[slotName]="slotScoped"
                >
                  <slot :name="slotName" v-bind="slotScoped" />
                </template>
                <!-- 命名插槽 -->
                <template v-for="slotName in item.groupSlots[1]" #[slotName]>
                  <slot :name="slotName" />
                </template>
              </ReFormRenderItems>
            </div>
          </ElCollapseTransition>
        </div>
      </template>
      <!-- 普通表单项 -->
      <template v-else>
        <!-- 渲染单个表单项 -->
        <ReFormRenderItem :item="item">
          <!-- 标签插槽 -->
          <template v-if="item.labelSlot" #[item.labelSlot]>
            <slot :name="item.labelSlot" />
          </template>
          <!-- 控件插槽 -->
          <template v-if="item.slot" #[item.slot]="slotScoped">
            <slot :name="item.slot" v-bind="slotScoped" />
          </template>
        </ReFormRenderItem>
      </template>
    </div>
  </template>
</template>

<!-- 表单项列表渲染组件脚本 -->
<script setup lang="ts">
/** 导入折叠按钮组件 */
import ReCollapsedBtn from './ReCollapsedBtn.vue'
/** 导入 Vue 组合式 API */
import { computed, inject, unref } from 'vue'
/** 导入类型定义 */
import type { ReFormItem } from '../_types'
/** 导入表单项渲染组件 */
import ReFormRenderItem from './renderItem.vue'
/** 导入 Element Plus 组件 */
import { ElCollapseTransition } from 'element-plus'

/** 组件选项配置 */
defineOptions({
  name: 'ReFormRenderItems',
})

/** 组件属性定义 */
const props = defineProps<{
  /** 表单项配置数组 */
  items: ReFormItem[]
  /** 是否启用拖拽排序 */
  draggable?: boolean
}>()

/** 注入表单上下文 */
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

/** 提取为单独的方法，提高可读性和可维护性 */
function getItemStyle(item: ReFormItem): string {
  /** 获取栅格占比 */
  const span = typeof item.span === 'number' ? item.span : 24
  /** 如果是grid布局 */
  if (layout.value === 'grid') {
    /** 关键修复：使用更可靠的grid布局语法 */
    if (span === 24) {
      /** 当span为24时，使用grid-column: 1 / -1确保横跨整个容器 */
      return 'grid-column: 1 / -1'
    }
    else {
      /** 对于其他span值，使用标准的grid-column-start */
      return `grid-column-start: span ${span}`
    }
  }
  else {
    /** flex布局下优先检查表单项的itemWidth，其次是全局的itemWidth */
    const finalItemWidth = item.itemWidth !== undefined ? item.itemWidth : unref(itemWidth.value)

    if (finalItemWidth) {
      /** 如果设置了itemWidth，使用固定宽度 */
      let width = finalItemWidth
      /** 检查是否需要添加px单位 */
      if (typeof finalItemWidth === 'number') {
        /** 数字类型直接添加px单位 */
        width = `${finalItemWidth}px`
      }
      else if (typeof finalItemWidth === 'string') {
        /** 字符串类型检查是否是纯数字字符串，如果是则添加px单位 */
        // 排除已经包含单位的情况（如'100px', '20rem', '50%'等）
        if (/^\d+(?:\.\d+)?$/.test(finalItemWidth)) {
          width = `${finalItemWidth}px`
        }
      }
      return `width: ${width}; flex-shrink: 0;`
    }

    /** 没有设置itemWidth时保持原有逻辑 */
    const safeGridResponsive = Math.max(unref(gridResponsive) || 1, 1)
    const safeColGap = Math.max(unref(colGap) || 0, 0)
    const width = (100 / safeGridResponsive) * span
    const gapCompensation = (((100 / width) - 1) * safeColGap) / (100 / width)
    return `width: calc(${width}% - ${gapCompensation}px); flex-shrink: 0;`
  }
}

/** 计算折叠触发器边距 */
const collapsedTriggerMargin = computed(() => {
  /** 如果是左侧或右侧标签位置 */
  if (unref(labelPosition) === 'left' || unref(labelPosition) === 'right') {
    return unref(labelWidth)
  }
  return 0
})
</script>

<!-- 表单项列表渲染组件样式 -->
<style lang="scss" scoped>
/** 可拖拽表单项样式 */
.ap-form-grid-item-draggable {
  /** 默认光标 */
  cursor: default !important;
  /** 相对定位 */
  position: relative !important;
}

/** 真实拖拽手柄样式 */
.ap-form-drag-handle {
  /** 绝对定位 */
  position: absolute;
  /** 左边距 */
  left: 4px;
  /** 上边距 */
  top: 2px;
  /** 字体大小 */
  font-size: 20px;
  /** 颜色 */
  color: #409eff;
  /** 字体族 */
  font-family: sans-serif;
  /** 行高 */
  line-height: 1;
  /** 字符间距 */
  letter-spacing: -2px;
  /** 透明度 */
  opacity: 0;
  /** 移动光标 */
  cursor: move !important;
  /** 内边距 */
  padding: 4px;
  /** 层级 */
  z-index: 9999;
  /** 字体粗细 */
  font-weight: bold;
  /** 过渡动画 */
  transition: opacity 0.2s ease;
  /** 禁止选择 */
  user-select: none;
}

/** 鼠标悬停在表单项上时显示拖拽手柄 */
.ap-form-grid-item:hover .ap-form-drag-handle {
  /** 显示拖拽手柄 */
  opacity: 1;
}

/** 表单分组样式 */
.ap-form-group {
  /** 相对定位，全宽 */
  @apply relative w-full;

  /** 分组触发器样式 */
  &__trigger {
    /** 相对定位，全宽，下边距 */
    @apply relative w-full;
  }

  /** 分组内容样式 */
  &__content {
    /** 网格布局 */
    @apply grid;

    /** 过渡效果 */
    transition: grid-template-columns 0.2s ease;
  }
  /** flex布局样式 */
  .ap-form-flex {
    /** flex布局，换行 */
    @apply flex flex-wrap;
  }
}
</style>
