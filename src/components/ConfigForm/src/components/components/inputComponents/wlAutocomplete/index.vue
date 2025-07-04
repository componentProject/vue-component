<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/src/utils'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: FormModelProps
    config: configType
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const emit = defineEmits(['update:model'])

const show = ref(true)
const Event = ref({})
const Options = ref({})

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    emit('update:model', val)
  },
})

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

<template>
  <el-autocomplete v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <!-- prefix 输入框头部内容，只对 type="text" 有效 -->
    <template v-if="slots.default" #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <!-- suffix 输入框尾部内容，只对 type="text" 有效 -->
    <template v-if="slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
    <!-- prepend 输入框前置内容，只对 type="text" 有效 -->
    <template v-if="slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <!-- append 输入框后置内容，只对 type="text" 有效 -->
    <template v-if="slots.append" #append>
      <slot name="append" />
    </template>
  </el-autocomplete>
</template>

<style scoped lang="scss"></style>
