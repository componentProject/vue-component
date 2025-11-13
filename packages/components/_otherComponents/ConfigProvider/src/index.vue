<!-- _otherComponents组件主文件 -->
<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { propsType } from './types'
import { provide } from 'vue'

const props = withDefaults(defineProps<propsType>(), {})
defineSlots<{
  default: Component
}>()
provide('configProvider', props)
</script>
