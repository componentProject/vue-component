<template>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { provide } from 'vue'
import type { ConfigProviderPropsType } from './types'
const props=withDefaults(defineProps<ConfigProviderPropsType>(),{
})
provide('configProvider', props)
</script>

<style scoped lang="scss">

</style>
