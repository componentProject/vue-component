<template>
  <img
    v-if="props.icon"
    class="icon"
    :class="{ 'icon-spin': props.spin }"
    :style="style"
    :src="props.icon"
    alt="My Icon"
  />
  <i v-else class="icon" :class="{ 'icon-spin': props.spin }" :style="style">
    <svg viewBox="0 0 24 24" aria-hidden="true" v-if="props.type" fill="currentColor">
      <use :href="`#${props.type}`" />
    </svg>
    <slot v-else name="default"></slot>
  </i>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import iconfontStore from '@/stores/iconfont.ts'

import type { propsType } from './types'

const props = withDefaults(defineProps<propsType>(), {
  spin: false,
  size: '1em',
  color: 'currentColor',
  type: 'icon-zhangshangcaifuyemianshoujiban345',
  icon: '',
  scriptUrl: '//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js',
})

watch(
  () => props.scriptUrl,
  (val) => {
    iconfontStore.createFromIconfont(val)
  },
  {
    immediate: true,
  },
)

const getSize = (size: any) => {
  if (Array.isArray(size) && size.length === 2) {
    return size
  }

  const width = size || '1em'
  const height = size || '1em'
  return [width, height]
}

const style = computed(() => {
  const [width, height] = getSize(props.size)
  return {
    width,
    height,
    color: props.color,
    ...props.style,
  }
})
</script>

<style scoped>
.icon {
  fill: currentcolor;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.icon-spin {
  animation: spin 1s linear infinite;
}
</style>
