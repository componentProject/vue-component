<template>
  <div
    class="ts-expandable" :class="[props.class]"
    :style="props.style"
  >
    <div
      ref="contentRef"
      class="ts-expandable__content"
      :style="contentStyle"
    >
      <slot />
    </div>

    <div
      v-if="showToggle && needToggle"
      class="ts-expandable__toggle"
      :class="[`ts-expandable__toggle--${props.togglePosition}`]"
    >
      <slot
        name="toggle"
        :expanded="isExpanded"
        :toggle="toggle"
      >
        <span
          class="ts-expandable__toggle-btn"
          @click="toggle"
        >
          {{ isExpanded ? props.collapseText : props.expandText }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { emitsType, propsType, slotsType } from './_types'

defineOptions({
  name: 'TsExpand',
  inheritAttrs: false,
})

/**
 * 注意：组件要求内容区域的每一行高度必须是固定的（由 lineHeight 参数指定）。
 * 如果传入的内容不是文本，请确保每个子元素的高度与 lineHeight 保持一致，
 * 或者每个子元素的高度是 lineHeight 的整数倍，这样才能准确计算应该显示的行数。
 *
 * 例如：
 * - 如果 lineHeight 为 24px，那么每个子元素的高度应该是 24px、48px、72px 等
 * - 如果子元素高度不一致，可能会导致计算不准确
 */
const props = withDefaults(defineProps<propsType>(), {
  rows: 3,
  defaultExpanded: false,
  expandText: '展开',
  collapseText: '收起',
  lineHeight: 24,
  showToggle: true,
  togglePosition: 'right',
  class: '',
  style: () => ({}),
})

const emits = defineEmits<emitsType>()

const slots = defineSlots<slotsType>()

const contentRef = ref<HTMLElement | null>(null)
const isExpanded = ref(props.defaultExpanded)
const needToggle = ref(false)
let resizeObserver: ResizeObserver | null = null

const maxHeight = computed(() => {
  return props.rows * props.lineHeight
})

/**
 * 内容区域样式
 * 注意：内容区域的 line-height 会被设置为与 lineHeight 一致，确保每行高度固定
 */
const contentStyle = computed(() => {
  const baseStyle = {
    lineHeight: `${props.lineHeight}px`,
  }

  if (isExpanded.value) {
    return {
      ...baseStyle,
      maxHeight: 'none',
    }
  }
  else {
    return {
      ...baseStyle,
      maxHeight: `${maxHeight.value}px`,
      overflow: 'hidden',
    }
  }
})

function toggle() {
  isExpanded.value = !isExpanded.value
  emits('change', isExpanded.value)
  if (isExpanded.value) {
    emits('expand')
  }
  else {
    emits('collapse')
  }
}

/**
 * 检查是否需要显示展开/收起按钮
 * 通过比较内容实际高度与最大高度来判断
 *
 * 注意：此方法依赖于内容区域的每一行高度固定为 lineHeight，
 * 如果内容子元素高度不一致，可能会导致判断不准确
 */
function checkNeedToggle() {
  nextTick(() => {
    if (contentRef.value) {
      const height = contentRef.value.scrollHeight
      needToggle.value = height > maxHeight.value
    }
  })
}

onMounted(() => {
  checkNeedToggle()

  // 监听内容变化，重新检查是否需要显示展开按钮
  if (contentRef.value) {
    resizeObserver = new ResizeObserver(() => {
      checkNeedToggle()
    })
    resizeObserver.observe(contentRef.value)
  }
})

onUnmounted(() => {
  // 组件卸载时清理
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style lang="scss" scoped>
.ts-expandable {
  width: 100%;

  &__content {
    transition: max-height 0.3s ease-in-out;
    overflow: hidden;
    word-break: break-word;
    /*
     * 重要：内容区域的每个子元素必须具有固定的行高
     * 子元素的高度应该是 lineHeight 的整数倍，以确保准确计算行数
     * 如果子元素高度不一致，请通过 CSS 设置固定高度或使用 flex 布局
     */
  }

  &__toggle {
    margin-top: 8px;

    &--left {
      text-align: left;
    }

    &--right {
      text-align: right;
    }
  }

  &__toggle-btn {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    transition: color 0.2s;

    &:hover {
      color: #66b1ff;
    }

    &:active {
      color: #3a8ee6;
    }
  }
}
</style>
