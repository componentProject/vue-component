<template>
  <div ref="containerRef" class="relative" :class="className" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { propsType } from './types'
import useWatermark from './hooks/useWatermark'

const props = withDefaults(defineProps<propsType>(), {})
const { className, style, zIndex, width, height, rotate, image, content, fontStyle, gap, offset }
  = props
const containerRef = ref<HTMLElement>()
const container = computed(() => props.container || containerRef.value)
const { generateWatermark } = useWatermark({
  zIndex,
  width,
  height,
  rotate,
  image,
  content,
  fontStyle,
  gap,
  offset,
  container,
})

watch(
  () => {
    return [
      zIndex,
      width,
      height,
      rotate,
      image,
      content,
      JSON.stringify(props.fontStyle),
      JSON.stringify(props.gap),
      JSON.stringify(props.offset),
      containerRef.value,
    ]
  },
  () => {
    generateWatermark({
      zIndex,
      width,
      height,
      rotate,
      image,
      content,
      fontStyle,
      gap,
      offset,
      container,
    })
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
