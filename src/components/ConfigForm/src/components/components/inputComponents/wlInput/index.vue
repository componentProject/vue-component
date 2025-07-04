<script setup lang="ts">
import type { FormItemConfig } from '@/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'WlInput',
})

const props = withDefaults(
  defineProps<{
    prop: string
    slots?: Record<string, any>
    model: Record<string, any>
    config: FormItemConfig['config']
  }>(),
  {
    slots: () => ({}),
    config: () => ({}),
  },
)

const show = ref(true)
const Event = ref({})
const Options = ref({})

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    props.model[props.prop] = val
  },
})

watch(
  () => props.config,
  (val) => {
    if (val) {
      show.value = val.show !== false
      if (val.Event) {
        Event.value = val.Event
      }
      if (val.Options) {
        Options.value = val.Options
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-input v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <!-- prefix 输入框头部内容，只对 type="text" 有效 -->
    <template v-if="slots.prefix" #prefix="scope">
      <slot name="prefix" v-bind="scope" />
    </template>
    <!-- suffix 输入框尾部内容，只对 type="text" 有效 -->
    <template v-if="slots.suffix" #suffix="scope">
      <slot name="suffix" v-bind="scope" />
    </template>
    <!-- prepend 输入框前置内容，只对 type="text" 有效 -->
    <template v-if="slots.prepend" #prepend="scope">
      <slot name="prepend" v-bind="scope" />
    </template>
    <!-- append 输入框后置内容，只对 type="text" 有效 -->
    <template v-if="slots.append" #append="scope">
      <slot name="append" v-bind="scope" />
    </template>
  </el-input>
</template>

<style scoped lang="scss"></style>
