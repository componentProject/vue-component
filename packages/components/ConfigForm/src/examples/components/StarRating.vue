<!--
  StarRating - 自定义星级评分组件示例
  演示如何创建支持自定义样式的评分组件
-->
<template>
  <div
    class="star-rating"
    :class="{
      'star-rating--disabled': disabled,
      'star-rating--readonly': readonly,
    }"
  >
    <span
      v-for="star in maxStars"
      :key="star"
      class="star-rating__star"
      :class="{
        'star-rating__star--active': star <= currentValue,
        'star-rating__star--hover': star <= hoverValue && !disabled && !readonly,
      }"
      @click="handleClick(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
    >
      {{ star <= (hoverValue || currentValue) ? '★' : '☆' }}
    </span>
    <span v-if="showText" class="star-rating__text">
      {{ ratingText }}
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * StarRating - 星级评分组件
 * 符合 ConfigForm 自定义组件规范
 */
import { computed, ref } from 'vue'

defineOptions({
  name: 'StarRating',
})

const props = withDefaults(defineProps<{
  /** 绑定值（评分值） */
  modelValue?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 最大星数 */
  maxStars?: number
  /** 是否显示文字 */
  showText?: boolean
  /** 评分文字映射 */
  texts?: string[]
  /** 星星颜色 */
  color?: string
  /** 激活时的颜色 */
  activeColor?: string
}>(), {
  modelValue: 0,
  disabled: false,
  readonly: false,
  maxStars: 5,
  showText: true,
  texts: () => ['极差', '差', '一般', '好', '极好'],
  color: '#c0c4cc',
  activeColor: '#f7ba2a',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

/** 当前悬停的星星 */
const hoverValue = ref(0)

/** 当前评分值 */
const currentValue = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

/** 评分文字 */
const ratingText = computed(() => {
  const index = (hoverValue.value || currentValue.value) - 1
  return props.texts[index] || ''
})

/**
 * 处理点击
 * @param star - 点击的星星序号
 */
function handleClick(star: number) {
  if (props.disabled || props.readonly) {
    return
  }
  // 点击已选中的星星则取消选择
  currentValue.value = currentValue.value === star ? 0 : star
}

/**
 * 处理鼠标进入
 * @param star - 悬停的星星序号
 */
function handleMouseEnter(star: number) {
  if (props.disabled || props.readonly) {
    return
  }
  hoverValue.value = star
}

/**
 * 处理鼠标离开
 */
function handleMouseLeave() {
  hoverValue.value = 0
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.star-rating--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.star-rating--readonly {
  cursor: default;
}

.star-rating__star {
  font-size: 20px;
  cursor: pointer;
  color: v-bind(color);
  transition: color 0.2s, transform 0.1s;
  user-select: none;
}

.star-rating__star--active,
.star-rating__star--hover {
  color: v-bind(activeColor);
}

.star-rating__star:not(.star-rating--disabled .star-rating__star):hover {
  transform: scale(1.2);
}

.star-rating--disabled .star-rating__star,
.star-rating--readonly .star-rating__star {
  cursor: inherit;
}

.star-rating__text {
  margin-left: 8px;
  font-size: 14px;
  color: v-bind(activeColor);
}
</style>

