<template>
  <footer class="w-full bg-white mt-4! mb-4! flex flex-wrap" :style="computedStyle">
    <template v-for="(item, index) in normalizedItems" :key="index">
      <a
        v-if="item.link"
        :style="textStyle(item)"
        class="hover:underline"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
      >{{ item.text }}</a>
      <span v-else :style="textStyle(item)">{{ item.text }}</span>
    </template>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NormalizedItem, tsFooterParamsType } from './_types'

defineOptions({ name: 'TsFooter' })

/**
 * 页脚组件，展示版权、导航链接、联系方式等信息。
 * - 支持文本与链接两种元素
 * - 支持左、中、右三种对齐方式
 */
const props = withDefaults(defineProps<tsFooterParamsType>(), {
  items: () => [],
  align: 'center',
  xGap: 24,
  yGap: 6,
  size: 12,
})

/**
 * 规格化 items，统一成渲染单元
 */
const normalizedItems = computed<NormalizedItem[]>(() => {
  return props.items.map((it) => {
    if (it && typeof it === 'object') {
      return it
    }
    else {
      return { text: it }
    }
  })
})

const justifyMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}
const computedStyle = computed<CSSStyleDeclaration>(() => {
  return {
    'column-gap': `${props.xGap}px`,
    'row-gap': `${props.yGap}px`,
    'padding-top': `${props.yGap}px`,
    'padding-bottom': `${props.yGap}px`,
    'justify-content': justifyMap[props.align],
    'font-size': `${props.size}px`,
    'line-height': `${props.size}px`,
  }
})

function textStyle(item: NormalizedItem): CSSStyleDeclaration {
  const customStyle = props.textStyle?.(item) || {}
  return {
    color: 'rgba(41, 53, 79, 0.8)',
    ...customStyle,
  }
}
</script>

<style lang="scss" scoped>
</style>
