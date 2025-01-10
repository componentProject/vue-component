<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import type { ConfigProviderPropsType } from './types'
const props = withDefaults(defineProps<ConfigProviderPropsType>(), {})
const slots = defineSlots<{
  default(): any
}>()
console.log('slots', slots)
provide('configProvider', props)
</script>
