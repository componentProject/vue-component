<template>
  <el-avatar v-if="show" v-bind="Options" v-on="Event">
    <!-- default自定义头像展示内容-->
    <template v-if="slots.default" #default>
      <slot name="default" />
    </template>
  </el-avatar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isType } from '../../../utils'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: Record<string, any>
    config: Record<string, any>
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

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
