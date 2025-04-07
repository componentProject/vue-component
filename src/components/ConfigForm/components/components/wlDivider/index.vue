<template>
  <el-divider v-if="show" v-bind="Options" v-on="Event" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isType } from '../../utils'

const props = defineProps<{
  prop: string
  model: Record<string, any>
  config: Record<string, any>
}>()

const show = ref(true)
const Event = ref({})
const Options = ref({})

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    Options.value = rest
    Event.value = event || {}
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
