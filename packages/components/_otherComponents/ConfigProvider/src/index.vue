<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import type { Component } from 'vue'
import type { propsType } from './types'

const props = withDefaults(defineProps<propsType>(), {})
defineSlots<{
  default: Component
}>()
provide('configProvider', props)
</script>
