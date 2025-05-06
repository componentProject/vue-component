<template>
  <component :is="layout" />
</template>
<script setup>
import layouts from '@/layout/index.js'
import { useSystemStore } from '@/stores/system'
const systemInfo = useSystemStore()
const layoutType = computed(() => systemInfo.layout)
const layout=computed(() => layouts[layoutType.value])
</script>

<style lang="scss" scoped></style>
