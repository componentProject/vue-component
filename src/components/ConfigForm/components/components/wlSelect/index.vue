<template>
  <el-select v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <!-- default Option 组件列表-->
    <el-option v-bind="option" v-for="(option, index) in config.options" :key="index" />
    <!-- prefix Select 组件头部内容-->
    <template v-if="slots.prefix" #prefix="scope">
      <slot name="prefix" v-bind="scope"></slot>
    </template>
    <!-- empty 无选项时的列表-->
    <template v-if="slots.empty" #empty="scope">
      <slot name="empty" v-bind="scope"></slot>
    </template>
  </el-select>
</template>

<script setup>
import { computed, watch, ref, toRefs } from 'vue'
import { isType } from '../../utils'

const props = defineProps({
  prop: {
    type: String,
    default: '',
  },
  slots: {
    type: Object,
    default: () => ({}),
  },
  model: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({}),
  },
})

const show = ref(true)
const Event = ref({})
const Options = ref({})

const { config } = toRefs(props)

const emit = defineEmits(['update:model'])
const computedModel = computed({
  get: () => props.model[props.prop],
  set: (v) => {
    console.log('v', v)
    emit('update:model', v)
  },
})

watch(
  config,
  (v) => {
    const { show: showValue, options, event, ...restOptions } = v
    if (isType(showValue, 'boolean')) {
      show.value = !!showValue
    }
    Options.value = restOptions
    Event.value = event || {}
    if (!options) props.config.options = []
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
