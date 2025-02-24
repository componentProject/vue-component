<template>
  <div @click="clickHandler">
    <slot />
  </div>
</template>
<script setup lang="ts">
import copy from 'copy-to-clipboard'
import type { propsType } from './types'
const props = withDefaults(defineProps<propsType>(), {
  text: '',
})
const clickHandler = () => {
  console.log('props', props)
  const { onCopy, text, ...options } = props
  const result = copy(text, options)
  if (onCopy) {
    onCopy(text, result)
  }
}
</script>

<style scoped lang="scss"></style>
