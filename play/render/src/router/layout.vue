<template>
  <component :is="layout" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import layouts from '@/layout/index.ts'
import { useSystemStore } from '@/stores/modules/system.ts'

const systemInfo = useSystemStore()
const layoutType = computed(() => systemInfo.layout)
const layout = computed(() => layouts[layoutType.value])
</script>

<style lang="scss" scoped></style>
